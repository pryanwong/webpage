(function() {

function TextDragger(label, color, loc) {
    this.Container_constructor();
	this.color = color;
	this.name = label;
	this.setup();
}

var p = createjs.extend(TextDragger, createjs.Container);

p.doodle = function() {
    var text = new createjs.Text("Hello World", "12px Arial", "#000000");
    text.x = 0;
	text.y = 0;
	text.lineWidth = 100;
	var shape = new createjs.Shape();
    shape.graphics.beginFill("#FFFFFF").beginStroke("#000").setStrokeStyle(1).drawRect(0, 0, 100, 100);
	shape.setBounds(0,0,100,100);
	shape.x = 0;
	shape.y = 0;
	this.mouseChildren = false;
	this.addChild(shape);
	this.addChild(text);
	this.point0 = new Point(0,0);
	this.point1 = new Point(0,0);
    this.x = this.y = 100;	
	this.startX = this.startY = 0;
} ;

p.handleClick = function (event) {
	if (contextmenuon == true) {
	   $('#glossymenu').attr('class', 'hide');
	   contextmenuon = false;
	} 
	
} ;

p.changeText = function ( e ) {
   $('#TextFormDiv').addClass('hide').removeClass('show');
   document.getElementById("TextForm").action="javascript:textsubmit();";
   var labelText = stage2.getChildAt(activeObjectId).getChildAt(1).text;
   $('#textBoxMultiline').val(labelText);
   $('#glossymenu').remove();
   contextmenuon = false;
   $("#activeTextObjectId").attr('type','hidden');
   $("#activeObjectId").attr('value',activeObjectId);
   $('#TextFormDiv').addClass('show').removeClass('hide');
   form = $('#TextFormDiv').get(0);
   formDOMElement = new createjs.DOMElement(form);
   var field = stage2.addChild(formDOMElement);
   field.x = e.x;
   field.y = e.y;
   stage2.update();
}

p.removeText = function (  ) {
   stage2.removeChildAt(activeObjectId);
   $('#glossymenu').remove();
   contextmenuon = false;
   $('#TextFormDiv').attr('class', 'hide');
   stage2.update();
};
   
	   

p.showContextMenu = function( e ) { 
    if ( e.nativeEvent.button == 2) { 
	    document.removeEventListener('contextmenu', handler);
		handler = function(e) {
			if (contextmenuon == false && activeObject == true) {
               e.preventDefault();
			   var items = ["Delete", "Change Text"];
			   menus(items, e);
		       $('#glossymenu').attr('className', 'glossymenu');
			   $('a:contains("Delete")').click(  function() {p.removeText();}   );
			   $('a:contains("Change Text")').click(function() {p.changeText( e );});
			   contextmenuon = true;
			}
	    }
	    document.addEventListener('contextmenu', handler, false);
    } else {
		this.startP = new Point(e.stageX - e.currentTarget.x , e.stageY - e.currentTarget.y);
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
		var bounds = evt.currentTarget.getChildAt(0).getBounds();
		var objectWidth  = bounds.width;
		var objectHeight = bounds.height;
		
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
	
	p.setup = function(location) {
    this.doodle();
	draggerCount = draggerCount +1;
	this.on("click", this.handleClick);
	this.on("rollover", this.handleRollOver);
	this.on("rollout", this.handleRollOver);
	this.on("pressmove", this.handlePressMove);
	this.on("mousedown", this.showContextMenu);
};
window.TextDragger = createjs.promote(TextDragger, "Container");
}());