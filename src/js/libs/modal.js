var $ = require( "jquery" );

$(document).on('click', '[data-modal-trigger]', function(event) {
	$("body").css("overflow", "hidden");

	var modalID = $(this).data('modal-id');
	var modal = $("#" + modalID + ".modal");
	modal.addClass("modal-active");

	var modalTitle = $(this).data('modal-title');
	if(typeof modalTitle !== 'undefined'){
		modal.find(".modal-title").html(modalTitle);
	}
	// let modalFieldPresets= $(this).data('field-presets');
	// if(modalFieldPresets){
	// 	for (let i = 0; i < modalFieldPresets.length; i++) {
	// 		modal.find(modalFieldPresets[i].childSelector).val(modalFieldPresets[i].value);
	// 	}
	// }
});
$(document).on('mousedown touchstart', '.modal-bg, .modal-cross', function(event) {
	$("body").css("overflow", "visible");
	var modal = $(this).closest(".modal");
	modal.removeClass("modal-active");

	//pause video
	modal.find('iframe').each(function(){
		$(this).attr("src", $(this).attr("src"));
	});

});
$(document).on('mousedown touchstart', '.modal-window', function(event) {
	event.stopPropagation();
});
export function OpenModal(modalSelector){
	$("body").css("overflow", "hidden");
	$(modalSelector).addClass("modal-active");
}
export function CloseModal(modalSelector){ // disables modal and frees body if no active modals remain
	var modal = $(modalSelector).closest(".modal");
	modal.removeClass("modal-active");
	if($('.modal-active').length == 0){
		$("body").css("overflow", "visible");	
	}
}


/*
HTML

<div class="def-modal modal modal-bg">
	<div class="def-modal__outer-container container">
		<div class="def-modal__inner-container def-modal__inner-container--100">
			<div class="def-modal__wrapper modal-window p-2 rounded-xl">
				<div class="def-modal__top mb-2 px-2">
					<div class="def-modal__title text-2xl">
						<span class="modal-title">Modal title</span>
					</div>
					<div class="group/cross relative h-[30px] w-[35px] flex-col justify-center flex cursor-pointer modal-cross">
						<div class="bg-gray-400 h-[4px] w-full transition duration-300 rounded-sm ease-out-wobble group-hover/cross:scale-x-75 translate-y-[2px] rotate-[135deg]"></div>
						<div class="bg-gray-400 h-[4px] w-full transition duration-300 rounded-sm ease-out-wobble group-hover/cross:scale-x-75 translate-y-[-2px] rotate-[-135deg]"></div>
					</div>
				</div>
				<div class="def-modal__content-wrapper modal-content-wrapper">
				</div>
			</div>
		</div>  
	</div>
</div>
*/