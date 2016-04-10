function modernizerFunction(Mod, doc ) {
  log.info( "Entering  modernizerFunction");
  if (Mod.draganddrop) {
     // Browser supports HTML5 DnD.
     // Bind the event listeners for the image elements
     var images = doc.querySelectorAll('#images img');
     [].forEach.call(images, function (img) {
        img.addEventListener('dragstart', handleDragStart, false);
        img.addEventListener('dragend', handleDragEnd, false);
     });
     // Bind the event listeners for the canvas
     var canvasContainer = doc.getElementById('canvas-container');
     canvasContainer.addEventListener('dragenter', handleDragEnter, false);
     canvasContainer.addEventListener('dragover', handleDragOver, false);
     canvasContainer.addEventListener('dragleave', handleDragLeave, false);
     canvasContainer.addEventListener('drop', handleDrop, false);
  } else {
    // Replace with a fallback to a library solution.
    alert("This browser doesn't support the HTML5 Drag and Drop API.");
  }
  log.info( "Leaving  modernizerFunction");
};

function objectBoundaryCheck(e){
  log.info( "Entering  objectBoundaryCheck");
  e.target.setCoords();
  log.debug( "Checking to see if the end points of a line are being dragged ");
  if (e.target.type != "circle0" && e.target.type != "circle1") {
     var obj = e.target;
     var posBottom = e.target.getBoundingRect().top + e.target.getBoundingRect().height;
     var posRight = e.target.getBoundingRect().left + e.target.getBoundingRect().width;
     var boundRect = obj.getBoundingRect();
     var x1Delta = -(boundRect.left - obj.left)
     var y1Delta = -(boundRect.top - obj.top)
     bounds = {tl: {x: 0, y: 0}, br: {x: canvas.width , y: canvas.height } };


     // top-left  corner
     log.debug( "Checking to see if we hit the top-left corner");
     if((e.target.getBoundingRect().top <= bounds.tl.y || e.target.getBoundingRect().left <= bounds.tl.x) ){
       log.debug( "hit the top-left corner");
       e.target.setTop(Math.max(e.target.top  , y1Delta  ));
       e.target.left = Math.max(e.target.left , x1Delta );
       e.target.setCoords();
       canvas.renderAll();
     }

     // bot-right corner
     log.debug( "Checking to see if we hit the bot-right corner");
     if((posBottom >= bounds.br.y || posRight >= bounds.br.x )){
        if (posBottom >= bounds.br.y) {
           if (e.target.angle >= 270 && e.target.angle < 360) {
              e.target.top = bounds.br.y -  e.target.getBoundingRect().height + y1Delta;
           } else if (e.target.angle >= 90 && e.target.angle <= 180){
              e.target.top = bounds.br.y -  e.target.getBoundingRect().height + y1Delta
              log.debug("Calculated Top: " + (bounds.br.y -  e.target.getBoundingRect().height + y1Delta))
           } else if (e.target.angle > 180 && e.target.angle < 270){
              e.target.top = bounds.br.y -  e.target.getBoundingRect().height +y1Delta
           } else if (e.target.angle >= 0 && e.target.angle < 90){
              e.target.top = bounds.br.y -  e.target.getBoundingRect().height +y1Delta ;
           }
        }
        if (posRight >= bounds.br.x) {
           if (e.target.angle >= 270 && e.target.angle < 360) {
              e.target.left = bounds.br.x -  e.target.getBoundingRect().width;
           } else if (e.target.angle >= 90 && e.target.angle <= 180){
              e.target.left = bounds.br.x
           } else if (e.target.angle > 180 && e.target.angle < 270){
              e.target.left = bounds.br.x -  e.target.getBoundingRect().width +x1Delta
           } else if (e.target.angle >= 0 && e.target.angle < 90){
              e.target.left = bounds.br.x -  e.target.getBoundingRect().width +x1Delta ;
           }
        }
        obj.setCoords();
    }
  }
  log.info( "Leaving objectBoundaryCheck");
};

function boundaryInspectorCircle(e) {
   log.info( "Entering boundaryInspectorCircle");
   e.target.setCoords()
   var p = e.target;
   bounds = {tl: {x: 0, y:0}, br: {x: canvas.width , y: canvas.height } };
   if(p.type == 'circle1' || p.type == 'circle0') {
      if(p.top < bounds.tl.y || p.left < bounds.tl.x) {
         e.target.setTop(Math.max('0', e.target.top))
         e.target.left = Math.max('0', e.target.left)
      }  else if ((p.top + 2*p.radius) > bounds.br.y || (p.left + 2*p.radius) > bounds.br.x ) {
         e.target.setTop(Math.min(bounds.br.y, e.target.top + 2*p.radius ))
         e.target.left = Math.min(bounds.br.x, e.target.left + 2*p.radius)
      }
      if (p.type == "circle1")  {
         p.line && p.line.set({ 'x1': p.line.c1.left, 'y1': p.line.c1.top, 'x2': p.left, 'y2': p.top });
      } else {
         p.line && p.line.set({ 'x1': p.left, 'y1': p.top, 'x2': p.line.c2.left, 'y2': p.line.c2.top });
      }

      p.line.setCoords();
      e.target.setCoords();
      canvas.renderAll();
   }
   log.info( "Leaving boundaryInspectorCircle");
};

