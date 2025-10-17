const $ = require("jquery");

export default function InjectError(elem, error){
	const elemOffset = elem.offset();
	error = error.replace("\n", "<br>");
	const errorElemHTML = `
		<div class="absolute left-0 right-0 m-auto active group/error pointer-events-none [.active]:pointer-events-auto" style="top: ${elemOffset.top}px; z-index: 9999;">
			<div class="absolute right-0 w-5 pointer-events-auto">
				<div class="absolute right-2 hover:scale-125 transition text-xl bg-red-700 text-white rounded-full w-5 h-5 flex justify-center items-center cursor-pointer" data-error-show>
					!
				</div>
			
			</div>
			<div class="w-full opacity-0 group-[.active]/error:opacity-100  px-10 transition">
				<div class="bg-red-300 border border-red-500 text-red-700 px-4 py-3 rounded flex justify-between" role="alert">
					<div class="">
						${error}
					</div>
					<div class="cursor-pointer" data-error-close>
						<i class="fa-solid fa-xmark"></i>
					</div>
				</div>
			</div>
		</div>
	`;
	let errorElem = $(errorElemHTML);
	$("body").append(errorElem);
	errorElem.find("[data-error-close]").on("click", function(){
		errorElem.remove();
	});
	errorElem.find("[data-error-show]").on("click", function(){
		errorElem.toggleClass("active");
	});

}