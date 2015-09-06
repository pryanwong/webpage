var stage, networkingStage,  shapesStage, stage2, output, dragger;
var currentStage;
var btn2, btn3, btn4;
var draggerCount = 0;
var contextmenuon = false;
var activeTextId = -1;
var activeObject = false;
var activeObjectId = -1;
var activeObjectRef = '';
var activeTextBox = false;
var handler = '';
var imagequeue = '';
var textDivCount = 1;
var mouseBp ='';
var mouseBp2 ='';
var mouseHandler ='';
var mouseHandler2 ='';
var buttonSelected = '';
var buttonActive = '';
var buttonName = '';


function init() {

	stage = new createjs.Stage("cameras");
	networkingStage = new createjs.Stage("networking");
	shapesStage = new createjs.Stage("shapes");
	stage2 = new createjs.Stage("demoCanvas2");
    stage2.name = "demoCanvas2";
	// this lets our drag continue to track the mouse even when it leaves the canvas:
	// play with commenting this out to see the difference.
	stage.mouseMoveOutside = true;
	networkingStage.mouseMoveOutside = true;
	shapesStage.mouseMoveOutside = true;
	stage2.mouseMoveOutside = true;
	//stage.addChild(dragger);


    stage.enableMouseOver(20);
	networkingStage.enableMouseOver(20);
	shapesStage.enableMouseOver(20);
	stage2.enableMouseOver(20);

	imagequeue = new createjs.LoadQueue();
	var objSizerTest = new objectSizer(10,10,10,10);
	imagequeue.loadManifest([
       {id: "IED", src:"/assets/IED.png"},
	   {id: "IED_icon", src:"/assets/IED_icon.png"},
	   {id: "NO", src:"/assets/no_symbol.png"},
	   {id: "Line", src:"/assets/line.png"},
	   {id: "Line_icon", src:"/assets/line_icon.png"},
	   {id: "Text", src:" /assets/textbox.PNG"},
	   {id: "Text_icon", src:"/assets/textbox_icon.png"},
	   {id: "GE_WiYZ", src:"/assets/GE_WiYZ.png"},
	   {id: "GE_WiYZ_icon", src:"/assets/GE_WiYZ_icon.png"},
	   {id: "esprit_cam", src:"/assets/esprit_cam.png"},
	   {id: "esprit_cam_icon", src:"/assets/esprit_cam_icon.png"},
	   {id: "Switch", src:"/assets/Switch.png"},
	   {id: "Switch_icon", src:"/assets/Switch_icon.png"},
	   {id: "circle", src:"/assets/circle.png"},
	   {id: "circle_icon", src:"/assets/circle_icon.png"}
    ]);

	imagequeue.on("complete", (function() {
	     var buttons = [["IED", "#F00", stage,10,5],
		                ["Line", "#F00", shapesStage,10,5],
						["Text", "#F00", shapesStage,75,5],
						["GE_WiYZ", "#F00", networkingStage,10,5],
						["Switch", "#F00", networkingStage,75,5],
						["esprit_cam", "#F00", stage,75,5],
						["circle", "#F00", shapesStage,10,50]];
		 var num_of_buttons = 7;
		 var btn = [];
		 for (i = 0; i < num_of_buttons; i++) {
            btn[i] = buttons[i][2].addChild(new Button(buttons[i][0], buttons[i][1], buttons[i][2]));
		    btn[i].x = buttons[i][3];
	        btn[i].y = buttons[i][4];;
         }
         stage.update();
		 shapesStage.update();
		 networkingStage.update();
	   }) , this);

    function handleComplete() {
	   console.log(new createjs.LoadQueue());
    }

	createjs.Ticker.addEventListener("tick", tick);

	stage2.on("stagemousedown", function(evt) {
       if (contextmenuon == true) {
		  $('#glossymenu').remove();
	      contextmenuon = false;
	   }
	   console.log("activeObject: " + activeObject);
	   console.log("activeObjectId: " + activeObjectId);
	   if ($(document).find("textarea").length > 0) {
		     $(document).find("textarea").blur();
	   }
	   if (activeTextId.indexOf !== undefined) {
	     if (activeObject && activeTextId.indexOf("text") > -1) {
	        $('#' + activeTextId).find( "TEXTAREA" ).blur();
	        activeObject = false;
            activeTextId = '';
	     }
	   }
	   if (buttonActive == true) {
	      console.log("Should drop object here");
		  console.log("Object Name: " + mouseBp2.name);
		  cursorRevert();
		  var dragObj         = [["IED",        this.color, stage2,0,35, "dragger"],
		                         ["Line",       this.color, stage2,0,0 , "line"],
						         ["Text",       this.color, stage2,0,0 , "text"],
						         ["GE_WiYZ",    this.color, stage2,0,85, "dragger"],
						         ["esprit_cam", this.color, stage2,0, 160,"dragger"],
								 ["Switch",     this.color, stage2,0, 70,"dragger"],
								 ["circle",     this.color, stage2,0, 35,"circle"]];

		  var found = false;
		  var length= 7;
		  var iteration = 0;
		  while(!found && iteration < length) {
		      if (mouseBp2.name == dragObj[iteration][0]) {
			      found = true;
			      if (dragObj[iteration][5] == "dragger") {
				     dragger = new Dragger(dragObj[iteration][0], dragObj[iteration][1], dragObj[iteration][2], dragObj[iteration][3], dragObj[iteration][4]);
	                 stage2.addChild(dragger);
			         dragger.x = stage2.mouseX;
			         dragger.y = stage2.mouseY;
					 console.log(dragger);
				  } else if (mouseBp2.name == "Line") {
			         linedragger = new LineDragger(this.label, $("input#myColor").css('background-color'), dragObj[iteration][2]);
	                 stage2.addChild(linedragger);
			         linedragger.x = stage2.mouseX;
			         linedragger.y = stage2.mouseY;
					 console.log(linedragger);
				  } else if (mouseBp2.name == "circle") {
			         circledragger = new CircleDragger(this.label, $("input#myColor").css('background-color'), dragObj[iteration][2]);
	                 stage2.addChild(circledragger);
			         circledragger.x = stage2.mouseX;
			         circledragger.y = stage2.mouseY;
					 console.log(circledragger);
		          } else if (mouseBp2.name == "Text") {
		             textdragger = new TextDragger(this.label, dragObj[iteration][1], dragObj[iteration][2]);
	                 stage2.addChild(textdragger);
			         var paddingL = $(textdragger.divId).css('padding-left').replace("px", "");
	                 var paddingT = $(textdragger.divId).css('padding-top').replace("px", "");
			         var offL = stage2.canvas.offsetLeft - paddingL;
	                 var offT = stage2.canvas.offsetTop - paddingT;
			         $(textdragger.divId).css('top',offT + stage2.mouseY);
                     $(textdragger.divId).css('left',offL + stage2.mouseX);
					 console.log(textdragger);
				  }
				  stage2.update();
			   }
			   iteration++;
		  }
	   }
    })

	stage.on("stagemousedown", function(evt) {
	   if (buttonActive == true) {
	      console.log("Should revert here");
		  cursorRevert();
	   }
	})

	shapesStage.on("stagemousedown", function(evt) {
	   if (buttonActive == true) {
	      console.log("Should revert here");
		  cursorRevert();
	   }
	})

	networkingStage.on("stagemousedown", function(evt) {
	   if (buttonActive == true) {
	      console.log("Should revert here");
		  cursorRevert();
	   }
	})



	stage.update();
	shapesStage.update();
	networkingStage.update();

}

  function tick(event)
  {
   stage.update();
   stage2.update();
   networkingStage.update();
   shapesStage.update();
  }