function objectResize(e) {
   log.info( "Entering objectResize");
   if(e.target.type == "circle") {
      newWidth = e.target.width * e.target.scaleX
      newRadius = e.target.radius * e.target.scaleX
      e.target.set({ width: newWidth, radius: newRadius, height: newWidth, scaleX: 1, scaleY: 1, });
   } else if(e.target.type == "ellipse") {
      newWidth = e.target.width * e.target.scaleX
      newHeight = e.target.height * e.target.scaleY
      newRadiusX = newWidth/2
      newRadiusY = newHeight/2
      e.target.set({ rx: newRadiusX, ry: newRadiusY, scaleX: 1, scaleY: 1, });
   } else if(e.target.type == "rect") {
      newWidth = e.target.width * e.target.scaleX;
      newHeight = e.target.height * e.target.scaleY;
      e.target.set({ height: newHeight, width: newWidth, scaleX: 1, scaleY: 1, });
   }
   objectBoundaryCheck(e)
   log.info( "Leaving objectResize");
};

function selectionCleared(e)  {
   log.info( "Entering selectionCleared");
   lineActive = true
   lineSelected = false
   log.debug( "lineActive: ", lineActive);
   log.debug( "lineSelected: ", lineSelected);
   log.info( "Leaving selectionCleared");
};

function mouseDown(e)  {
    log.info( "Entering mouseDown");
    $('#glossymenu').remove();
    contextmenuon = false;
    log.debug( "contextmenuon: ", contextmenuon);
    log.info( "Leaving mouseDown");
};

function objectSelected(e) {
   log.info( "Entering objectSelected");
   activeObject = true;
   activeObjectVal = e.target;
   var objType = e.target.get('type');
   log.trace( "activeObject: ", activeObject);
   log.trace( "activeObjectVal: ", activeObjectVal);
   if (e.target.type == "line") {
      log.debug( "Line Selected ");
      newGroup = new fabric.Group();
      newGroup.addWithUpdate(e.target.c1)
      newGroup.addWithUpdate(e.target.c2)
      newGroup.addWithUpdate(e.target)
      newGroup.type = "lineGroup"
      newGroup.hasControls = false;
      newGroup.id = itemId
      itemId = itemId + 1;
      canvas.add(newGroup)
      e.target.c1.remove();
      e.target.c2.remove();
      e.target.remove();
      newGroup.on("mousedown", function(data, index) { lineDown(data,index); });
   }
   lineSelected = true;
   log.info( "Leaving objectSelected");
};

function mouseOut(e) {
   log.info( "Entering mouseOut");
   e.target.setOpacity(1);
   canvas.renderAll();
   if (e.target.type == "lineGroup" && lineActive) {
      var items = e.target._objects;
      e.target._restoreObjectsState();
      searchId = getItemIndex(e.target)
      canvas.setActiveObject(canvas.item(searchId))
      if(canvas.getActiveGroup()){
         canvas.getActiveGroup().forEachObject(function(o){ canvas.remove(o) });
         canvas.discardActiveGroup().renderAll();
      } else {
         canvas.remove(canvas.getActiveObject());
      }
      for(var i = 0; i < items.length; i++) {
         items[i].hasBorders = items[i].hasControls = false
         canvas.add(items[i]);
      }
      items[2].c1 = items[0]
      items[2].c2 = items[1]
      items[0].bringToFront();
      items[1].bringToFront();
      items[2].sendBackwards();
      canvas.renderAll();
      items[2].on("mousedown", function(data, index) { lineDown(data,index); });
   }
   log.info( "Leaving mouseOut");
};

function mouseOver(e) {
  log.info( "Entering mouseOver");
  log.debug( "Set Opacity to 0.5");
  e.target.setOpacity(0.5);
  activeObjectVal = e.target
  if (e.target.type) {
       if (e.target.type == "line") {
         log.debug( "Target is line");
         searchId = getItemIndex(e.target);
         log.trace( e.target);
         canvas.setActiveObject(canvas.item(searchId))
       }
   }
   log.info( "Leaving mouseOver");
};

function postProcessLoading(o, object) {
  log.info( "Entering postProcessLoading");
  if (object.type == "custom-image") {
    log.debug( "Processing custom-image");
    object.on("mousedown", function(data, index) { imageDown(data,index)   });
  }
  if (object.type == "circle") {
    log.debug( "Processing circle");
    object.fill = undefined
    object.on("mousedown", function(data, index) { circleDown(data,index)   });
  }

  if (object.type == "ellipse") {
    log.debug( "Processing ellipse");
    object.fill = undefined
    object.on("mousedown", function(data, index) { ellipseDown(data,index)   });
  }

  if (object.type == "rect") {
    log.debug( "Processing rect");
    object.fill = undefined
    object.on("mousedown", function(data, index) { rectangleDown(data,index)   });
  }

  if (object.type == "line") {
    log.debug( "Processing line");
    object.objId = objId_var;
    object.on("mousedown", function(data, index) { lineDown(data,index); });
  }
  if (object.type == "i-text") {
    log.debug( "Processing i-text");
    object.on("mousedown", function(data, index) { textDown(data,index)   });
  }
  log.info( "Leaving postProcessLoading");

};

