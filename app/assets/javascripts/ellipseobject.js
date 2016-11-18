var ellipseobject = function() {
};

ellipseobject.objectResize = function(e) {
  newWidth = e.target.width * e.target.scaleX;
  newHeight = e.target.height * e.target.scaleY;
  newRadiusX = newWidth/2;
  newRadiusY = newHeight/2;
  e.target.set({ rx: newRadiusX, ry: newRadiusY, scaleX: 1, scaleY: 1 });
};

ellipseobject.makeEllipseShape = function(coords, id) {
  log.info( "Entering makeEllipseShape");
  return new fabric.Ellipse({ top: coords[1],
                             left: coords[0],
                             rx: 15,
                             ry: 7,
                             fill : undefined,
                             stroke : 'red',
                             lockUniScaling: false,
                             hasRotatingPoint : true,
                             strokeWidth : 5 });
};

ellipseobject.ellipseDown = function(data,index) {
   log.info( "Entering ellipseDown");
   if (handler != "") {
      document.removeEventListener('contextmenu', handler);
   }
   if (activeObjectVal) {
     activeObject = true;
   }
   if (data.e.which == 3) {
      handler = function(e) {
         if (contextmenuon == false &&  activeObject == true) {
            e.preventDefault();
            var items = ["Delete Ellipse", "Change Color", "Send Backward", "Send To Back", "Bring Forward", "Bring To Front"];
            menus(items, e);
            $('a:contains("Delete")').click(  function() {log.debug("ellipseDown: In Delete");
                                             activeObjectVal = canvas.getActiveObject();
                                             log.trace(activeObjectVal);
                                             canvas.remove(activeObjectVal);
                                             $('#contextMenu').remove();
                                             contextmenuon = false;
                                             activeObject = false;}   );
           $('a:contains("Change Color")').click(function() {activateColorPicker(e);
                                                             $('#contextMenu').remove();
                                                             contextmenuon = false;
                                                             activeObject = false;}
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
};

ellipseobject.ellipsedrop = function(e,id) {
  log.debug("In ellipse_icon.png section");
  objectName = "circle";
  var xpos1 = e.layerX;
  var ypos1 = e.layerY;
  var id = objId_var + 1;
  objId = id;
  var ellipseShape = ellipseobject.makeEllipseShape([ xpos1, ypos1 ], id);
  ellipseShape.hasBorders = ellipseShape.hasControls = true;
  ellipseShape.on("mousedown", function(data, index) { ellipseobject.ellipseDown(data,index); });
  ellipseShape.id = itemId;
  itemId = itemId + 1;
  canvas.add(ellipseShape);
};