labelcancel = function ( ) {
  document.getElementById("LabelFormDiv").className = "hide";
}

textcancel = function ( ) {
  document.getElementById("TextFormDiv").className = "hide";
}

labelsubmit = function ( ) {
  document.getElementById("LabelFormDiv").className = "hide";
  var activeObjectId = $("#activeObjectId").attr('value');
  var objectVal = stage2.getChildAt(activeObjectId)
  var textVal = $("#textBox").val();
  var textWidth = 0;
  objectVal.getChildAt(1).text = textVal;
  if (textVal.length > 0) {
      textWidth = (objectVal.getChildAt(1).getBounds()).width;
  }
  var imageWidth = (objectVal.getChildAt(0).getBounds()).width;
  var maxWidth = 0;
  textWidth > imageWidth ? maxWidth = textWidth : maxWidth = imageWidth;
  //objectVal.cache(0,0,maxWidth, (objectVal.getBounds()).height);
  stage2.update();
}

textsubmit = function ( ) {
  $('#TextFormDiv').addClass('hide').removeClass('show');
  var activeObjectId = $("#activeObjectId").attr('value');
  var objectVal = stage2.getChildAt(activeObjectId);
  var textValOrig = $("#textBoxMultiline").val();
  var textVal = wordWrap(words(textValOrig),15);
  objectVal.getChildAt(1).text = textVal;
  stage2.update();
}