function onSave(company_id, user_id, id) {
 log.info( "Entering onSave");
 // Remove circle0 and circle1 from image
 $(".spinner").show();
 objects = canvas.getObjects();
 var temp = canvas.backgroundImage;

 if (canvas.background === "") {
   canvas.backgroundImage = "";
   log.debug( "Setting background image to blank");
 }
 var len = objects.length;
 log.debug( "Number of objects to process: ", len);
 for (index=len -1; index > -1; index--) {
   if (objects[index].type == "lineGroup") {
      log.debug( "Processing a line object");
      var items = objects[index]._objects;
      objects[index]._restoreObjectsState();
      canvas.remove(objects[index]);
      canvas.add(items[2])
   }

   if (objects[index].type == "circle0" || objects[index].type == "circle1") {
     log.debug( "Removing circles associated with a line group");
     canvas.remove(objects[index]);
   }
 }
 //var data_drawing2 = JSON.stringify(canvas);
 var token = $('meta[name="csrf-token"]').attr('content');
 canvas.backgroundColor = '#FFFFFF';
 var png_file = canvas.toDataURL('png');
 canvas.backgroundColor = "";
 //console.log("Token: " + token)
 var json_data = { company_id: company_id,
                   user_id:  user_id,
                   id: id,
                   authenticity_token: token,
                   png: png_file,
                   drawing: canvas  }
 //console.log(JSON.stringify(json_data))
 var json_url = "/companies/" + company_id + "/users/" + user_id + "/drawings/" + id +".json"
 //console.log(json_data);
 $.ajax({
         url: json_url, // Route to the Script Controller method
        type: "patch",
    dataType: "json",
 contentType: "application/json",
        data: JSON.stringify(json_data), // This goes to Controller in params hash, i.e. params[:file_name]
     timeout: 3000, // sets timeout to 3 seconds
    complete: function() {
                $(".spinner").fadeOut( 400 );
              },
     success: function(data, textStatus, xhr) {

              },
       error: function(data, textStatus) {
              alert(textStatus);
              }
      });
  canvas.renderAll();
  log.info( "Leaving onSave");
}

function handleDragStart(e) {
 log.info( "Entering handleDragStart");
 [].forEach.call(images, function (img) {
   img.classList.remove('img_dragging');
 });
 this.classList.add('img_dragging');
 log.info( "Leaving handleDragStart");
}

function makeLine(coords, id) {
   log.info( "Entering makeLine");
   //console.log("Inside Makeline objId: " + id)
   return new fabric.Line(coords, {
     fill: 'red',
     stroke: 'red',
     strokeWidth: 5,
     selectable: true,
     objId: id,
     perPixelTargetFind: true,
   });
   log.info( "Leaving makeLine");
 }

 function makeCircleShape(coords, id) {
   log.info( "Entering makeCircleShape");
   return new fabric.Circle({ top: coords[1],
                              left: coords[0],
                              radius: 15,
                              fill : undefined,
                              stroke : 'red',
                              lockUniScaling: true,
                              hasRotatingPoint : false,
                              strokeWidth : 5 })
   log.info( "Leaving makeCircleShape");
 }

 function makeEllipseShape(coords, id) {
   log.info( "Entering makeEllipseShape");
   return new fabric.Ellipse({ top: coords[1],
                              left: coords[0],
                              rx: 15,
                              ry: 7,
                              fill : undefined,
                              stroke : 'red',
                              lockUniScaling: false,
                              hasRotatingPoint : true,
                              strokeWidth : 5 })
   log.info( "Leaving makeEllipseShape");
 }

 function makeRectangleShape(coords, id) {
    log.info( "Entering makeRectangleShape");
    return new fabric.Rect({ top: coords[1],
                             left: coords[0],
                             width: 67,
                             height: 45,
                             fill: undefined,
                             stroke : 'red',
                             hasRotatingPoint : true,
                             strokeWidth : 5 })
    log.info( "Leaving makeRectangleShape");
 }

 function activateColorPicker(e) {
      log.info( "Entering activateColorPicker");
      var activeObjectVal = canvas.getActiveObject();
      document.getElementById('myColor').color.showPicker();
      log.info( "Leaving activateColorPicker");
 }

 function colorPickerChange(newLineColor) {
      log.info( "Entering colorPickerChange");
      log.debug( "newLineColor: ", newLineColor);
      if (activeObjectVal) {
        log.trace( "activeObjectVal: ", activeObjectVal);
        if (activeObjectVal.type) {
          log.trace( "activeObjectVal.type: ", activeObjectVal.type);
          if (activeObjectVal.type == "line") {
            log.debug( "colorPickerChange on line type");
            activeObjectVal.fill = newLineColor;
            activeObjectVal.stroke = newLineColor;
          }
          if (activeObjectVal.type == "lineGroup") {
            log.debug( "colorPickerChange on lineGroup type");
            activeObjectVal._objects[2].stroke = newLineColor;
          }
          if (activeObjectVal.type == "circle") {
            log.debug( "colorPickerChange on circle type");
            activeObjectVal.stroke = newLineColor;
          }
          if (activeObjectVal.type == "ellipse") {
            log.debug( "colorPickerChange on ellipse type");
            activeObjectVal.stroke = newLineColor;
          }
          if (activeObjectVal.type == "rect") {
            log.debug( "colorPickerChange on rect type");
            activeObjectVal.stroke = newLineColor;
          }
          if (activeObjectVal.type == "i-text") {
            log.debug( "colorPickerChange on i-text type");
            activeObjectVal.stroke = newLineColor;
            //activeObjectVal.setColor(newLineColor);
          }
        }
      }
      canvas.renderAll();
      log.info( "Leaving colorPickerChange");
 }

 function makeCircle(line) {
     log.info( "Entering makeCircle");
     //console.log("Line Passed In")
     //console.log(line)
     var c1 = new fabric.Circle({
       left: line.get('x1'),
       top: line.get('y1'),
       strokeWidth: 2,
       radius: 5,
       fill: '#fff',
       stroke: '#666',
       belongsTo: line.objId,
       type: 'circle0'
     });
     c1.hasControls = c1.hasBorders = false;
     c1.visible = true;
     c1.hoverCursor = 'crosshair'
     var c2 = new fabric.Circle({
       left: line.get('x2'),
       top: line.get('y2'),
       strokeWidth: 2,
       radius: 5,
       fill: '#fff',
       stroke: '#666',
       belongsTo: line.objId,
       type: 'circle1'
     });
     c2.hasControls = c2.hasBorders = false;
     c2.visible = true;
     c2.hoverCursor = 'crosshair'
     c1.belongsTo = line.objId;
     c2.belongsTo = line.objId;
     c1.line = line;
     c2.line = line;
     line.c1 = c1;
     line.c2 = c2;
     //console.log("Done Circles");
     var c = new Array(c1, c2);
     //console.log(c);
     log.info( "Leaving makeCircle");
     return c;
 }

