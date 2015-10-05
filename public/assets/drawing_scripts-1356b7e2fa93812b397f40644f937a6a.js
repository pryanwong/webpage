function onSave(company_id, user_id, id) {
 console.log("In OnSave")

 // Remove circle0 and circle1 from image
 objects = canvas.getObjects();
 var len = objects.length;
 for (index=len -1; index > -1; index--) {
   if (objects[index].type == "circle0" || objects[index].type == "circle1") {
     console.log("Removed: " + objects[index].type)
     canvas.remove(objects[index]);
   }
 }
 var data_drawing2 = JSON.stringify(canvas);
 var token = $('meta[name="csrf-token"]').attr('content');
 console.log("Token: " + token)
 var json_data = { company_id: company_id,
                   user_id:  user_id,
                   id: id,
                   authenticity_token: token,
                   drawing: canvas  }
 console.log(JSON.stringify(json_data))
 var json_url = "/companies/" + company_id + "/users/" + user_id + "/drawings/" + id +".json"
 console.log(json_data);
 $.ajax({
         url: json_url, // Route to the Script Controller method
        type: "patch",
    dataType: "json",
 contentType: "application/json",
        data: JSON.stringify(json_data), // This goes to Controller in params hash, i.e. params[:file_name]
    complete: function() {},
     success: function(data, textStatus, xhr) {
                // Do something with the response here
                alert("Saved!")
              },
       error: function(data, textStatus) {
              console.log(data);
             alert(textStatus);
              }
      });
}
function handleDragStart(e) {
 [].forEach.call(images, function (img) {
   img.classList.remove('img_dragging');
 });
 this.classList.add('img_dragging');
}

function makeLine(coords, id) {
   console.log("Inside Makeline objId: " + id)
   return new fabric.Line(coords, {
     fill: 'red',
     stroke: 'red',
     strokeWidth: 5,
     selectable: true,
     objId: id,
     perPixelTargetFind: true,
   });
 }

 function activateColorPicker(e) {
      var activeObject = e.target;
      document.getElementById('myColor').color.showPicker();
 }

 function colorPickerChange(newLineColor) {
      if (activeObjectVal) {
        if (activeObjectVal.type) {
          if (activeObjectVal.type == "line") {
            activeObjectVal.fill = newLineColor;
            activeObjectVal.stroke = newLineColor;
          }
        }
      }
 }

 function makeCircle(line) {
     console.log("Line Passed In")
     console.log(line)
     var c1 = new fabric.Circle({
       left: line.get('x1'),
       top: line.get('y1'),
       strokeWidth: 2,
       radius: 3,
       fill: '#fff',
       stroke: '#666',
       belongsTo: line.objId,
       type: 'circle0'
     });
     c1.hasControls = c1.hasBorders = false;
     c1.visible = true;
     var c2 = new fabric.Circle({
       left: line.get('x2'),
       top: line.get('y2'),
       strokeWidth: 2,
       radius: 3,
       fill: '#fff',
       stroke: '#666',
       belongsTo: line.objId,
       type: 'circle1'
     });
     c2.hasControls = c2.hasBorders = false;
     c2.visible = true;
     c1.belongsTo = line.objId;
     c2.belongsTo = line.objId;
     c1.line = line;
     c2.line = line;
     line.c1 = c1;
     line.c2 = c2;
     console.log("Done Circles");
     var c = new Array(c1, c2);
     console.log(c);
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
   var activeObject = canvas.getActiveObject();
   if (activeObject) {
      canvas.sendBackwards(activeObject);
   }
   $('#glossymenu').remove();
   contextmenuon = false;
   activeObject = false;
}

function sendToBack() {
   var activeObject = canvas.getActiveObject();
   if (activeObject) {
      canvas.sendToBack(activeObject);
   }
   $('#glossymenu').remove();
   contextmenuon = false;
   activeObject = false;
}

function bringFoward() {
   var activeObject = canvas.getActiveObject();
   if (activeObject) {
      canvas.bringForward(activeObject);
   }
   $('#glossymenu').remove();
   contextmenuon = false;
   activeObject = false;
}

