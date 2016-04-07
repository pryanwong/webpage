function modernizerFunction(Mod, doc ) {
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
};

function objectBoundaryCheck(e){
  e.target.setCoords();
  if (e.target.type != "circle0" && e.target.type != "circle1") {
     var obj = e.target;
     var posBottom = e.target.getBoundingRect().top + e.target.getBoundingRect().height;
     var posRight = e.target.getBoundingRect().left + e.target.getBoundingRect().width;
     var boundRect = obj.getBoundingRect();
     var x1Delta = -(boundRect.left - obj.left)
     var y1Delta = -(boundRect.top - obj.top)
     bounds = {tl: {x: 0, y: 0}, br: {x: canvas.width , y: canvas.height } };


     // top-left  corner
     if((e.target.getBoundingRect().top <= bounds.tl.y || e.target.getBoundingRect().left <= bounds.tl.x) ){
       e.target.setTop(Math.max(e.target.top  , y1Delta  ));
       e.target.left = Math.max(e.target.left , x1Delta );
       e.target.setCoords();
       canvas.renderAll();
     }

     // bot-right corner
     if((posBottom >= bounds.br.y || posRight >= bounds.br.x )){
        if (posBottom >= bounds.br.y) {
           if (e.target.angle >= 270 && e.target.angle < 360) {
              e.target.top = bounds.br.y -  e.target.getBoundingRect().height + y1Delta;
           } else if (e.target.angle >= 90 && e.target.angle <= 180){
              e.target.top = bounds.br.y -  e.target.getBoundingRect().height + y1Delta
              console.log("Calculated Top: " + (bounds.br.y -  e.target.getBoundingRect().height + y1Delta))
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
};

function boundaryInspectorCircle(e) {
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
};

function objectResize(e) {
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
};

function selectionCleared(e)  {
   lineActive = true
   lineSelected = false
};

function mouseDown(e)  {
    $('#glossymenu').remove();
    contextmenuon = false;
};

function objectSelected(e) {
   activeObject = true;
   activeObjectVal = e.target;
   var objType = e.target.get('type');
   if (e.target.type == "line") {
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
};

function mouseOut(e) {
   e.target.setOpacity(1);
   canvas.renderAll();
   if (e.target.type) {
   }
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
};

function mouseOver(e) {
  e.target.setOpacity(0.5);
  activeObjectVal = e.target
  if (e.target.type) {
       if (e.target.type == "line") {
         searchId = getItemIndex(e.target)
         canvas.setActiveObject(canvas.item(searchId))
       }
   }
};

function postProcessLoading(o, object) {

  if (object.type == "custom-image") {
    object.on("mousedown", function(data, index) { imageDown(data,index)   });
  }
  if (object.type == "circle") {
    object.fill = undefined
    object.on("mousedown", function(data, index) { circleDown(data,index)   });
  }

  if (object.type == "ellipse") {
    object.fill = undefined
    object.on("mousedown", function(data, index) { ellipseDown(data,index)   });
  }

  if (object.type == "rect") {
    object.fill = undefined
    object.on("mousedown", function(data, index) { rectangleDown(data,index)   });
  }

  if (object.type == "line") {
    object.objId = objId_var;
    object.on("mousedown", function(data, index) { lineDown(data,index); });
  }
  if (object.type == "i-text") {
    object.on("mousedown", function(data, index) { textDown(data,index)   });
  }


};

function onSave(company_id, user_id, id) {

 // Remove circle0 and circle1 from image
 $(".spinner").show();
 objects = canvas.getObjects();
 var temp = canvas.backgroundImage;

 if (canvas.background === "") {
   canvas.backgroundImage = "";
 }
 var len = objects.length;
 for (index=len -1; index > -1; index--) {
   if (objects[index].type == "lineGroup") {
      var items = objects[index]._objects;
      objects[index]._restoreObjectsState();
      canvas.remove(objects[index]);
      canvas.add(items[2])
   }

   if (objects[index].type == "circle0" || objects[index].type == "circle1") {
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
}

function handleDragStart(e) {
 [].forEach.call(images, function (img) {
   img.classList.remove('img_dragging');
 });
 this.classList.add('img_dragging');
}

function makeLine(coords, id) {
   //console.log("Inside Makeline objId: " + id)
   return new fabric.Line(coords, {
     fill: 'red',
     stroke: 'red',
     strokeWidth: 5,
     selectable: true,
     objId: id,
     perPixelTargetFind: true,
   });
 }

 function makeCircleShape(coords, id) {
   return new fabric.Circle({ top: coords[1],
                              left: coords[0],
                              radius: 15,
                              fill : undefined,
                              stroke : 'red',
                              lockUniScaling: true,
                              hasRotatingPoint : false,
                              strokeWidth : 5 })
 }

 function makeEllipseShape(coords, id) {
   return new fabric.Ellipse({ top: coords[1],
                              left: coords[0],
                              rx: 15,
                              ry: 7,
                              fill : undefined,
                              stroke : 'red',
                              lockUniScaling: false,
                              hasRotatingPoint : true,
                              strokeWidth : 5 })
 }

 function makeRectangleShape(coords, id) {
    return new fabric.Rect({ top: coords[1],
                             left: coords[0],
                             width: 67,
                             height: 45,
                             fill: undefined,
                             stroke : 'red',
                             hasRotatingPoint : true,
                             strokeWidth : 5 })

 }

 function activateColorPicker(e) {
      var activeObjectVal = canvas.getActiveObject();
      document.getElementById('myColor').color.showPicker();
 }

 function colorPickerChange(newLineColor) {
      if (activeObjectVal) {
        if (activeObjectVal.type) {
          if (activeObjectVal.type == "line") {
            activeObjectVal.fill = newLineColor;
            activeObjectVal.stroke = newLineColor;
          }
          if (activeObjectVal.type == "lineGroup") {
            activeObjectVal._objects[2].stroke = newLineColor;
          }
          if (activeObjectVal.type == "circle") {
            activeObjectVal.stroke = newLineColor;
          }
          if (activeObjectVal.type == "ellipse") {
            activeObjectVal.stroke = newLineColor;
          }
          if (activeObjectVal.type == "rect") {
            activeObjectVal.stroke = newLineColor;
          }
          if (activeObjectVal.type == "i-text") {
            activeObjectVal.stroke = newLineColor;
            //activeObjectVal.setColor(newLineColor);
          }
        }
      }
      canvas.renderAll();
 }

 function makeCircle(line) {
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
     return c;
 }

function handleDragOver(e) {
   if (e.preventDefault) {
      e.preventDefault(); // Necessary. Allows us to drop.
   }

   e.dataTransfer.dropEffect = 'copy'; // See the section on the DataTransfer object.
   // NOTE: comment above refers to the article (see top) -natchiketa

   return false;
}

function handleDragEnter(e) {
   // this / e.target is the current hover target.
   this.classList.add('over');
}

function handleDragLeave(e) {
    this.classList.remove('over'); // this / e.target is previous target element.
}

function sendBackward() {
   var activeObjectVal = canvas.getActiveObject();
   if (activeObjectVal) {
      canvas.sendBackwards(activeObjectVal);
   }
   $('#glossymenu').remove();
   contextmenuon = false;
   activeObject = false;
}

function sendToBack() {
   var activeObjectVal = canvas.getActiveObject();
   if (activeObjectVal) {
      canvas.sendToBack(activeObjectVal);
   }
   $('#glossymenu').remove();
   contextmenuon = false;
   activeObject = false;
}

function bringFoward() {
   var activeObjectVal = canvas.getActiveObject();
   if (activeObjectVal) {
      canvas.bringForward(activeObjectVal);
   }
   $('#glossymenu').remove();
   contextmenuon = false;
   activeObject = false;
}

function bringToFront() {
   var activeObjectVal = canvas.getActiveObject();
   if (activeObjectVal) {
      canvas.bringToFront(activeObjectVal);
   }
   $('#glossymenu').remove();
   contextmenuon = false;
   activeObject = false;
}

function lineDown(data,index) {
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

}

function ellipseDown(data,index) {
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
            $('a:contains("Delete")').click(  function() {console.log("ellipseDown: In Delete");
                                             activeObjectVal = canvas.getActiveObject();
                                             console.log(activeObjectVal);
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

}

function circleDown(data,index) {
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
            $('a:contains("Delete")').click(  function() {console.log("circleDown: In Delete");
                                             activeObjectVal = canvas.getActiveObject();
                                             console.log(activeObjectVal);
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

}

function rectangleDown(data,index) {
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
            $('a:contains("Delete")').click(  function() {console.log("rectangleDown: In Delete");
                                             activeObjectVal = canvas.getActiveObject();
                                             console.log(activeObjectVal);
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

}

function textDown(data,index) {
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
            $('a:contains("Delete")').click(  function() {console.log("textDown: In Delete");
                                             activeObjectVal = canvas.getActiveObject();
                                             console.log(activeObjectVal);
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

}

function imageDown(data,index) {

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
            if (activeObjectVal.hasOwnProperty('configdbid')) {
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
            $('a:contains("Delete")').click(  function() {console.log("imageDown: In Delete");
                                               console.log(activeObjectVal);
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
}


function handleDrop(e) {
   var img = document.querySelector('#images img.img_dragging');
   console.log("Draggable Stage:")
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
      //console.log(imgsrc_val)
      //console.log(img);
      if (imgsrc_val == "line.png")
      {
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
         //console.log("Hello!!!")
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
         var newImage = new fabric.CustomImage(img, {
            width: img.width,
            height: img.height,
            // Set the center of the new object based on the event coordinates relative
            // to the canvas container.
            left: e.layerX,
            top: e.layerY,
            config: 'undefined'
         });
         if(img.hasAttribute('data-config')) {
           newImage.configdbid = img.getAttribute('data-config')
         }
         if(img.hasAttribute('data-model')) {
           newImage.model = img.getAttribute('data-model')
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
}

function contextMenu(env) {
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
   return false; //stops the event propigation
}

function menus(items, event) {
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
};

function handleDragEnd(e) {
   // this/e.target is the source node.
   [].forEach.call(images, function (img) {    img.classList.remove('img_dragging');  });
};

function drawAsPNG(){
    canvas.isDrawingMode = false;

    if(!window.localStorage){alert("This function is not supported by your browser."); return;}
    // to PNG
    window.open(canvas.toDataURL('png'));
};

function getItemIndex(object) {
     id = object.id;
     index = 0;
     objectList = canvas.getObjects();
     for (i = 0; i < objectList.length; i++) {
       if (objectList[i].id == id) {
         index = i
       }
     }
     return index;
}

var popup;
function configuratorProduct(productId, companyId, searchId) {
   popup = window.open("/companies/" + companyId + "/prices/" + productId + "/productconfig.html?searchId=" + searchId, "Popup", "width=300,height=500");
   popup.focus();
}

function backgroundModal() {
  $('#backgroundSection').modal('show');
}

function loadConfigScreen( data, selectChoices, splitVals ) { jsondata = data;

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
    console.log("Adding Listeners: Before For Loop")
    for (i=0; i< jsondata.product.options.length; i++) {
      var selectid = 'select' + i
      document.getElementById(selectid).onchange = function() {
            var index = this.selectedIndex;
            var inputText = this.children[index].innerHTML.trim();
            console.log(inputText);
            configString(jsondata,searchId)
      }
    }
  }
    $('#gifspinner').fadeOut( 400 )
}

function configuratorProduct2(productId, companyId, searchId) {
   $('#configsection').modal('show');
   $('#gifspinner').show();
   document.getElementById('data').innerHTML = "";
   var selectChoices = false;
   var splitVals = "";
   var objectConfig = canvas.item(searchId).config
   if (objectConfig != undefined) {
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
                },
       success: function(data, textStatus, xhr) {
                   loadConfigScreen( data, selectChoices, splitVals );
                    configString(data,searchId);
                },
         error: function(data, textStatus) {
                console.log(data);
                alert(textStatus);
                }
        });

}

function configString(jsontext,searchId) {
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
}

function SetConfig(searchId) {
     //var canvas = "";
     //if (window.opener != null && !window.opener.closed) {
         //canvas = document.getElementById("demoCanvas2").fabric
         canvas.item(searchId).config = document.getElementById('prodconfig').innerHTML
         canvas.item(searchId).price = document.getElementById('price').innerHTML
         canvas.renderAll();
     //}
     //window.close();
 }
;
