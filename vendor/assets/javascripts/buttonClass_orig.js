function moveHandler()
     {
       //console.log("In moveHandler");
	   if (stage.mouseInBounds == true) {
         mouseBp.x = stage.mouseX;
         mouseBp.y = stage.mouseY;
	   } else {
	     mouseBp.x = -9999;
         mouseBp.y = -9999;
	   }
     }
	 
function moveHandler2()
     {
	   if (stage2.mouseInBounds == true) {
	     mouseBp2.x = stage2.mouseX;
         mouseBp2.y = stage2.mouseY;
	   } else {
	     mouseBp2.x = -9999;
         mouseBp2.y = -9999;
	   }
	   
     }
	 
function mouseDrag(button, name, icon)
{
  if (this.pendingDrop) {
	   console.log("In Pending Drop");
	   cursorRevert();
  } else {
        console.log("In mouse Drag Else");
	    buttonSelected = button;
		buttonActive = true;
	    button.alpha = 0.4;
		button.pendingDrop = true;
		stage.cursor = "none";
	    stage2.cursor = "none";
		console.log(imagequeue.getItems(true));
		mouseBp  = new createjs.Bitmap(imagequeue.getResult("NO"));
	    mouseBp2  = new createjs.Bitmap(imagequeue.getResult(icon));
	    mouseBp.x = -9999;
		mouseBp2.x = -9999;
		mouseBp.name = name;
		mouseBp2.name = name;
		buttonName = name;
	    stage.addChild(mouseBp);
	    stage2.addChild(mouseBp2);
        stage.addEventListener("stagemousemove", moveHandler);
	    stage2.addEventListener("stagemousemove", moveHandler2);
		stage.update();
		stage2.update();
    } 
}

(function() {

function Button(label, color) {
	this.Container_constructor();
	this.pendingDrop = false;
	this.color = color;
	this.label = label;
	
	this.setup();
}

var p = createjs.extend(Button, createjs.Container);


p.setup = function() {
	var text = new createjs.Text(this.label, "12px Arial", "#000");
	text.textBaseline = "bottom";
	text.textAlign = "center";
	
	//var width = text.getMeasuredWidth()+30;
	//var height = text.getMeasuredHeight()+20;
	
	var width = 60;
	var height = 40;
	text.x = width/2;
	text.y = 40;
	
	var background = new createjs.Shape();
	var hit = new createjs.Shape();
	hit.graphics.beginFill("white").drawRect(0,0,width,height,10);
	console.log("Adding Image");
	console.log(this.label);
	var m = new createjs.Matrix2D;
    m.translate(10, 10);
	//background.graphics.beginStroke("black").beginBitmapFill(imagequeue.getResult(this.label), "no-repeat").drawRect(0,0,width,height,10).beginBitmapFill(imagequeue.getResult("IED"),"no-repeat");
	background.graphics.beginStroke("black").beginFill("red").beginBitmapFill(imagequeue.getResult((this.label).concat("_icon")), "no-repeat").drawRect(0,0,width,height,10);
	
	this.addChild(hit,background,text); 
	this.on("click", this.handleClick);
	this.on("rollover", this.handleRollOver);
	this.on("rollout", this.handleRollOver);
	this.on("pressmove", this.handlePressMove);
	this.cursor = "pointer";

	this.mouseChildren = false;
	
	this.offset = Math.random()*10;
	this.count = 0;
} ;


p.handleClick = function (event) {
	//alert("You clicked on a button: "+this.label);
	
} ;

p.handlePressMove = function (event) {

};

p.handleRollOver = function(event) {  
    console.log("in rollover");     
	if (event.type == "rollover") {
	    this.alpha = 0.4;
	} else {
	    if (!this.pendingDrop) {
	       this.alpha = 1;
		}
		
    }
	stage.update();
};

window.Button = createjs.promote(Button, "Container");
}());

(function() {
function CircleButton(label, color, displayLoc) {
	this.Button_constructor(label, color);
}

var p = createjs.extend(CircleButton, this.Button);
p.handleClick = function (event) {

    dragger = new Dragger(this.label, this.color, stage2);
	stage2.addChild(dragger);
	stage2.update();
};
window.CircleButton = createjs.promote(CircleButton, "Button");
}());

(function() {
function SquareButton(label, color, displayLoc) {
	this.Button_constructor(label, color);
}

var p = createjs.extend(SquareButton, this.Button);
p.handleClick = function (event) {
    console.log("Inside Handle Click Square");
	mouseDrag(this, "SquareButton","IED");
};

window.SquareButton = createjs.promote(SquareButton, "Button");
}());

(function() {
function LineButton(label, color, displayLoc) {
	this.Button_constructor(label, color);
}

var p = createjs.extend(LineButton, this.Button);
p.handleClick = function (event) {

    console.log("Inside Handle Click Line");
	mouseDrag(this, "LineButton","Line");
};
window.LineButton = createjs.promote(LineButton, "Button");
}());

(function() {
function TextButton(label, color, displayLoc) {
	this.Button_constructor(label, color);
}

var p = createjs.extend(TextButton, this.Button);
p.handleClick = function (event) {

    console.log("Inside Handle Click Line");
	mouseDrag(this, "TextButton","Text");
	
};
window.TextButton = createjs.promote(TextButton, "Button");
}());