function bringToFront() {
   var activeObject = canvas.getActiveObject();
   if (activeObject) {
      canvas.bringToFront(activeObject);
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
      console.log("In mouse down Image")
      handler = function(e) {
         console.log("Entering handler function");
         console.log("contextmenuon =" + contextmenuon);
         console.log(activeObjectVal)
         if (contextmenuon == false &&  activeObject == true) {
            e.preventDefault();
            var items = ["Delete", "Change Color", "Send Backward", "Send To Back", "Bring Forward", "Bring To Front"];
            menus(items, e);
            $('a:contains("Delete")').click(  function() {console.log("In Delete");
                                             var activeObject = canvas.getActiveObject();
                                             console.log(activeObjectVal);
                                             canvas.remove(activeObjectVal.c1)
                                             canvas.remove(activeObjectVal.c2)
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
      }
      document.addEventListener('contextmenu', handler, false);
   }

}

function textDown(data,index) {
   if (handler != "") {
      document.removeEventListener('contextmenu', handler);
   }

   if (data.e.which == 3) {
      console.log("In mouse down Image")
      handler = function(e) {
         console.log("Entering handler function");
         console.log("contextmenuon =" + contextmenuon);
         console.log(activeObjectVal)
         if (contextmenuon == false &&  activeObject == true) {
            e.preventDefault();
            var items = ["Delete", "Change Label", "Send Backward", "Send To Back", "Bring Forward", "Bring To Front"];
            menus(items, e);
            $('a:contains("Delete")').click(  function() {console.log("In Delete");
                                             var activeObject = canvas.getActiveObject();
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
       }
   }
   document.addEventListener('contextmenu', handler, false);

}

function imageDown(data,index) {

   //handle right click

   //stop showing browser menu
   console.log("Clicked on object #"+index)
   console.log(data.e.which)
   console.log(data);
   console.log(this);
   if (handler != "") {
      document.removeEventListener('contextmenu', handler);
   }

   if (data.e.which == 3) {
      console.log("In mouse down Image")
      handler = function(e) {
         console.log("Entering handler function");
         console.log("contextmenuon =" + contextmenuon);
         if (contextmenuon == false &&  activeObject == true) {
            e.preventDefault();
            var items = ["Delete", "Send To Back", "Send Backward", "Bring Forward", "Bring To Front"];
            menus(items, e);
            $('a:contains("Delete")').click(  function() {console.log("In Delete");
                                               var activeObject = canvas.getActiveObject();
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
   console.log(img);

   // this / e.target is current target element.

   if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
   }

   if (!(img == null)) {
      console.log('event: ', e);
      console.log("Image Variable")
      var imgsrc_val = img.getAttribute("img_val");
      console.log(imgsrc_val)
      console.log(img);
      if (imgsrc_val == "line.png")
      {
         objectName = "line";
         var xpos1 = e.layerX;
         var ypos1 = e.layerY;
         var xpos2 = xpos1 + 25;
         var ypos2 = ypos1 + 25;
         var id = objId + 3;
         objId = id;
         var line = makeLine([ xpos1, ypos1, xpos2, ypos2 ], id)
         console.log("Line before makecircle")
         console.log(line)
         line.hasBorders = line.hasControls = false
         canvas.add(line)
         c = makeCircle(line);
         line.c1 = c[0];
         line.c2 = c[1];
         canvas.add(c[0],c[1]);
         line.on("mousedown", function(data, index) { lineDown(data,index); });
      } else if (imgsrc_val == "textbox_icon.png") {
         console.log("Hello!!!")
         var textbox = new fabric.IText('Tap and Type', {
             fontFamily: 'arial black',
             fontSize: 12,
             left: e.layerX,
             top: e.layerY
         });
         textbox.hasBorders = textbox.hasControls = true
         canvas.add(textbox);
         console.log(textbox);
         canvas.on("mousedown", function(data, index) { textDown(data,index); });
      } else {
         var newImage = new fabric.Image(img, {
            width: img.width,
            height: img.height,
            // Set the center of the new object based on the event coordinates relative
            // to the canvas container.
            left: e.layerX,
            top: e.layerY
         });
         console.log(newImage);
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
           console.log("clicked canvas obj #"+i);
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
   console.log("PosX : " + event.layerX);
   console.log("PosY : " + event.layerY);
   $('#glossymenu').css('top',posY);
   $('#glossymenu').css('left',posX);
};

function handleDragEnd(e) {
   // this/e.target is the source node.
   [].forEach.call(images, function (img) {    img.classList.remove('img_dragging');  });
};
