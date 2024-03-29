var rectobject = function() {
};

rectobject.objectResize = function(e) {
  newWidth = e.target.width * e.target.scaleX;
  newHeight = e.target.height * e.target.scaleY;
  e.target.set({ height: newHeight, width: newWidth, scaleX: 1, scaleY: 1, });
}

rectobject.makeRectangleShape = function(coords, id) {
  log.info( "Entering makeRectangleShape");
  return new fabric.Rect({ top: coords[1],
                           left: coords[0],
                           width: 67,
                           height: 45,
                           fill: undefined,
                           stroke : 'black',
                           hasRotatingPoint : true,
                           strokeWidth : 5 });
};

rectobject.rectdrop = function(e,id) {
  log.debug("In rectangle-icon.png section");
  objectName = "rectangle";
  var xpos1 = e.layerX;
  var ypos1 = e.layerY;
  var id = objId_var + 1;
  objId = id;
  var rectangleShape = rectobject.makeRectangleShape([ xpos1, ypos1 ], id);
  rectangleShape.hasBorders = rectangleShape.hasControls = true
  rectangleShape.on("mousedown", function(data, index) { rectobject.rectangleDown(data,index); });
  itemId = itemId + 1;
  rectangleShape.id = itemId
  itemId = itemId + 1;
  canvas.add(rectangleShape)
};

rectobject.rectangleDown = function(data,index) {
   log.info( "Entering rectangleDown");
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
            var items = ["Delete", "Change Color", "Send Backward", "Send To Back", "Bring Forward", "Bring To Front"];
            angular.element(document.querySelector('[ng-controller="ModalProductConfigController as mpc"]')).scope().mpc.deleteAction = (  function() {log.debug("rectangleDown: In Delete");
                                             var activeObjectVal = getItemByIndex(searchId)
                                             log.trace(activeObjectVal);
                                             canvas.remove(activeObjectVal);
                                             $('#contextMenu').remove();
                                             contextmenuon = false;
                                             activeObject = false;}   );
            updateSearchId(data)
            menus(items, e);

           contextmenuon = true;
        };
      }
      document.addEventListener('contextmenu', handler, false);
   }
   log.info( "Leaving rectangleDown");
}
