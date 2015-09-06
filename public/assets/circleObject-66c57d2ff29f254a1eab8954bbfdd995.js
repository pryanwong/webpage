(function() {

function CircleDragger(label, color, loc) {
    this.Container_constructor();
	this.color = color;
	this.label = label;
	this.pos1Selected = false;
	this.pos2Selected = false;
	this.setup();
}

var p = createjs.extend(CircleDragger, createjs.Container);

p.setup = function() {
    this.doodle();
	draggerCount = draggerCount +1;
	this.on("click", this.handleClick);
	this.on("rollover", this.handleRollOver);
	this.on("rollout", this.handleRollOver);
	this.on("pressmove", this.handlePressMove);
	this.on("mousedown", this.recordInitial);
};

p.doodle = function() {
    
	var circle = new createjs.Shape();
	this.radius = 40;
    circle.graphics.setStrokeStyle(1).beginStroke(this.color).drawCircle(0,0,this.radius);
    this.addChild(circle);
	this.mouseChildren = false;
	this.point0 = new Point(0,20);
	this.point1 = new Point(10,50);
	this.startP = new Point(0,0);
	this.name = "line" + draggerCount;
	this.label = "CircleDragger";
    this.x = this.y = 100;
	
};

p.handleClick = function (event) {
	if (contextmenuon == true) {
	   $('#glossymenu').attr('class', 'hide');
	   contextmenuon = false;
	   activeObjectRef = "";
	} else {
	   activeObjectRef = this;
	}
	
} ;


p.showContextMenu = function( e ) { 
    if ( e.nativeEvent.button == 2) { 
	    document.removeEventListener('contextmenu',handler);
		activeObjectRef = this;
		console.log(activeObjectRef);
		handler = function(e) {
			if (contextmenuon == false && activeObject == true) {
               e.preventDefault();
			   var items = ["Color", "Delete"];
			   menus(items, e);
		       $('#glossymenu').attr('className', 'glossymenu');
			   $('a:contains("Color")').click( function() {document.getElementById('myColor').color.showPicker(); 
			                                                  $('#glossymenu').remove(); 
																 contextmenuon = false;
																 stage2.update();});
			   $('a:contains("Delete")').click(  function() {p.remove();}   );
			   contextmenuon = true;
			};
        }
	    document.addEventListener('contextmenu', handler, false);
    } else {
		this.startP = new Point(e.stageX - e.currentTarget.x , e.stageY - e.currentTarget.y);
	}
};

p.remove = function (  ) {
   stage2.removeChildAt(activeObjectId);
   $('#glossymenu').remove();
   contextmenuon = false;
   $('#LabelFormDiv').attr('class', 'hide');
   stage2.update();
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

p.recordInitial = function(e) {
	  this.initial = new Point(e.stageX - e.currentTarget.x ,e.stageY - e.currentTarget.y );
	  this.showContextMenu(e);
};

p.handlePressMove = function(evt) {
		
	  var startP = new Point(this.x, this.y);
	  var real = new Point(this.point0.getX() + this.x , this.point0.getY() + this.y);
	  var real1 = new Point(this.point1.getX() + this.x , this.point1.getY() + this.y);
	  var delta = 10;
	  var deltaP = new Point(evt.stageX - this.x  , evt.stageY - this.y);
	  var clicked = new Point(evt.stageX  , evt.stageY  );
	  if (clicked.near(real, delta))
	  {
		 this.point0  = new Point( evt.stageX - this.x , evt.stageY - this.y );
	  }
	  else if(clicked.near(real1, delta))
	  {
		 this.point1  = new Point(evt.stageX - this.x  ,evt.stageY - this.y );
	  }
	  else 
	  { 
	    if (activeObject) {
		   var nextP = new Point(evt.stageX - this.initial.getX() , evt.stageY - this.initial.getY());
		   
		   var pnt1       = new Point(nextP.getX() + this.point0.getX(), nextP.getY() + this.point0.getY());
		   var pnt2       = new Point(nextP.getX() + this.point1.getX(), nextP.getY() + this.point1.getY());
		   
		   if ( pnt1.inbounds(stage2) && pnt2.inbounds(stage2) ) {
		      evt.currentTarget.x = nextP.getX();
		      evt.currentTarget.y = nextP.getY();
		      stage2.update();  
           }
		}
	  }
	  stage2.update(); 
	};
	
p.drawCircle = function(evt, Point0, Point1, strokeStyle, colorStyle) {
  // evt.currentTarget.getChildAt(0).graphics.clear().setStrokeStyle(strokeStyle).beginStroke(colorStyle);
  // evt.currentTarget.getChildAt(0).graphics.moveTo(Point0.getX(),Point0.getY());
  // evt.currentTarget.getChildAt(0).graphics.lineTo(Point1.getX(),Point1.getY());
  // evt.currentTarget.getChildAt(0).graphics.endStroke();
}
window.CircleDragger = createjs.promote(CircleDragger, "Container");
}());
