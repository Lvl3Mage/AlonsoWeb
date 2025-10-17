// import InjectError from "./error-handing";

import InjectError from "./error-handing";

var $ = require("jquery");
import Swiper from "swiper";
import {Autoplay, Navigation, Pagination, EffectCards, EffectFade} from "swiper/modules";

Swiper.use([Autoplay, Navigation, Pagination, EffectCards, EffectFade]);

// import Swiper styles
import "swiper/css/bundle";

//IBG  // Also include in SCSS
// import ibg from './libs/ibg.js'
// $(document).ready(function(){
// 	ibg();
// })

//MODAL  // Also include in SCSS
// import './libs/modal.js';
// import {CloseModal, OpenModal} from './libs/modal.js';
// import InitContentReTyper from "./content-retyper";

import {CreatePreview} from "./image-preview.js";

const imagePreview = CreatePreview();
$(document).on("click", "[data-class-toggler]", function () {
	let group;
	if ($(this).data("toggle-selector")) {
		group = $($(this).data("toggle-selector"));
	}
	else if ($(this).data("toggle-parent-selector")) {
		group = $(this).closest("[data-class-toggle]");
	}
	else {
		group = $(this).closest("[data-class-toggle]");
	}
	group.toggleClass($(this).data("class-toggler"));
});
$(document).on("click", "[data-click-selectable]", function () {
	let group = $(this).closest("[data-click-selectables]");
	let elems = group.find("[data-click-selectable]");
	let cssClass = group.data("click-selectables");
	for (let elem of elems) {
		$(elem).removeClass(cssClass);
	}
	$(this).addClass(cssClass);
});


// generic dropdown
$(document).on("click", "[data-dropdown-trigger]", function () {
	const container = $(this).closest("[data-dropdown-container]");
	const dropdowns = container.find("[data-dropdown]");
	const curWrapper = $(this).closest("[data-dropdown-wrapper]");
	const curDropdown = curWrapper.find("[data-dropdown]");
	const duration = container.data("dropdown-duration") || 400;
	if (!container.is("[data-dropdown-allow-multiple]")) {
		for (let dropdown of dropdowns) {
			if (dropdown !== curDropdown[0]) {
				$(dropdown).closest("[data-dropdown-wrapper]").removeClass("active");
				$(dropdown).animate({
					height: "0px",
				}, duration);
			}
		}

	}
	if (curWrapper.hasClass("active")) {
		curWrapper.removeClass("active");
		curDropdown.animate({
			height: 0 + "px",
		}, duration);
	}
	else {
		curWrapper.addClass("active");
		curDropdown.animate({
			height: curDropdown.children().css("height"),
		}, duration);

	}
});
$(document).on("click", "[data-previewable-image]", function () {
	let collectionContainer = $(this).closest("[data-previewable-collection]");
	if (collectionContainer.length === 0) {
		imagePreview.OpenImage($(this).closest("img"));
	}
	else {
		let collection = collectionContainer.find("[data-previewable-image], [data-previewable-url]");
		console.log(collection);
		let imageCollectionIndex = collection.index($(this));
		console.log(imageCollectionIndex);
		let imageCollectionURL = [];
		for (let collectionElement of collection) {
			if ($(collectionElement).attr("data-previewable-url")) {
				imageCollectionURL.push($(collectionElement).attr("data-previewable-url"));
			}
			else if ($(collectionElement).is("img")) {
				imageCollectionURL.push($(collectionElement).attr("src"));
			}
		}
		console.log(imageCollectionURL);
		imagePreview.OpenURLCollection(imageCollectionURL, imageCollectionIndex);
	}
});
$(document).ready(function () {
	InitWithCustomConfigs("[data-slider-config]", "slider-config", (elem, config) => {
		console.log(elem,config);
		new Swiper(elem[0], config);
	});
});

	function InitWithCustomConfigs(selector, configSource, Init) {
		const elems = $(selector);
		for (let elem of elems) {
			elem = $(elem);
			const config = elem.data(configSource);
			if (typeof config !== "object") {
				console.error("Config is not an object \n" + config);
				// console.error("Slider config: ", config);
				InjectError(elem, "Config is not an object \n" + config);
				continue;
			}
			Init(elem, config);
		}
	}
