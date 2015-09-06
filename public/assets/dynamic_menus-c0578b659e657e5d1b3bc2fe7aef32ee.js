function menus(items, event) {
        $('#body').append("<div id='glossymenu' class='glossymenu'>");
	    $('#glossymenu').append("<ul id='ulglossymenu'>");
		for (index=0; index < items.length; index++) {
	         $('#ulglossymenu').append("<li> <a>" + items[index] + "</a> </li>");
	    }
		$('#glossymenu').append("</ul>");
		$('#body').append("</div>");
		console.log("Menu Position");
		console.log(event);
		var posY = event.clientY + "px";
		var posX = event.clientX + "px";
		console.log("PosX : " + event.clientX);
		console.log("PosY : " + event.clientY);
		$('#glossymenu').css('top',posY);
        $('#glossymenu').css('left',posX);
};
