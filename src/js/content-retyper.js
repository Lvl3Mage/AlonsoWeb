import InjectError from "./error-handing";

export default function InitContentReTyper(elem, config){
	const randomize = typeof config.random === "string" ? config.random.toLowerCase() === "true" : false;
	const variants = config.variants;
	if(typeof variants !== "object"){
		InjectError(elem, "Variants must be an array");
	}
	if(variants.length === 0) {
		InjectError(elem, "No variants provided");
		return;
	}
	const emptyDelayMin = config.emptyDelayRange[0] !== undefined ? config.emptyDelayRange[0] : 1000;
	const emptyDelayMax = config.emptyDelayRange[1] !== undefined ? config.emptyDelayRange[1] : 2000;
	const fullDelayMin = config.fullDelayRange[0] !== undefined ? config.fullDelayRange[0] : 1000;
	const fullDelayMax = config.fullDelayRange[1] !== undefined ? config.fullDelayRange[1] : 2000;
	const typingSpeed = config.typingSpeed === undefined ? 100 : parseInt(config.typingSpeed);
	const initialDelay = config.initialDelay === undefined ? 0 : parseInt(config.initialDelay);

	async function UnTypeText() {
		let textArray = elem.text().split("");
		for(let i = textArray.length; i > 0; i--){
			await new Promise(resolve => setTimeout(resolve, typingSpeed));
			elem.text(textArray.slice(0, i-1).join(""));
		}
	}

	async function TypeText(text){
		let textArray = text.split("");
		for(let i = 0; i < textArray.length; i++){
			await new Promise(resolve => setTimeout(resolve, typingSpeed));
			elem.text(textArray.slice(0, i+1).join(""));
		}
	}
	function SelectText(){
		const currentText = elem.text();
		let newText = "";
		if(randomize) {
			const possibleTexts = variants.filter(variant => variant !== currentText);
			if (possibleTexts.length === 0) {
				newText = variants[Math.floor(Math.random() * variants.length)];
			}
			else {
				newText = possibleTexts[Math.floor(Math.random() * possibleTexts.length)];
			}
		}
		else {
			const currentIndex = variants.indexOf(currentText);
			if (currentIndex === -1) {
				newText = variants[0];
			}
			else if (currentIndex === variants.length - 1) {
				newText = variants[0];
			}
			else {
				newText = variants[currentIndex + 1];
			}
		}
		return newText;
	}
	async function TypeNext(){
		let newText = SelectText();
		await UnTypeText();

		await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (emptyDelayMax - emptyDelayMin + 1) + emptyDelayMin)));

		await TypeText(newText);
		await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (fullDelayMax - fullDelayMin + 1) + fullDelayMin)));

	}
	async function StartTyping(){
		elem.text(SelectText())
		await new Promise(resolve => setTimeout(resolve, initialDelay));
		while(true){
			await TypeNext();
		}
	}
	StartTyping();
}