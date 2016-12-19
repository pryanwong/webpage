var customlinetwoarrow = function(coords, id) {
};

customlinetwoarrow.setLinePositions = function(e) {
  var p = e.target;
  var objType = p.get('type');
  var objId = p.get('objId');
  var _curXm = (_curX - e.e.clientX);
  var _curYm = (_curY - e.e.clientY);
  for (var i = 0; i < canvas.getObjects().length; i++) {
    var currentObj = canvas.getObjects()[i];
    if (currentObj.type == "carrowtwo" && currentObj.get('belongsTo') == objId) {
      _c2Top = currentObj.getTop();
      _c2Left = currentObj.getLeft();
      currentObj.set({
        'left': (currentObj.left - _curXm),
        'top': (currentObj.top - _curYm)
      });

      currentObj.setCoords();

      currentObj.line && currentObj.line.set({
          'x1': currentObj.left,
          'y1': currentObj.top
        });

      currentObj.line.setCoords();
    }

    if (currentObj.type == "carrow" && currentObj.get('belongsTo') == objId) {
      _c1Top = currentObj.getTop();
      _c1Left = currentObj.getLeft();
      currentObj.set({
        'left': (currentObj.left - _curXm) ,
        'top': (currentObj.top - _curYm)
      });

      currentObj.setCoords();

      currentObj.line && currentObj.line.set({
          'x2': currentObj.left,
          'y2': currentObj.top
        });

      currentObj.line.setCoords();
    }


  }
  _curX = e.e.clientX;
  _curY = e.e.clientY;
};

customlinetwoarrow.setLineCirclePositionsBoundary = function(e) {
  var p = e.target;
  var objType = p.get('type');
  var objId = p.get('objId')
  var _curXm = (_curX - e.e.clientX);
  var _curYm = (_curY - e.e.clientY);
  _circleOne = p.carrow;
  _circleTwo = p.carrowtwo;

  _circleTwo && _circleTwo.set({
      'left': _c2Left,
      'top': _c2Top
  });

  _circleTwo.setCoords();

  _circleTwo.line && _circleTwo.line.set({
       'x2': _circleTwo.left,
       'y2': _circleTwo.top
  });

  _circleTwo.line.setCoords();


  _circleOne.line && _circleOne.set({
      'left': _c1Left,
      'top': _c1Top
  });

  _circleOne.setCoords();
  //setCircleLineAtBoundary(currentObj,p)

  _circleOne.line && _circleOne.line.set({
        'x1': _circleOne.left,
        'y1': _circleOne.top
  });

  _circleOne.line.setCoords();
  p && p.set({ 'x1': _circleOne.left, 'y1': _circleOne.top, 'x2':  _circleTwo.left, 'y2':  _circleTwo.top });
  p.setCoords();
  _curX = e.e.clientX;
  _curY = e.e.clientY;

};

customlinetwoarrow.makeLineTwoArrow = function(coords, id) {
   log.info( "Entering makeLine");
   log.debug("Coords are: ", coords);
   line =  new fabric.Customlinetwoarrow(coords, {
     x1: coords[0],
     y1: coords[1],
     x2: coords[2],
     y2: coords[3],
     originX: 'center',
     originY: 'center',
     fill: shadeColor1('#000',-40),
     stroke: shadeColor1('#000',-40),
     strokeWidth: 5,
     selectable: true,
     objId: id,
     perPixelTargetFind: true,
   });
   line.hasControls = false;
   log.info( "Leaving makeLine");
   return line;
 }