function handleDragOver(e) {
   log.info( "Entering handleDragOver");
   if (e.preventDefault) {
      e.preventDefault(); // Necessary. Allows us to drop.
   }

   e.dataTransfer.dropEffect = 'copy'; // See the section on the DataTransfer object.
   // NOTE: comment above refers to the article (see top) -natchiketa
   log.info( "Leaving handleDragOver");
   return false;
}

function handleDragEnter(e) {
   log.info( "Entering handleDragEnter");
   // this / e.target is the current hover target.
   this.classList.add('over');
   log.info( "Leaving handleDragEnter");
}

function handleDragLeave(e) {
    log.info( "Entering handleDragLeave");
    this.classList.remove('over'); // this / e.target is previous target element.
    log.info( "Leaving handleDragLeave");
}

function sendBackward() {
   log.info( "Entering sendBackward");
   var activeObjectVal = canvas.getActiveObject();
   if (activeObjectVal) {
      canvas.sendBackwards(activeObjectVal);
   }
   $('#glossymenu').remove();
   contextmenuon = false;
   activeObject = false;
   log.info( "Leaving sendBackward");
}

function sendToBack() {
   log.info( "Entering sendToBack");
   var activeObjectVal = canvas.getActiveObject();
   if (activeObjectVal) {
      canvas.sendToBack(activeObjectVal);
   }
   $('#glossymenu').remove();
   contextmenuon = false;
   activeObject = false;
   log.info( "Leaving sendToBack");
}

function bringFoward() {
   log.info( "Entering bringFoward");
   var activeObjectVal = canvas.getActiveObject();
   if (activeObjectVal) {
      canvas.bringForward(activeObjectVal);
   }
   $('#glossymenu').remove();
   contextmenuon = false;
   activeObject = false;
   log.info( "Leaving bringFoward");
}

function bringToFront() {
   log.info( "Entering bringToFront");
   var activeObjectVal = canvas.getActiveObject();
   if (activeObjectVal) {
      canvas.bringToFront(activeObjectVal);
   }
   $('#glossymenu').remove();
   contextmenuon = false;
   activeObject = false;
   log.info( "Leaving bringToFront");
}

function lineDown(data,index) {
   log.info( "Entering lineDown");
   if (handler != "") {
      document.removeEventListener('contextmenu', handler);
   }
   if (data.e.which == 3) {
      handler = function(e) {
         if (contextmenuon == false &&  activeObject == true) {
            e.preventDefault();
            var items = ["Delete Line", "Change Color", "Send Backward", "Send To Back", "Bring Forward", "Bring To Front"];
            menus(items, e);
            $('a:contains("Delete")').click(  function() {
                                             if (canvas.getActiveObject() != null) {
                                                activeObjectVal = canvas.getActiveObject();
                                             }
                                             if (activeObjectVal.type) {
                                               if (activeObjectVal.type == "line") {
                                                 canvas.remove(activeObjectVal.c1)
                                                 canvas.remove(activeObjectVal.c2)
                                                 canvas.remove(activeObjectVal);
                                               } else if(activeObjectVal.type == "lineGroup") {
                                                 searchId = getItemIndex(activeObjectVal)
                                                 canvas.setActiveObject(canvas.item(searchId))

                                                 if(canvas.getActiveGroup()){
                                                    canvas.getActiveGroup().forEachObject(function(o){ canvas.remove(o) });
                                                    canvas.discardActiveGroup().renderAll();
                                                    lineActive = false;
                                                 } else {
                                                    canvas.remove(canvas.getActiveObject());
                                                    lineActive = false;
                                                 }
                                                 canvas.renderAll()
                                               }
                                             }
                                             $('#glossymenu').remove();
                                             contextmenuon = false;
                                             activeObject = false;
                                           });
           $('a:contains("Change Color")').click(function() {activateColorPicker(e);
                                                             $('#glossymenu').remove();
                                                             contextmenuon = false;}
                                                );
           $('a:contains("Send Backward")').click(function() {sendBackward();});
           $('a:contains("Send To Back")').click(function() {sendToBack();});
           $('a:contains("Bring Forward")').click(function() {bringFoward();});
           $('a:contains("Bring To Front")').click(function() {bringToFront();});
           contextmenuon = true;
        };
      }
      document.addEventListener('contextmenu', handler, false);
   }
   log.info( "Leaving lineDown");
}

