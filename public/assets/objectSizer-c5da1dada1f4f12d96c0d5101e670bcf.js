function objectSizer(x1, y1, sizeX, sizeY) {
      this.x = x1;
	  this.y = y1;
	  this.sizeX = sizeX;
	  this.sizeY = sizeY;
	  this.color = "red";
	  this.cursor = "pointer";
	  this.shape = "";
	  this.startPoint = "";
	  this.swpoint = "";
	  this.nwpoint = "";
	  
};

objectSizer.prototype.getX = function() {
   return this.x;
};
   
objectSizer.prototype.getY = function() {
      return this.y;
};

objectSizer.prototype.getSizeX = function() {
   return this.sizeX;
};
   
objectSizer.prototype.getSizeY = function() {
      return this.sizeY;
};

objectSizer.prototype.setColor = function(color) {
      this.color = color;
};

objectSizer.prototype.setCursor = function(cursor) {
      this.cursor = cursor;
};

objectSizer.prototype.display = function(stage, target,objName) {
       this.shape = new createjs.Shape();
	   this.shape.name = objName;
       this.shape.graphics.beginFill("red").drawRect(this.x, this.y, this.sizeX, this.sizeY); 
	   var tempCursor = this.cursor;
       this.shape.setBounds(this.x, this.y, this.sizeX, this.sizeY);
	   this.shape.origScaleX = 1;
	   this.shape.origScaleY = 1;
	   console.log("Cursor 1: " + tempCursor);
	   this.shape.on("mouseover", function() {
	       stage.cursor = tempCursor;
       });
	   this.shape.on("mouseout", function() {
	       stage.cursor = "pointer";
       });
	   
	   this.shape.on("mousedown", function(event) {
	       console.log("-------mousedown---------");
	       this.startPoint = new Point(event.stageX , event.stageY);
		   var origContainer = event.currentTarget.parent;
		   this.nwpoint = new Point(origContainer.x, origContainer.y);
		   this.swpoint = new Point(origContainer.x, origContainer.y + origContainer.getBounds().height);
		   this.nepoint = new Point(origContainer.x + origContainer.getBounds().width , origContainer.y);
		   this.sepoint = new Point(origContainer.x + origContainer.getBounds().width , origContainer.y + origContainer.getBounds().height);
		   this.npoint = new Point(origContainer.x + origContainer.getBounds().width/2, origContainer.y);
		   this.spoint = new Point(origContainer.x + origContainer.getBounds().width/2, origContainer.y + origContainer.getBounds().height);
	   });
	   
	   this.shape.on("pressmove", function(event) {
	       var contain = event.currentTarget.parent;	
		   console.log(contain);
		   if (this.name == "se-resize") { 
		          var newx = (event.stageX - contain.x);
				  var newy = (event.stageY - contain.y);
				  event.currentTarget.parent.scaleX = newx/event.currentTarget.parent.getBounds().width;
				  event.currentTarget.parent.scaleY = newy/event.currentTarget.parent.getBounds().height;   
	       }
		   if (this.name == "ne-resize") { 
		          var newx = (event.stageX - contain.x);
				  var newy = event.stageY;
				  event.currentTarget.parent.scaleX = newx/event.currentTarget.parent.getBounds().width;
				  event.currentTarget.parent.scaleY = (this.swpoint.getY()-newy)/event.currentTarget.parent.getBounds().height;
				  event.currentTarget.parent.y = newy;
	       }
		   
		   if (this.name == "sw-resize") { 
		          var newx = event.stageX;
				  var newy = (event.stageY - contain.y);
				  event.currentTarget.parent.scaleX = (this.nepoint.getX()-newx)/event.currentTarget.parent.getBounds().width;
				  event.currentTarget.parent.scaleY = newy/event.currentTarget.parent.getBounds().height;
				  event.currentTarget.parent.x = newx; 
	       }
		   
		   if (this.name == "nw-resize") { 
		          var newx = event.stageX;
				  var newy = event.stageY;
				  event.currentTarget.parent.scaleX = (this.sepoint.getX()-newx)/event.currentTarget.parent.getBounds().width;
				  event.currentTarget.parent.scaleY = (this.sepoint.getY()-newy)/event.currentTarget.parent.getBounds().height;
				  event.currentTarget.parent.x = newx;
				  event.currentTarget.parent.y = newy;
	       }
		   
		   if (this.name == "n-resize") { 
				  var newy = event.stageY;
				  event.currentTarget.parent.scaleY = (this.sepoint.getY()-newy)/event.currentTarget.parent.getBounds().height;
				  event.currentTarget.parent.y = newy;  
	       }
		   
		   if (this.name == "s-resize") {
				  var newy = (event.stageY - contain.y);
				  event.currentTarget.parent.scaleY = newy/event.currentTarget.parent.getBounds().height;
	       }
		   
		   if (this.name == "w-resize") {
		          var newx = event.stageX;
				  event.currentTarget.parent.scaleX = (this.sepoint.getX()-newx)/event.currentTarget.parent.getBounds().width;
				  event.currentTarget.parent.x = newx;
		   }
		   if (this.name == "e-resize") {
		          var newx = (event.stageX - contain.x);
				  event.currentTarget.parent.scaleX = newx/event.currentTarget.parent.getBounds().width;
		   }
		   stage2.update();
	   });
	   //return this.shape;
	   target.addChild(this.shape);
};

