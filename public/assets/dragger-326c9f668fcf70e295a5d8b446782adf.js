(function() {
function Dragger(label, color, loc, labelx, labely) {
    this.labely = labely;
	this.labelx = labelx;
	this.Container_constructor();
	this.color = color;
	this.label = label;
	this.name = label + draggerCount;
	this.sizers = ["nw-resize","ne-resize","se-resize","sw-resize","n-resize", "s-resize", "e-resize","w-resize", "rect-resize"];
	this.setup(loc);
	this.sizer = "0";
	
	this.pressmove1 = "on";
	this.imageBounds = "";
}

var p = createjs.extend(Dragger, createjs.Container);

p.doodle = function() {
    
    var shape = new createjs.Shape();
	var label = new createjs.Text(this.label + draggerCount, "bold 14px Arial", "#000000"); 
	this.mouseChildren = true;
	this.startP = new Point(0,0);
	shape = new Image();
	shape = imagequeue.getResult(this.label);
	bitmap = new createjs.Bitmap(shape);
	label.textAlign = "left";
	label.y = this.labely;
	label.x = 0;
	this.addChild(bitmap);
	this.addChild(label);
	this.imageBounds = this.getBounds();
	p.setImageBounds(this.imageBounds);
	console.log("Image Bounds");
	console.log(this);
	console.log(this.getImageBounds());
	
} ;

p.getImageBounds =function() {
    return this.imageBounds;
};

p.setImageBounds =function(bounds) {
    this.imageBounds = bounds;
};

p.setup = function(location) {
	this.doodle();
	this.addSizers(this.sizers);
	this.hideSizersNoEvent(this.sizers);
	draggerCount = draggerCount +1;
	this.on("click", this.handleClick);
	this.on("rollover", this.handleRollOver);
	this.on("rollout", this.handleRollOver);
	this.on("pressmove", this.handlePressMove);
	this.on("mousedown", this.showContextMenu);
} ;

function mouseX(evt) {
    if (evt.pageX) {
        return evt.pageX;
    } else if (evt.clientX) {
       return evt.clientX + (document.documentElement.scrollLeft ?
           document.documentElement.scrollLeft :
           document.body.scrollLeft);
    } else {
        return null;
    }
};

function mouseY(evt) {
    if (evt.pageY) {
        return evt.pageY;
    } else if (evt.clientY) {
       return evt.clientY + (document.documentElement.scrollTop ?
       document.documentElement.scrollTop :
       document.body.scrollTop);
    } else {
        return null;
    }
};

p.remove = function (  ) {
   stage2.removeChildAt(activeObjectId);
   $('#glossymenu').remove();
   contextmenuon = false;
   $('#LabelFormDiv').attr('class', 'hide');
   stage2.update();
};

p.changeLabel = function (e ) {
   $('#LabelFormDiv').attr('class', 'hide');
   $('#LabelForm').attr('action', 'javascript:labelsubmit();');
   var labelText = stage2.getChildAt(activeObjectId).getChildAt(1).text;
   $('#textBox').val(labelText);
   $('#glossymenu').remove();
   contextmenuon = false;
   $('#activeObjectId').attr('type','hidden');
   $('#activeObjectId').attr('value',activeObjectId);
   $('#LabelFormDiv').attr('class', 'show');
   
   form = $('#LabelFormDiv').get(0);
   formDOMElement = new createjs.DOMElement(form);
   var field = stage2.addChild(formDOMElement);
   field.x = e.clientX;
   field.y = e.clientY;
   stage2.update();
};

p.copyObject = function (e ) {
   console.log("In Copy Object");
   console.log( stage2.getChildAt(activeObjectId) );
   dragger = new Dragger(stage2.getChildAt(activeObjectId).label, stage2.getChildAt(activeObjectId).color, stage2, stage2.getChildAt(activeObjectId).labelx, stage2.getChildAt(activeObjectId).labely);
   stage2.addChild(dragger);
   dragger.x = stage2.getChildAt(activeObjectId).x + 5;
   dragger.y = stage2.getChildAt(activeObjectId).y + 5;
   
   dragger.scaleX = stage2.getChildAt(activeObjectId).scaleX;
   dragger.scaleY = stage2.getChildAt(activeObjectId).scaleY;
   
   stage2.update();
   console.log("Dragger");
   console.log(dragger);
   console.log("Cloned");

};

p.showContextMenu = function( e ) { 
    if ( e.nativeEvent.button == 2) { 
	    console.log("Handler");
		console.log(handler);
		
		if (handler != "") {
	       document.removeEventListener('contextmenu', handler);
		}
		
		handler = function(e) {
		    console.log("Entering handler function");
			console.log("contextmenuon =" + contextmenuon);
			console.log("activeObject  =" + activeObject);
			if (contextmenuon == false && activeObject == true) {
               e.preventDefault();
			   var items = ["Delete", "Change Label", "Copy"];
			   menus(items, e);
			   $('a:contains("Delete")').click(  function() {p.remove();}   );
			   $('a:contains("Change Label")').click(function() {p.changeLabel(e);});
			   $('a:contains("Copy")').click(function() {p.copyObject(e);});
			   contextmenuon = true;
			};
        }
		
	    document.addEventListener('contextmenu', handler, false);
		
    } else {
		this.startP = new Point(e.stageX - e.currentTarget.x , e.stageY - e.currentTarget.y);
		var objectWidth  = (e.currentTarget.getBounds()).width;
	    var objectHeight = (e.currentTarget.getBounds()).height;
		if (e.currentTarget.getChildByName(this.sizers[0]).isVisible() == false) {
		   stage2.cursor = "move";
		} else if (p.sizer == "1") {
	       
		   
	 
	    }
	}
};

p.handleClick = function (event) {
    console.log("Press Move: " + this.pressmove1);
	
	if (contextmenuon == true) {
	   $('#glossymenu').attr('class', 'hide');
	   $('#glossymenu').remove();
	   contextmenuon = false;
	} 
	if ((event.currentTarget.getChildByName(this.sizers[0]).isVisible() == false) && p.pressmove1 == "on") {
	   this.showSizers(event, this.sizers);
	} else {
	   this.hideSizers(event, this.sizers);
	}
	
	
	p.pressmove1 = "on";
	console.log("Press Move: " + p.pressmove1);
	
	if (stage2.cursor == "move") {
	    console.log("cursor to pointer");
	    stage2.cursor = "pointer"
	}
	
} ;

p.addSizers = function(sizers) {
  var objectWidth  = (this.getBounds()).width;
  var objectHeight = (this.getBounds()).height;
  vals = new Array([-5, -5, 10, 10,sizers[0]],
                   [objectWidth-5, -5, 10, 10,sizers[1]],
				   [objectWidth-5, objectHeight-5, 10, 10,sizers[2]],
				   [-5, objectHeight-5, 10, 10,sizers[3]],
				   [objectWidth/2,-5, 10, 10,sizers[4]],
				   [objectWidth/2,objectHeight-5, 10, 10,sizers[5]],
				   [objectWidth-5,objectHeight/2, 10, 10,sizers[6]],
				   [-5,objectHeight/2, 10, 10,sizers[7]]);
  console.log("Vals");
  console.log(vals);
  var addSzrCnt = 0;
  while(addSzrCnt < vals.length) {
      var shape = new objectSizer(vals[addSzrCnt][0], vals[addSzrCnt][1], vals[addSzrCnt][2], vals[addSzrCnt][3]);
	  shape.setCursor(vals[addSzrCnt][4]);
	  shape.display(stage2, this,sizers[addSzrCnt]);
	  console.log(shape);
      addSzrCnt++;
  }
  var shape5 = new createjs.Shape();
  shape5.graphics.beginStroke("red").drawRect(0, 0, objectWidth, objectHeight); 
  shape5.setBounds(0, 0, objectWidth, objectHeight);  
  shape5.name = sizers[8];
  shape5.originalWidth = objectWidth;
  shape5.originalHeight = objectHeight;
  this.addChild(shape5);			   
  stage2.update();
};

p.removeSizers = function(sizers) {
   var removeSzrCnt = 0;
   while(removeSzrCnt < sizers.length) {
      var childRect = this.getChildByName(sizers[removeSzrCnt]);
	  console.log("Removing: " + sizers[removeSzrCnt]);
	  this.removeChild(childRect);
	  removeSzrCnt++;
   }
   stage2.update();
};

p.hideSizersNoEvent = function(sizers) {
   console.log(sizers);
   var hideSzrCnt = 0;
   while(hideSzrCnt < sizers.length) {
      var childRect = this.getChildByName(sizers[hideSzrCnt]);
	  console.log("Hiding: " + sizers[hideSzrCnt]);
	  console.log(childRect);
	  childRect.visible = false;
	  hideSzrCnt++;
   }
   stage2.update();
};

p.hideSizers = function(event, sizers) {
   var hideSzrCnt = 0;
   while(hideSzrCnt < sizers.length) {
      var childRect = event.currentTarget.getChildByName(sizers[hideSzrCnt]);
	  childRect.visible = false;
	  hideSzrCnt++;
   }
   stage2.update();
};

p.showSizers = function(event, sizers) {
   var hideSzrCnt = 0;
   while(hideSzrCnt < sizers.length) {
      var childRect = event.currentTarget.getChildByName(sizers[hideSzrCnt]);
	  childRect.visible = true;
	  hideSzrCnt++;
   }
   stage2.update();
};

p.handleRollOver = function(event) {
	if (event.type == "rollover") {
	    this.alpha = 0.7;
		activeObject = true;
		activeObjectId = stage2.getChildIndex(this);
	} else {
	    this.alpha = 1;	
		activeObject = false;
		stage2.cursor = "pointer";
    }
	stage2.update();
};

p.handleSizerOver = function(evt) {
     if (evt.target.name == "sizer1")
	 {
	    stage2.cursor = "se-resize";
	 }
};
p.handlePressMove = function(evt) {
        console.log("In handlePressMove");
	 var objectWidth  = (evt.currentTarget.getBounds()).width;
     var objectHeight = (evt.currentTarget.getBounds()).height;
	 var next       = new Point(evt.stageX - this.startP.getX()  ,evt.stageY - this.startP.getY()  );
	 var pnt1       = new Point(next.getX(), next.getY());
	 var pnt2       = new Point(next.getX() + objectWidth, next.getY());
	 var pnt3       = new Point(next.getX(), next.getY() + objectHeight);
	 var pnt4       = new Point(next.getX() + objectWidth, next.getY() + objectHeight);
     if ((evt.currentTarget.getChildByName(this.sizers[0])).isVisible() == false)  {   
		
		
		if (pnt1.inbounds(stage2) && pnt2.inbounds(stage2) && pnt3.inbounds(stage2) && pnt4.inbounds(stage2)) {
		
		   if (evt.currentTarget.x == next.getX() && evt.currentTarget.y == next.getY()) {
		      p.pressmove1 = "on";
		   } else {
		      p.pressmove1 = "off";
		   }
		   evt.currentTarget.x = next.getX();
		   evt.currentTarget.y = next.getY();
		   		
		   stage2.update();  
        }
	 } else if (p.sizer == "1") {
	    
	 
	 }
	    
	    console.log("Press Move: " + p.pressmove1);
	    console.log("Leaving handlePressMove");
	};
window.Dragger = createjs.promote(Dragger, "Container");
}());
