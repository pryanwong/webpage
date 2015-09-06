(function() {

function TextDragger(label, color, loc) {
    this.Container_constructor();
	this.color = color;
	this.name = label;
	this.textWidth = "";
	this.textHeight = "";
	this.divId = "";
	this.boxpic = 0;
	this.textVal = "Hello World jquery";
	this.setup();
}

var p = createjs.extend(TextDragger, createjs.Container);

p.doodle = function() {
	this.mouseChildren = false;
	var divText = "<div id='" + this.id + "'>";
	$('#body').append(divText);
	this.divId = '#' + this.id;
	$(this.divId).attr('class', 'padded');
	$(this.divId).append("<TEXTAREA id='textBoxMultiline' easeljsid=" + this.divId + " COLS=40 ROWS=2>");
	$(this.divId).find( "TEXTAREA" ).val(this.textVal);
	$(this.divId).find( "TEXTAREA" ).resizable({
         resize: this.textresize 
    });
	textAreaBox = $(this.divId).get(0);
    textDOMElement = new createjs.DOMElement(textAreaBox);
	stage2.addChild(textDOMElement);
	$(this.divId).draggable();
	$(this.divId).bind("mousedown", this.showContextMenu);
	
	var paddingL = $(this.divId).css('padding-left').replace("px", "");
	var paddingT = $(this.divId).css('padding-top').replace("px", "");
	var paddingR = $(this.divId).css('padding-right').replace("px", "");
	var paddingB = $(this.divId).css('padding-bottom').replace("px", "");
	var offL = stage2.canvas.offsetLeft - paddingL;
	var offT = stage2.canvas.offsetTop - paddingT;
	var boxW  = $(this.divId).find( "TEXTAREA" )[0].clientWidth;
	var boxH  = $(this.divId).find( "TEXTAREA" )[0].clientHeight;
	this.textWidth = boxW;
	this.textHeight = boxH;
	this.name = "textarea" + draggerCount;
	
	
	var offL2 = (stage2.canvas.offsetWidth + offL - boxW - paddingR);
	var offT2 = (stage2.canvas.offsetHeight + offT - boxH - paddingB);
	
	var boundaries = [offL, offT, offL2, offT2];
	var posY = offT + "px";
	var posX = offL + "px";
	$(this.divId).css('top',posY);
    $(this.divId).css('left',posX);
	$(this.divId).draggable( "option", "containment", boundaries );
	//$(this.divId).hide();
} ;


p.handleClick = function (event) {
    if (contextmenuon == false) {
	   var posY = event.stageY;
	   var posX = event.stageX;
	   $(this.divId).css('top',posY);
       $(this.divId).css('left',posX);
	   $(this.divId).show();
	}
	if (contextmenuon == true) {
	   var posY = event.stageY - event.currentTarget.y;
	   var posX = event.stageX - event.currentTarget.x;
	   $(this.divId).css('top',posY);
       $(this.divId).css('left',posX);
	   $(this.divId).show();
	   $('#glossymenu').attr('class', 'hide');
	   contextmenuon = false;
	} 
	
} ;

p.removeText = function ( divId ) {
   
   console.log("Remove Text");
   console.log("divId: " + divId);
   console.log($('#' + divId).find( "TEXTAREA" ));
   var boxpic = $('#' + divId).find( "TEXTAREA" ).attr("easeljsid");
   
   console.log("stage");
   console.log(stage2);
   console.log("-----");
   var found = false;
   var textBox = "";
   var iterator = 0;
   console.log("Children Length: " + stage2.children.length);
   console.log("!found: " + !found);
   console.log("condition: " + (!found && (iterator < stage2.children.length)));
   while(!found && (iterator < stage2.children.length)) {
      textBox = stage2.getChildAt(iterator);
	  if (textBox.id == divId) {
	     found = true;
	  }
	  iterator++;
   }
   if (found) {
      console.log(textBox);
	  var removedchild = stage2.removeChild(textBox);
      console.log("Removed Child: " + removedchild);
   }
  
   $('#' + divId).remove();
   $('#glossymenu').remove();
   contextmenuon = false;
   
   stage2.update();
};
   
	   

p.showContextMenu = function( e ) { 
	var targetId = e.currentTarget.id;
	activeObject = true;
	activeObjectRef = e.currentTarget;
	console.log("In Context Menu");
	console.log(targetId);
	console.log(e.currentTarget);
	console.log("Property exists e.button: " + (typeof(e.button) !== undefined));
	console.log("Property exists e.nativeEvent.button: " + (typeof(e.nativeEvent) !== undefined));
	var buttonNumber = -1;
	if ( e.nativeEvent !== undefined ) {
	     buttonNumber = e.nativeEvent.button;
	}
	if ( e.button !== undefined ) {
	    buttonNumber = e.button;
	}
    if ( buttonNumber == 2) { 
	    document.removeEventListener('contextmenu', handler);
		handler = function(e) {
			if (contextmenuon == false && activeObject == true) {
               e.preventDefault();
			   var items = ["Delete", "BG Color","Font Color", "Change Text"];
			   menus(items, e);
		       $('#glossymenu').attr('className', 'glossymenu');
			   $('a:contains("Delete")').click(  function() {p.removeText( targetId )}   );
			   $('a:contains("BG Color")').click( function() {document.getElementById('myColor').color.showPicker(); 
			                                                  $('#glossymenu').remove(); 
																 contextmenuon = false;
																 stage2.update();});
			   $('a:contains("Font Color")').click( function() { console.log("Font Color selected");
			                                                     document.getElementById('myFontColor').color.showPicker(); 
			                                                     $('#glossymenu').remove(); 
																 contextmenuon = false;
																 stage2.update();});
			   $('a:contains("Change Text")').click(function() {p.changeText( e );});
			   contextmenuon = true;
			}
	    }
	    document.addEventListener('contextmenu', handler, false);
    } else {
	   this.startP = new Point(e.stageX - e.currentTarget.x , e.stageY - e.currentTarget.y);
       $('#' + targetId).find( "TEXTAREA" ).focus();
	   activeObject = true;
       activeTextId = targetId;
	   activeObjectRef = e.currentTarget;
	   return true;
	}
	return false;
};


p.handleRollOver = function(event) {       
	if (event.type == "rollover") {
	    this.alpha = 0.4;
		activeObject = true;
		activeObjectId = stage2.getChildIndex(this);
	} else {
	    this.alpha = 1;	
		activeObject = false;
    }
	stage2.update();
};

p.handlePressMove = function(evt) {
		var next  = new Point(evt.stageX - this.startP.getX()  ,evt.stageY - this.startP.getY()  );
		var objectWidth  = (evt.currentTarget.getBounds()).width;
		var objectHeight = (evt.currentTarget.getBounds()).height;
		
		var pnt1       = new Point(next.getX(), next.getY());
		var pnt2       = new Point(next.getX() + objectWidth, next.getY());
		var pnt3       = new Point(next.getX(), next.getY() + objectHeight);
		var pnt4       = new Point(next.getX() + objectWidth, next.getY() + objectHeight);
		
		if (pnt1.inbounds(stage2) && pnt2.inbounds(stage2) && pnt3.inbounds(stage2) && pnt4.inbounds(stage2)) {
		   evt.currentTarget.x = next.getX();
		   evt.currentTarget.y = next.getY();
		   stage2.update();  
        }		   
	};
	
p.textresize = function() {
        var $this = $(this).find("TEXTAREA");
		easeljsid = $this.attr("easeljsid");
        var boxW  = $(this).find("TEXTAREA")[0].offsetWidth;
	    var boxH  = $(this).find("TEXTAREA")[0].offsetHeight;
        if (boxW != $this.data('x') || boxH != $this.data('y')) {
		    var paddingL = $this.css('padding-left').replace("px", "");
	        var paddingT = $this.css('padding-top').replace("px", "");
	        var paddingR = $this.css('padding-right').replace("px", "");
	        var paddingB = $this.css('padding-bottom').replace("px", "");
	        var offL = stage2.canvas.offsetLeft - paddingL;
	        var offT = stage2.canvas.offsetTop - paddingT;
	        this.textWidth = boxW;
	        this.textHeight = boxH;
	        var boxW  = $(this).find("TEXTAREA")[0].offsetWidth;
	        var boxH  = $(this).find("TEXTAREA")[0].offsetHeight;
	        var offL2 = (stage2.canvas.offsetWidth + offL - boxW);
	        var offT2 = (stage2.canvas.offsetHeight + offT - boxH);
			var x = stage2.getChildAt(easeljsid);
     	    var boundaries = [offL, offT, offL2, offT2];
			$divId = $this.parent().parent();
			$divId.draggable( "option", "containment", boundaries );
        }

        $this.data('x', boxW);
        $this.data('y', boxH);
    };

p.setup = function(location) {
    this.doodle();
	draggerCount = draggerCount +1;
	this.on("click", this.handleClick);
	this.on("rollover", this.handleRollOver);
	this.on("rollout", this.handleRollOver);
	this.on("pressmove", this.handlePressMove);
	this.on("mousedown", this.showContextMenu);
	this.on("mouseup", this.textresize);
};
window.TextDragger = createjs.promote(TextDragger, "Container");
}());