colorPickerChange = function(inputColor) {
   console.log("colorPickerChange");
   console.log($(activeObjectRef));
   if ($(activeObjectRef).find("textarea").length > 0) {
       temp = $(activeObjectRef).find("textarea")[0];
	   $(temp).css({ 'background': inputColor });
	   stage2.update();
   }
   if (activeObjectRef.label == "LineDragger") {
       console.log("Trying to color LineDragger");
	   activeObjectRef.color = inputColor;
	   activeObjectRef.getChildAt(0).graphics.setStrokeStyle(4).beginStroke(inputColor);
	   activeObjectRef.getChildAt(0).graphics.moveTo(activeObjectRef.point0.getX(), activeObjectRef.point0.getY());
	   activeObjectRef.getChildAt(0).graphics.lineTo(activeObjectRef.point1.getX(), activeObjectRef.point1.getY());
	   activeObjectRef.getChildAt(0).graphics.endStroke();
	   console.log(activeObjectRef.getChildAt(0));
	   stage2.update();
   }
   if (activeObjectRef.label == "CircleDragger") {
       console.log("Trying to color CircleDragger");
	   activeObjectRef.color = inputColor;
	   activeObjectRef.getChildAt(0).graphics.setStrokeStyle(1).beginStroke(inputColor).drawCircle(0,0,activeObjectRef.radius);
	   console.log(activeObjectRef.getChildAt(0));
	   stage2.update();
   }
   //alert(inputColor);
}

myFontColor = function(inputColor) {
   //var t = document.getElementById('text');
   //t.style.backgroundColor=inputColor;
   console.log("myFontColor");
   console.log($(activeObjectRef).find("textarea")[0]);
   if ($(activeObjectRef).find("textarea").length > 0) {
       temp = $(activeObjectRef).find("textarea")[0];
	   $(temp).css({ 'color': inputColor });
	   console.log(($(activeObjectRef).find("textarea")[0]));
	   stage2.update();
   }
   //alert(inputColor);
}

escapeFunction = $(document).keyup(function(e) {
  if (e.keyCode == 27) {
     console.log("Escape Key Hit");
     cursorRevert();
	 if ($(document).find("textarea").length > 0) {
		 $(document).find("textarea").blur();
	 }
  }
});

cursorRevert = function () {
   if (buttonActive == true) {
     console.log("Removing cursor");
	 currentStage.removeEventListener("stagemousemove", moveHandler);
	 stage2.removeEventListener("stagemousemove", moveHandler2);
	 console.log(buttonSelected);
     buttonSelected.alpha = 1;
	 stage2.removeChild(stage2.getChildByName(buttonName));
	 if (currentStage.isVisible()) {
	    currentStage.removeChild(currentStage.getChildByName(buttonName));
	    currentStage.cursor = "pointer";
     }
	 console.log("In cursor revert");
	 console.log(activeObject);
	 console.log(activeObjectRef);
	 console.log($(document).find("textarea"));
	 console.log($(document).find("textarea").length);

	     if ($(document).find("textarea").length > 0) {
		     $(document).find("textarea").blur();
		 }


	 stage2.cursor = "pointer";
	 buttonSelected.pendingDrop = false;
	 buttonActive = false;
	 buttonSelected = '';
	 currentStage.update();
	 stage2.update();
  }
}
;