function ellipseDown(data,index) {
   log.info( "Entering ellipseDown");
   if (handler != "") {
      document.removeEventListener('contextmenu', handler);
   }

   if (data.e.which == 3) {
      //console.log("In mouse down Image")
      handler = function(e) {
         //console.log("Entering handler function");
         //console.log("contextmenuon =" + contextmenuon);
         //console.log(activeObjectVal)
         if (contextmenuon == false &&  activeObject == true) {
            e.preventDefault();
            var items = ["Delete Ellipse", "Change Color", "Send Backward", "Send To Back", "Bring Forward", "Bring To Front"];
            menus(items, e);
            $('a:contains("Delete")').click(  function() {log.debug("ellipseDown: In Delete");
                                             activeObjectVal = canvas.getActiveObject();
                                             log.trace(activeObjectVal);
                                             canvas.remove(activeObjectVal);
                                             $('#glossymenu').remove();
                                             contextmenuon = false;
                                             activeObject = false;}   );
           $('a:contains("Change Color")').click(function() {activateColorPicker(e);
                                                             $('#glossymenu').remove();
                                                             contextmenuon = false;}
                                                );
           $('a:contains("Send Backward")').click(function() {sendBackward();});
           $('a:contains("Send To Back")').click(function() {sendToBack();});
           $('a:contains("Bring Forward")').click(function() {bringFoward();});
           $('a:contains("Bring To Front")').click(function() {bringToFront();});
           contextmenuon = true;
        };
      }
      document.addEventListener('contextmenu', handler, false);
   }
   log.info( "Leaving ellipseDown");
}

function circleDown(data,index) {
   log.info( "Entering circleDown");
   if (handler != "") {
      document.removeEventListener('contextmenu', handler);
   }

   if (data.e.which == 3) {
      //console.log("In mouse down Image")
      handler = function(e) {
         //console.log("Entering handler function");
         //console.log("contextmenuon =" + contextmenuon);
         //console.log(activeObjectVal)
         if (contextmenuon == false &&  activeObject == true) {
            e.preventDefault();
            var items = ["Delete Circle", "Change Color", "Send Backward", "Send To Back", "Bring Forward", "Bring To Front"];
            menus(items, e);
            $('a:contains("Delete")').click(  function() {log.debug("circleDown: In Delete");
                                             activeObjectVal = canvas.getActiveObject();
                                             log.trace(activeObjectVal);
                                             canvas.remove(activeObjectVal);
                                             $('#glossymenu').remove();
                                             contextmenuon = false;
                                             activeObject = false;}   );
           $('a:contains("Change Color")').click(function() {activateColorPicker(e);
                                                             $('#glossymenu').remove();
                                                             contextmenuon = false;}
                                                );
           $('a:contains("Send Backward")').click(function() {sendBackward();});
           $('a:contains("Send To Back")').click(function() {sendToBack();});
           $('a:contains("Bring Forward")').click(function() {bringFoward();});
           $('a:contains("Bring To Front")').click(function() {bringToFront();});
           contextmenuon = true;
        };
      }
      document.addEventListener('contextmenu', handler, false);
   }
   log.info( "Leaving circleDown");
}

function rectangleDown(data,index) {
   log.info( "Entering rectangleDown");
   if (handler != "") {
      document.removeEventListener('contextmenu', handler);
   }

   if (data.e.which == 3) {
      //console.log("In mouse down Image")
      handler = function(e) {
         //console.log("Entering handler function");
         //console.log("contextmenuon =" + contextmenuon);
         //console.log(activeObjectVal)
         if (contextmenuon == false &&  activeObject == true) {
            e.preventDefault();
            var items = ["Delete Rectangle", "Change Color", "Send Backward", "Send To Back", "Bring Forward", "Bring To Front"];
            menus(items, e);
            $('a:contains("Delete")').click(  function() {log.debug("rectangleDown: In Delete");
                                             activeObjectVal = canvas.getActiveObject();
                                             log.trace(activeObjectVal);
                                             canvas.remove(activeObjectVal);
                                             $('#glossymenu').remove();
                                             contextmenuon = false;
                                             activeObject = false;}   );
           $('a:contains("Change Color")').click(function() {activateColorPicker(e);
                                                             $('#glossymenu').remove();
                                                             contextmenuon = false;}
                                                );
           $('a:contains("Send Backward")').click(function() {sendBackward();});
           $('a:contains("Send To Back")').click(function() {sendToBack();});
           $('a:contains("Bring Forward")').click(function() {bringFoward();});
           $('a:contains("Bring To Front")').click(function() {bringToFront();});
           contextmenuon = true;
        };
      }
      document.addEventListener('contextmenu', handler, false);
   }
   log.info( "Leaving rectangleDown");
}

