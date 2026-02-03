const fs = require('fs')
const path = require('path')
const VirtualModules = require('webpack-virtual-modules')

function toPascal(str) {
	return str.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase())
}

function extractIcons(rootDir) {
	const files = []
	const exts = ['.html', '.vue']
	function walk(dir) {
		for (const f of fs.readdirSync(dir)) {
			const full = path.join(dir, f)
			const stat = fs.statSync(full)
			if (stat.isDirectory()) walk(full)
			else if (exts.includes(path.extname(full))) files.push(full)
		}
	}
	walk(rootDir)

	const tagRegex = /<i[^>]*class=["']([^"']*)["'][^>]*>/g
	const found = new Set()

	for (const file of files) {
		const content = fs.readFileSync(file, 'utf-8')
		let match
		while ((match = tagRegex.exec(content))) {
			const classes = match[1].split(/\s+/)
			const style = classes.find(c => /fa-(solid|regular|brands)/.test(c))
			const icon = classes.find(c => /^fa-[a-z0-9-]+$/.test(c) && !/^fa-(solid|regular|brands)$/.test(c))
			if (style && icon) found.add(`${style.replace('fa-', '')}:${icon.replace('fa-', '')}`)
		}
	}
	return found
}

class FontAwesomeAutoImportPlugin {
	constructor(options = {}) {
		this.options = { rootDir: './src', ...options }
		this.virtualModules = new VirtualModules()
	}

	apply(compiler) {
		this.virtualModules.apply(compiler)

		compiler.hooks.beforeCompile.tap('FontAwesomeAutoImportPlugin', () => {
			const icons = extractIcons(path.resolve(this.options.rootDir))
			const grouped = { solid: [], regular: [], brands: [] }

			for (const entry of icons) {
				const [style, icon] = entry.split(':')
				grouped[style].push(icon)
			}

			let code = `import { library, dom } from '@fortawesome/fontawesome-svg-core'\n`

			for (const [style, icons] of Object.entries(grouped)) {
				if (!icons.length) continue
				const packageName =
					style === 'solid'
						? '@fortawesome/free-solid-svg-icons'
						: style === 'brands'
							? '@fortawesome/free-brands-svg-icons'
							: '@fortawesome/free-regular-svg-icons'

				for (const icon of icons) {
					const iconVar = 'fa' + toPascal(icon)
					// import each icon from its submodule
					code += `import {${iconVar}} from '${packageName}/${iconVar}'\n`
				}
			}

			// Add all icons to library
			const all = [...icons].map(i => 'fa' + toPascal(i.split(':')[1])).join(', ')
			code += `\nlibrary.add(${all})\ndom.watch()\n`

			this.virtualModules.writeModule('node_modules/virtual-fontawesome-auto.js', code)
			console.log(`✅ FontAwesomeAutoImportPlugin: ${icons.size} icons injected`)
		})
	}
}

module.exports = FontAwesomeAutoImportPlugin
