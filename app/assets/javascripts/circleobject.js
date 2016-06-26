var circleobject = function() {
};

circleobject.objectResize = function(e) {
   log.info( "Entering objectResize");
   newWidth = e.target.width * e.target.scaleX;
   newRadius = e.target.radius * e.target.scaleX;
   e.target.set({ width: newWidth, radius: newRadius, height: newWidth, scaleX: 1, scaleY: 1 });
};

circleobject.postprocessLoading = function(object) {
  log.debug( "Processing circle");
  object.fill = undefined
  object.on("mousedown", function(data, index) { circleDown(data,index);   });
};

circleobject.makeCircleShape = function(coords, id){
  log.info( "Entering makeCircleShape");
  return new fabric.Circle({ top: coords[1],
                             left: coords[0],
                             radius: 15,
                             fill : undefined,
                             stroke : 'red',
                             lockUniScaling: true,
                             hasRotatingPoint : false,
                             strokeWidth : 5 });
  log.info( "Leaving makeCircleShape");
};

circleobject.circleDown = function(data,index) {
   console.log("Data: ", data);
   log.info( "Entering circleDown");
   if (handler != "") {
      document.removeEventListener('contextmenu', handler);
   }
   if (activeObjectVal) {
     activeObject = true;
   }
   if (data.e.which == 3) {
      handler = function(e) {
         if (contextmenuon == false &&  activeObject == true ) {
            e.preventDefault();
            var items = ["Delete Circle", "Change Color", "Send Backward", "Send To Back", "Bring Forward", "Bring To Front"];
            menus(items, e);
            $('a:contains("Delete")').click(  function() {log.debug("circleDown: In Delete");
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
   log.info( "Leaving circleDown");
};

circleobject.circledrop = function(e, id) {
  log.debug("In circle_icon.png section");
  objectName = "circle";
  var xpos1 = e.layerX;
  var ypos1 = e.layerY;
  var id = objId_var + 1;
  objId = id;
  var circleShape = circleobject.makeCircleShape([ xpos1, ypos1 ], id)
  circleShape.hasBorders = circleShape.hasControls = true
  circleShape.on("mousedown", function(data, index) { circleDown(data,index); });
  circleShape.id = itemId
  itemId = itemId + 1;
  canvas.add(circleShape)
};