function textDown(data,index) {
   log.info( "Entering textDown");
   if (handler != "") {
      document.removeEventListener('contextmenu', handler);
   }

   if (data.e.which == 3) {
      //console.log("In mouse down Image")
      handler = function(e) {
         if (contextmenuon == false &&  activeObject == true) {
            e.preventDefault();
            var items = ["Delete Text", "Change Color", "Send Backward", "Send To Back", "Bring Forward", "Bring To Front"];
            menus(items, e);
            $('a:contains("Delete")').click(  function() {log.debug("textDown: In Delete");
                                             activeObjectVal = canvas.getActiveObject();
                                             log.trace(activeObjectVal);
                                             canvas.remove(activeObjectVal);
                                             $('#glossymenu').remove();
                                             contextmenuon = false;
                                             activeObject = false;}   );
            $('a:contains("Change Color")').click(function() {activateColorPicker(e);
                                                              $('#glossymenu').remove();
                                                              contextmenuon = false;}
                                                 );
            $('a:contains("Send Backward")').click(function() {sendBackward();});
            $('a:contains("Send To Back")').click(function() {sendToBack();});
            $('a:contains("Bring Forward")').click(function() {bringFoward();});
            $('a:contains("Bring To Front")').click(function() {bringToFront();});
            contextmenuon = true;
         };
       }
   }
   document.addEventListener('contextmenu', handler, false);
   log.info( "Leaving textDown");
}

function imageDown(data,index) {
   log.info( "Entering imageDown");
   //handle right click
   if (handler != "") {
      document.removeEventListener('contextmenu', handler);
   }

   if (data.e.which == 3) {
      //console.log("In mouse down Image")
      handler = function(e) {
         //console.log("Entering handler function");
         //console.log("contextmenuon =" + contextmenuon);
         if (contextmenuon == false &&  activeObject == true) {
            //activeObjectVal = canvas.getActiveObject();
            e.preventDefault();
            log.trace("ActiveObjectVal: ", activeObjectVal);
            log.trace("Has configdbid property: ", activeObjectVal.hasOwnProperty('configdbid'));
            if (activeObjectVal.configdbid != false) {
               var items = ["Configure","Delete Image", "Send To Back", "Send Backward", "Bring Forward", "Bring To Front"];
            } else {
               var items = ["Delete Image", "Send To Back", "Send Backward", "Bring Forward", "Bring To Front"];
            }
            menus(items, e);
            $('a:contains("Configure")').click( function() {
                                                   var productId = activeObjectVal.configdbid
                                                   var companyId = 1
                                                   searchId = getItemIndex(activeObjectVal)
                                                   canvas.setActiveObject(canvas.item(searchId))
                                                   //configuratorProduct(productId, companyId, searchId);
                                                   configuratorProduct2(productId, companyId, searchId);
                                                   $('#glossymenu').remove();
                                                   contextmenuon = false;
                                                   activeObject = true;
                                                });
            $('a:contains("Delete")').click(  function() {log.debug("imageDown: In Delete");
                                               log.trace(activeObjectVal);
                                               canvas.remove(activeObjectVal);
                                               $('#glossymenu').remove();
                                               contextmenuon = false;
                                               activeObject = false;}   );
            $('a:contains("Change Color")').click(function() {activateColorPicker(e);});
            $('a:contains("Send Backward")').click(function() {sendBackward();});
            $('a:contains("Send To Back")').click(function() {sendToBack();});
            $('a:contains("Bring Forward")').click(function() {bringFoward();});
            $('a:contains("Bring To Front")').click(function() {bringToFront();});
            contextmenuon = true;
        };
     };
   };
   document.addEventListener('contextmenu', handler, false);
   log.info( "Leaving imageDown");
}


