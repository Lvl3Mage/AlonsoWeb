const $ = require("jquery");
class CollectionPreview{
	previousBtn = null;
	nextBtn = null;
	imageViews = [];
	modal = null;
	collection = []
	collectionIndex = 0;
	closeBtn = null;
	constructor(modal,previousBtn, nextBtn, closeBtn, imageViews){
		this.previousBtn = previousBtn;
		this.imageViews = imageViews;
		this.nextBtn = nextBtn;
		this.closeBtn = closeBtn;
		this.modal = modal;
		previousBtn.on("click", this.CollectionBack.bind(this));
		nextBtn.on("click", this.CollectionForward.bind(this));
		closeBtn.on("click", this.Close.bind(this));
	}
	CollectionForward(){
		if(this.collection.length === 0){
			return;
		}
		this.collectionIndex++;
		console.log(this.collectionIndex);
		if(this.collectionIndex >= this.collection.length){
			this.collectionIndex = 0;
		}
		this.Update();

	}
	CollectionBack(){
		if(this.collection.length === 0){
			return;
		}
		this.collectionIndex--;
		console.log(this.collectionIndex);
		if(this.collectionIndex < 0){
			this.collectionIndex = this.collection.length - 1;
		}
		this.Update();

	}
	Update(){
		if(this.collection.length === 0){
			return;
		}
		if(this.collectionIndex >= this.collection.length){
			this.collectionIndex = 0;
		}
		for(let imageView of this.imageViews){
			$(imageView).attr("src", this.collection[this.collectionIndex]);
		}
		this.previousBtn.toggleClass("hidden", this.collection.length === 1);
		this.nextBtn.toggleClass("hidden",this.collection.length === 1);
	}
	OpenURLCollection(urlCollection, index = 0){
		if(index >= urlCollection.length){
			return;
		}
		$("body").css("overflow", "hidden");
		this.modal.addClass("active");
		this.collection = urlCollection;
		this.collectionIndex = index;
		this.Update();
	}

	OpenImage(imgElement){
		this.OpenURL(imgElement.attr("src"));
	}
	OpenURL(url){
		this.OpenURLCollection([url])
	}
	Close(){
		$("body").css("overflow", "visible");
		this.modal.removeClass("active");
	}
}
function AnimatePreview(image, imageContainer, e){
	let mouseX = e.pageX - imageContainer.offset().left;
	let mouseY = e.pageY - imageContainer.offset().top;
	let width = imageContainer.width();
	let height = imageContainer.height();
	let relX = mouseX/width;
	let relY = mouseY/height;
	relX = Math.min(1, Math.max(0, relX));
	relY = Math.min(1, Math.max(0, relY));
	relX = 0.5 * (0.5 - relX);
	relY = 0.5 * (0.5 - relY);
	// image.stop().animate({
	//     transform: `scale(2) translate(${0.5-relX*100}%, ${0.5-relY*100}%)`
	// },100)
	image.css("transform", `scale(2) translate(${relX*100}%, ${relY*100}%)`);
}
function CreatePreview(){
	let modal = $(`
    <div class="fixed top-0 left-0 right-0 bottom-0 [.active]:opacity-100 [.active]:pointer-events-auto pointer-events-none transition duration-500 opacity-0 bg-black/80 z-50">
        <div class="select-none w-full h-full flex justify-center items-center  md:p-15">
            <div class="w-full h-full relative overflow-hidden [.zoom-in]:cursor-zoom-out cursor-zoom-in">
                <img class=" w-full h-full object-contain min-w-0 min-h-0" src="" alt="" data-image-preview data-desktop-image-preview>
                <div class="w-full h-full z-10 absolute top-0 left-0 overflow-auto md:hidden flex items-center">
                    <img src="" class="max-w-none w-[200%] h-auto" alt="" data-image-preview data-mobile-image-preview>
                </div>
            </div>
        </div>
        <div class="absolute z-20 right-4 top-4 group/close bg-surface rounded-full p-3 hover:bg-beige-500 hover:scale-90 hover:shadow transition  cursor-pointer" data-image-preview-close>
            <div class="cross-6/3 cross-rounded text-beige-500 group-hover/close:text-black group-hover/close:scale-80 group-hover/close:rotate-12 transition duration-500 ease-out-spring"></div>
        </div>
        <div class="absolute z-10 left-4 top-0 bottom-0 flex items-center">
            <div class=" group/close bg-surface rounded-full p-3 hover:bg-beige-500 hover:scale-90 hover:shadow transition  cursor-pointer" data-image-collection-back>
                <div class="text-beige-500 group-hover/close:text-black group-hover/close:scale-80 group-hover/close:-translate-x-1 transition duration-500 ease-out-spring">
                    <i class="fa-solid fa-chevron-left"></i>
                </div>
            </div>
        </div>
        <div class="absolute z-10 right-4 top-0 bottom-0 flex items-center">
            <div class=" group/close bg-surface rounded-full p-3 hover:bg-beige-500 hover:scale-90 hover:shadow transition  cursor-pointer" data-image-collection-forward>
                <div class="text-beige-500 group-hover/close:text-black group-hover/close:scale-80 group-hover/close:translate-x-1 transition duration-500 ease-out-spring">
                    <i class="fa-solid fa-chevron-right"></i>
                </div>
            </div>
        </div>
    </div>`);
	$("body").append(modal);
	let previousBtn = modal.find("[data-image-collection-back]");
	let nextBtn = modal.find("[data-image-collection-forward]");
	let closeBtn = modal.find("[data-image-preview-close]");
	let imageViews = modal.find("[data-image-preview]");
	const collectionPreview = new CollectionPreview(modal, previousBtn, nextBtn, closeBtn, imageViews);

	let zoomed = false;
	let desktopImage = modal.find("[data-desktop-image-preview]");
	let desktopImageContainer = desktopImage.parent();
	desktopImageContainer.on("click", function(e){

		if(window.innerWidth <= 768) {
			return;
		}
		if(zoomed){
			modal.off("mousemove.preview");
			desktopImage.css("transform", "scale(1) translate(0, 0)");
			desktopImageContainer.removeClass("zoom-in");
		}
		else{
			desktopImageContainer.addClass("zoom-in");
			AnimatePreview(desktopImage, desktopImageContainer,e);
			modal.on("mousemove.preview", function(e){
				AnimatePreview(desktopImage, desktopImageContainer,e);
			})
		}
		zoomed = !zoomed;
	});
	$(document).on("keyup", function(e){
		if(e.key === "Escape"){
			collectionPreview.Close();
		}
	})
	return collectionPreview;

}

export {CreatePreview};