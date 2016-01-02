function onSave(company_id, user_id, id) {
 //console.log("In OnSave")

 // Remove circle0 and circle1 from image
 $(".spinner").show();
 objects = canvas.getObjects();
 var len = objects.length;
 for (index=len -1; index > -1; index--) {
   if (objects[index].type == "lineGroup") {
      var items = objects[index]._objects;
      objects[index]._restoreObjectsState();
      canvas.remove(objects[index]);
      canvas.add(items[2])
   }

   if (objects[index].type == "circle0" || objects[index].type == "circle1") {
     //console.log("Removed: " + objects[index].type)
     canvas.remove(objects[index]);
   }
 }
 var data_drawing2 = JSON.stringify(canvas);
 var token = $('meta[name="csrf-token"]').attr('content');
 var png_file = canvas.toDataURL('png');
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
            console.log("lineGroup Color Picker")
            console.log(activeObjectVal)
            activeObjectVal._objects[2].stroke = newLineColor;
          }
          if (activeObjectVal.type == "circle") {
            activeObjectVal.stroke = newLineColor;
          }
          if (activeObjectVal.type == "ellipse") {
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
   console.log("In LineDown **********************")
   console.log(data)
   console.log(index)
   console.log("activeObject: " + activeObject)
   console.log(canvas.getActiveObject())
   console.log(activeObjectVal)
   console.log("contextmenuon: " + contextmenuon)
   if (handler != "") {
      console.log("removing line handler")
      document.removeEventListener('contextmenu', handler);
   }

   console.log("Button Pressed: " + data.e.which)
   if (data.e.which == 3) {
      //console.log("In mouse down Image")
      console.log("Button 3 Pressed")
      handler = function(e) {
         //console.log("Entering handler function");
         //console.log("contextmenuon =" + contextmenuon);
         //console.log(activeObjectVal)
         if (contextmenuon == false &&  activeObject == true) {
            e.preventDefault();
            var items = ["Delete Line", "Change Color", "Send Backward", "Send To Back", "Bring Forward", "Bring To Front"];
            menus(items, e);
            $('a:contains("Delete")').click(  function() {console.log("lineDown: In Delete");
                                             if (canvas.getActiveObject() != null) {
                                                activeObjectVal = canvas.getActiveObject();
                                             }
                                             console.log("Active Object")
                                             console.log(activeObjectVal)
                                             if (activeObjectVal.type) {
                                               console.log("Object Type: " + activeObjectVal.type)

                                               if (activeObjectVal.type == "line") {
                                                 console.log("lineDown: Removing line")
                                                 console.log(activeObjectVal);
                                                 canvas.remove(activeObjectVal.c1)
                                                 canvas.remove(activeObjectVal.c2)
                                                 canvas.remove(activeObjectVal);
                                               } else if(activeObjectVal.type == "lineGroup") {
                                                 console.log("Removing LineGroup")
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

                                             console.log("Lineactive to: " + lineActive)
                                             console.log("Exiting Delete Group")

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
    console.log("In ellipseDown **********************")
    console.log(data)
    console.log(index)
    console.log("activeObject: " + activeObject)
    console.log(canvas.getActiveObject())
    console.log("handler")
    console.log(handler)
   if (handler != "") {
      console.log("removing ellipse handler")
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
   console.log("activeObject: " + activeObject)
   console.log(canvas.getActiveObject())
   if (handler != "") {
      console.log("removing circle handler")
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

function textDown(data,index) {
   console.log("In Text Down")
   console.log("activeObject: " + activeObject)
   console.log(canvas.getActiveObject())
   console.log(canvas.getActiveObject().type)
   if (handler != "") {
      console.log("removing text handler")
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

   //stop showing browser menu
   //console.log("Clicked on object #"+index)
   //console.log(data.e.which)
   //console.log(data);
   //console.log(this);
   console.log("imageDown")
   console.log("activeObject: " + activeObject)
   console.log(canvas.getActiveObject())
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
   //console.log("Draggable Stage:")
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
         console.log("Added Line: ")
         console.log(line)
         console.log(c[id][0])
         console.log(c[id][1])
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
        console.log(circleShape)
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
        console.log(ellipseShape)
        canvas.add(ellipseShape)
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
         console.log("Image Object")
         console.log(img)
         //console.log("Has configdbid: " + img.data-config)
         console.log("Has data-config: " + img.hasAttribute('data-config'))
         if(img.hasAttribute('data-config')) {
           newImage.configdbid = img.getAttribute('data-config')
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

function configuratorProduct2(productId, companyId, searchId) {
   $(".modalDialog").show();
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
   //console.log(json_data);
   var jsondata = "";

   $.getJSON( json_url, function( data ) { jsondata = data;
      console.log("Ajax output:" + jsondata)
      console.log(jsondata)
      jsonstring = jsondata.price;
      console.log(jsonstring)
      jsontext = JSON.parse(jsonstring)
      console.log(jsontext)
      document.getElementById('data').innerHTML += '<br>' + jsontext.product.name;
      for (i=0; i< jsontext.product.options.length; i++) {
         document.getElementById('data').innerHTML += '<br>' + jsontext.product.options[i].opname
         var selectHTML = "";
         var selectid = 'select' + i
         selectHTML='<select id="' + selectid + '">';
         for (j=0; j< jsontext.product.options[i].selections.length; j++) {
            selectHTML += '<option value=\'{"code":"'
            selectHTML += jsontext.product.options[i].selections[j].code
            selectHTML += '","price":"'
            selectHTML += jsontext.product.options[i].selections[j].price
            selectHTML +='"}\''
            if (selectChoices) {
                if (jsontext.product.options[i].selections[j].code == splitVals[i+1]) {
                   selectHTML +=' selected="selected" '
                }
            }
            selectHTML += '>'
            selectHTML +=jsontext.product.options[i].selections[j].description
            selectHTML +='</option>'
         }
         selectHTML += "</select>";
         document.getElementById('data').innerHTML += selectHTML
       }
       configString(jsontext,searchId)
       console.log("Adding Listeners: Before For Loop")
       for (i=0; i< jsontext.product.options.length; i++) {
         var selectid = 'select' + i
         console.log("Adding Listeners: " + selectid)
         document.getElementById(selectid).onchange = function() {
               var index = this.selectedIndex;
               var inputText = this.children[index].innerHTML.trim();
               console.log(inputText);
               configString(jsontext,searchId)
         }
         console.log(document.getElementById(selectid))
       }
       $('#gifspinner').fadeOut( 400 )
   });
}

function configString(jsontext,searchId) {
  var configurationString = jsontext.product.name;
  var priceString = "List Price: $";
  var listPrice = 0;
  for (i=0; i< jsontext.product.options.length; i++) {
       selectid = 'select' + i
       var index = document.getElementById(selectid).selectedIndex
       configurationString += '-'
       var values = JSON.parse(document.getElementById(selectid).children[index].value)
       configurationString += values.code
       listPrice = parseInt(listPrice) + parseInt(values.price)
       console.log(document.getElementById(selectid).children[index].value)
       console.log(values.code)
  }
  document.getElementById('prodconfig').innerHTML = configurationString
  document.getElementById('listconfig').innerHTML = listPrice
  SetConfig(searchId)
}

function SetConfig(searchId) {
     //var canvas = "";
     //if (window.opener != null && !window.opener.closed) {
         //canvas = document.getElementById("demoCanvas2").fabric
         canvas.item(searchId).config = document.getElementById('prodconfig').innerHTML
         canvas.item(searchId).price = document.getElementById('listconfig').innerHTML
         console.log(canvas.item(searchId))
         canvas.renderAll();
     //}
     //window.close();
 }