function handleDrop(e) {
   log.info( "Entering handleDrop");
   var img = document.querySelector('#images img.img_dragging');
   log.trace("Draggable Stage:", img);
   var draggy = "";
   //console.log(img);

   // this / e.target is current target element.

   if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
   }

   if (!(img == null)) {
      //console.log('event: ', e);
      //console.log("Image Variable")
      var imgsrc_val = img.getAttribute("img_val");
      log.debug("imgsrc_val: ", imgsrc_val)
      //console.log(imgsrc_val)
      //console.log(img);
      if (imgsrc_val == "line.png")
      {
         log.debug("In line.png section");
         objectName = "line";
         var xpos1 = e.layerX;
         var ypos1 = e.layerY;
         var xpos2 = xpos1 + 25;
         var ypos2 = ypos1 + 25;
         var id = objId_var + 3;
         objId = id;
         var line = makeLine([ xpos1, ypos1, xpos2, ypos2 ], id)
         //console.log("Line before makecircle")
         //console.log(line)
         line.hasBorders = line.hasControls = false
         canvas.add(line)
         c[id] = makeCircle(line);
         line.c1 = c[id][0];
         line.c2 = c[id][1];

         line.id = itemId
         itemId = itemId + 1;
         canvas.add(c[id][0],c[id][1]);
         line.on("mousedown", function(data, index) { lineDown(data,index); });
      } else if (imgsrc_val == "circle_icon.png") {
        log.debug("In circle_icon.png section");
        objectName = "circle";
        var xpos1 = e.layerX;
        var ypos1 = e.layerY;
        var id = objId_var + 1;
        objId = id;
        var circleShape = makeCircleShape([ xpos1, ypos1 ], id)
        circleShape.hasBorders = circleShape.hasControls = true
        circleShape.on("mousedown", function(data, index) { circleDown(data,index); });
        circleShape.id = itemId
        itemId = itemId + 1;
        //console.log(line)
        //circleShape.hasBorders = circleShape.hasControls = true
        canvas.add(circleShape)
      } else if (imgsrc_val == "ellipse_icon.png") {
        log.debug("In ellipse_icon.png section");
        objectName = "circle";
        var xpos1 = e.layerX;
        var ypos1 = e.layerY;
        var id = objId_var + 1;
        objId = id;
        var ellipseShape = makeEllipseShape([ xpos1, ypos1 ], id)
        ellipseShape.hasBorders = ellipseShape.hasControls = true
        ellipseShape.on("mousedown", function(data, index) { ellipseDown(data,index); });
        ellipseShape.id = itemId
        itemId = itemId + 1;
        canvas.add(ellipseShape)
      } else if (imgsrc_val == "rectangle-icon.png") {
        log.debug("In rectangle-icon.png section");
        objectName = "rectangle";
        var xpos1 = e.layerX;
        var ypos1 = e.layerY;
        var id = objId_var + 1;
        objId = id;
        var rectangleShape = makeRectangleShape([ xpos1, ypos1 ], id);
        rectangleShape.hasBorders = rectangleShape.hasControls = true
        rectangleShape.on("mousedown", function(data, index) { rectangleDown(data,index); });
        rectangleShape.id = itemId
        itemId = itemId + 1;
        canvas.add(rectangleShape)
      } else if (imgsrc_val == "textbox_icon.png") {
         log.debug("In textbox_icon.png section");
         var textbox = new fabric.IText('Tap and Type', {
             fontFamily: 'arial black',
             fontSize: 12,
             left: e.layerX,
             top: e.layerY
         });
         textbox.hasBorders = textbox.hasControls = true
         textbox.id = itemId
         itemId = itemId + 1;
         canvas.add(textbox);
         //console.log(textbox);
         textbox.on("mousedown", function(data, index) { textDown(data,index); });
      } else {
         log.debug("In drag down else category")
         var newImage = new fabric.CustomImage(img, {
            width: img.width,
            height: img.height,
            left: e.layerX,
            top: e.layerY,
            config: 'undefined'
         });
         if(img.hasAttribute('data-config')) {
           log.debug("Has data-config")
           newImage.configdbid = img.getAttribute('data-config')
           log.debug("data-config: ", newImage.configdbid);
         } else {
           newImage.configdbid = false;
         }
         if(img.hasAttribute('data-model')) {
           log.debug("Has data-model")
           newImage.model = img.getAttribute('data-model')
           log.debug("data-model: ", newImage.model);
         } else {
           newImage.model = false;
         }
         //console.log(newImage);
         newImage.id = itemId

         itemId = itemId + 1;
         canvas.add(newImage);
         newImage.on("mousedown", function(data, index) { imageDown(data,index); });
      }
      this.classList.remove('over');
      return false;
   }
   log.info( "Leaving handleDrop");
}

function contextMenu(env) {
   log.info( "Entering contextMenu");
   var x = env.offsetX;
   var y = env.offsetY;
   $.each (canvas._objects, function(i, e) {
   // e.left and e.top are the middle of the object use some "math" to find the outer edges
     var d = e.width / 2;
     var h = e.height / 2;
     if (x >= (e.left - d) && x <= (e.left+d)) {
        if(y >= (e.top - h) && y <= (e.top+h)) {
           //console.log("clicked canvas obj #"+i);
           //TODO show custom menu at x, y
           return false; //in case the icons are stacked only take action on one.
        }
     }
   });
   log.info( "Leaving contextMenu");
   return false; //stops the event propigation
}

function menus(items, event) {
   log.info( "Entering menus");
   $('body').append("<div id='glossymenu' class='glossymenu'>");
   $('#glossymenu').append("<ul id='ulglossymenu'>");
   for (index=0; index < items.length; index++) {
      $('#ulglossymenu').append("<li> <a>" + items[index] + "</a> </li>");
   }
   $('#glossymenu').append("</ul>");
   $('#body').append("</div>");
   var posY = event.layerY + "px";
   var posX = event.layerX + "px";
   //console.log("PosX : " + event.layerX);
   //console.log("PosY : " + event.layerY);
   $('#glossymenu').css('top',posY);
   $('#glossymenu').css('left',posX);
   log.info( "Leaving menus");
};

function handleDragEnd(e) {
   log.info( "Entering handleDragEnd");
   // this/e.target is the source node.
   [].forEach.call(images, function (img) {    img.classList.remove('img_dragging');  });
   log.info( "Leaving handleDragEnd");
};

function drawAsPNG(){
    log.info( "Entering drawAsPNG");
    canvas.isDrawingMode = false;

    if(!window.localStorage){alert("This function is not supported by your browser."); return;}
    // to PNG
    window.open(canvas.toDataURL('png'));
    log.info( "Leaving drawAsPNG");
};

function getItemIndex(object) {
     log.info( "Entering getItemIndex");
     id = object.id;
     index = 0;
     objectList = canvas.getObjects();
     for (i = 0; i < objectList.length; i++) {
       if (objectList[i].id == id) {
         index = i
       }
     }
     log.info( "Leaving getItemIndex");
     return index;
}