customlinetwoarrow.lineArrowTwoDown = function(data,index) {
    log.info( "Entering lineDown");

    if (activeObjectVal) {
      activeObject = true;
    }
    if (handler != "") {
       document.removeEventListener('contextmenu', handler);
    }
    if (data.e.which == 3) {
       handler = function(e) {
          if (contextmenuon == false &&  activeObject == true) {
             e.preventDefault();
             var items = ["Delete", "Change Color", "Send Backward", "Send To Back", "Bring Forward", "Bring To Front"];
             angular.element(document.querySelector('[ng-controller="ModalProductConfigController as mpc"]')).scope().mpc.deleteAction = (  function() {
                                              var activeObjectVal = getItemByIndex(searchId)
                                              if (activeObjectVal.type) {
                                                if (activeObjectVal.type == "customlinetwoarrow") {
                                                  canvas.remove(activeObjectVal.carrowtwo)
                                                  canvas.remove(activeObjectVal.carrow)
                                                  canvas.remove(activeObjectVal);
                                                } else if(activeObjectVal.hasOwnProperty('belongsTo')) {
                                                  var objs = canvas.getObjects()
                                                  // find line with belongsTo value
                                                  var searchVal = activeObjectVal.get('belongsTo')
                                                  var found = false;
                                                  var i = 0;
                                                  while (!found && i < objs.length) {
                                                    if (objs[i].type == "customlinetwoarrow") {
                                                      if (objs[i].objId == searchVal) {
                                                        found= true;
                                                      }
                                                    }
                                                    i = i + 1;
                                                  }
                                                  if (found) {
                                                    i = i -1;
                                                    canvas.remove(objs[i].carrowtwo)
                                                    canvas.remove(objs[i].carrow)
                                                    canvas.remove(objs[i]);
                                                  }
                                                  canvas.renderAll()
                                                }
                                              }
                                              $('#contextMenu').remove();
                                              contextmenuon = false;
                                              activeObject = false;
                                            });
             updateSearchId(data);
             linemenus(items, e);

            contextmenuon = true;
         };
       }
       document.addEventListener('contextmenu', handler, false);
    }
    log.info( "Leaving lineDown");
 };

 customlinetwoarrow.makeArrowTwo =function(line) {
     log.info( "Entering makeArrowTwo");
     var c1 =  new fabric.Carrowtwo({
              left: line.get('x1')-2.5,
              top: line.get('y1')-2.5,
              originX: 'center',
              originY: 'center',
              hasBorders: false,
              hasControls: false,
              lockScalingX: true,
              lockScalingY: true,
              lockRotation: true,
              pointType: 'arrow_start',
              angle: -45,
              width: 15,
              height: 15,
              fill: '#000'
          });
     c1.setBelongsTo(line.objId);
     var c2 =  new fabric.Carrow({
              left: line.get('x2'),
              top: line.get('y2'),
              originX: 'center',
              originY: 'center',
              hasBorders: false,
              hasControls: false,
              lockScalingX: true,
              lockScalingY: true,
              lockRotation: true,
              pointType: 'arrow_start',
              angle: 135,
              width: 15,
              height: 15,
              fill: '#000'
          });
     c2.setBelongsTo(line.objId);
     c1.hasBorders = c1.hasControls = false;
     c2.hasBorders = c2.hasControls = false;
     c1.line = line;
     c2.line = line;
     line.carrowtwo = c1;
     line.carrow = c2;
     var c = new Array(c1, c2);
     log.info( "Leaving makeCircle");
     return c;
 }

 customlinetwoarrow.lineDrop = function(e, id) {
   log.debug("In line.png section");
   objectName = "customlinetwoarrow";
   var xpos1 = e.layerX;
   var ypos1 = e.layerY;
   var xpos2 = xpos1 + 25;
   var ypos2 = ypos1 + 25;
   objId = id;
   var line = customlinetwoarrow.makeLineTwoArrow([ xpos1, ypos1, xpos2, ypos2 ], id)
   line.hasControls = false
   itemId = itemId + 1;
   line.id = itemId
   line.objId = itemId;
   canvas.add(line)
   c[id] = customlinetwoarrow.makeArrowTwo(line);
   line.carrowtwo = c[id][0];
   line.carrow    = c[id][1];
   canvas.add(c[id][0],c[id][1]);
   canvas.renderAll();
   line.on("mousedown", function(data, index) { customlinetwoarrow.lineArrowTwoDown(data,index); });
}