var popup;
function configuratorProduct(productId, companyId, searchId) {
   log.info( "Entering configuratorProduct");
   popup = window.open("/companies/" + companyId + "/prices/" + productId + "/productconfig.html?searchId=" + searchId, "Popup", "width=300,height=500");
   popup.focus();
   log.info( "Leaving configuratorProduct");
}

function backgroundModal() {
  log.info( "Entering backgroundModal");
  $('#backgroundSection').modal('show');
  log.info( "Leaving backgroundModal");
}

function loadConfigScreen( data, selectChoices, splitVals ) { jsondata = data;
   log.info( "Entering loadConfigScreen");
   if (jsondata.error == "Data Not Found") {
     document.getElementById('data').innerHTML += '<br>' + jsondata.error;
   }
   else {
     jsondata = JSON.parse(jsondata.price);
   document.getElementById('data').innerHTML += '<br>' + jsondata.product.name;
   for (i=0; i< jsondata.product.options.length; i++) {
      var newNode = document.createElement('div');
      newNode.className = 'row';
      var newNode2 = document.createElement('div');
      newNode2.className = 'col-sm-3';
      newNode2.innerHTML += jsondata.product.options[i].opname
      newNode.appendChild(newNode2)
      var newNode3 = document.createElement('div');
      newNode3.className = 'col-sm-9';
      var selectHTML = "";
      var selectid = 'select' + i
      selectHTML='<select id="' + selectid + '">';
      for (j=0; j< jsondata.product.options[i].selections.length; j++) {
         selectHTML += '<option value=\'{"code":"'
         selectHTML += jsondata.product.options[i].selections[j].code
         selectHTML += '","price":"'
         selectHTML += jsondata.product.options[i].selections[j].price
         selectHTML +='"}\''
         if (selectChoices) {
             if (jsondata.product.options[i].selections[j].code == splitVals[i+1]) {
                selectHTML +=' selected="selected" '
             }
         }
         selectHTML += '>'
         selectHTML +=jsondata.product.options[i].selections[j].description
         selectHTML +='</option>'
      }
      selectHTML += "</select>";
      newNode3.innerHTML += selectHTML
      newNode.appendChild(newNode3)
      document.getElementById('data').appendChild(newNode);
    }
    configString(jsondata,searchId)
    log.debug("Adding Listeners: Before For Loop")
    for (i=0; i< jsondata.product.options.length; i++) {
      var selectid = 'select' + i
      document.getElementById(selectid).onchange = function() {
            var index = this.selectedIndex;
            var inputText = this.children[index].innerHTML.trim();
            log.trace(inputText);
            configString(jsondata,searchId)
      }
    }
  }
    $('#gifspinner').fadeOut( 400 )
    log.info( "Leaving loadConfigScreen");
}

function configuratorProduct2(productId, companyId, searchId) {
   log.info( "Entering configuratorProduct2");
   $('#configsection').modal('show');
   $('#gifspinner').show();
   document.getElementById('data').innerHTML = "";
   var selectChoices = false;
   var splitVals = "";
   var objectConfig = canvas.item(searchId).config
   if (objectConfig != undefined) {
      log.info( "Object Config is Defined: ", objectConfig);
      selectChoices = true;
      splitVals = objectConfig.split("-")
   }
   //var jsontext= #{@price.price};
   //console.log(JSON.stringify(json_data))
   var json_url = "/companies/" + companyId + "/prices/" + productId + "/productconfig.json"
   var jsondata = "";
   $.ajax({
           url: json_url, // Route to the Script Controller method
          type: "GET",
      dataType: "json",
          data: jsondata,
   contentType: "application/json",
       timeout: 3000, // sets timeout to 3 seconds
      complete: function() {
                  $('#gifspinner').fadeOut( 400 );
                  log.info( "Ajax Call is Complete");
                },
       success: function(data, textStatus, xhr) {
                   loadConfigScreen( data, selectChoices, splitVals );
                    configString(data,searchId);
                   log.info( "Ajax Call is Success");
                },
         error: function(data, textStatus) {
                log.trace(data);
                alert(textStatus);
                log.info( textStatus);
                }
        });
   log.info( "Leaving configuratorProduct2");
}

function configString(jsontext,searchId) {
  log.info( "Entering configString");
  var configurationString = jsontext.product.name;
  var priceString = "List Price: $";
  var listPrice = jsontext.product.basePrice;
  for (i=0; i< jsontext.product.options.length; i++) {
       selectid = 'select' + i
       var index = document.getElementById(selectid).selectedIndex
       configurationString += '-'
       var values = JSON.parse(document.getElementById(selectid).children[index].value)
       configurationString += values.code
       listPrice = parseInt(listPrice) + parseInt(values.price)
  }
  document.getElementById('prodconfig').innerHTML = configurationString
  document.getElementById('price').innerHTML = listPrice
  SetConfig(searchId)
  log.info( "Leaving configString");
}

function SetConfig(searchId) {
         log.info( "Entering SetConfig");
     //var canvas = "";
     //if (window.opener != null && !window.opener.closed) {
         //canvas = document.getElementById("demoCanvas2").fabric
         canvas.item(searchId).config = document.getElementById('prodconfig').innerHTML
         canvas.item(searchId).price = document.getElementById('price').innerHTML
         canvas.renderAll();
         log.info( "Leaving SetConfig");
     //}
     //window.close();
 }
;
