var lineobject = function(coords, id) {
};

lineobject.makeLine = function(coords, id) {
   log.info( "Entering makeLine");
   log.debug("Coords are: ", coords);
   line =  new fabric.Customline(coords, {
     x1: coords[0],
     y1: coords[1],
     x2: coords[2],
     y2: coords[3],
     fill: 'red',
     stroke: 'red',
     strokeWidth: 5,
     selectable: true,
     objId: id,
     perPixelTargetFind: true,
   });
   line.hasControls = false;
   log.info( "Leaving makeLine");
   return line;
 }

lineobject.setLinePositions= function(e) {
  var p = e.target;
  var objType = p.get('type');
      var objId = p.get('objId');
      var _curXm = (_curX - e.e.clientX);
      var _curYm = (_curY - e.e.clientY);
      for (var i = 0; i < canvas.getObjects().length; i++) {
        var currentObj = canvas.getObjects()[i];
        if (currentObj.type == "circleone" && currentObj.get('belongsTo') == objId) {
          _c2Top = currentObj.getTop();
          _c2Left = currentObj.getLeft();
          currentObj.set({
            'left': (currentObj.left - _curXm),
            'top': (currentObj.top - _curYm)
          });

          currentObj.setCoords();

          currentObj.line && currentObj.line.set({
              'x2': currentObj.left,
              'y2': currentObj.top
            });

          currentObj.line.setCoords();
        }

        if (currentObj.type == "circlezero" && currentObj.get('belongsTo') == objId) {
          _c1Top = currentObj.getTop();
          _c1Left = currentObj.getLeft();
          currentObj.set({
            'left': (currentObj.left - _curXm) ,
            'top': (currentObj.top - _curYm)
          });

          currentObj.setCoords();

          currentObj.line && currentObj.line.set({
              'x1': currentObj.left,
              'y1': currentObj.top
            });

          currentObj.line.setCoords();
        }


      }
      _curX = e.e.clientX;
      _curY = e.e.clientY;

};

lineobject.setLineCirclePositionsBoundary= function(e) {
  var p = e.target;
  var objType = p.get('type');
  var objId = p.get('objId');
  var _curXm = (_curX - e.e.clientX);
  var _curYm = (_curY - e.e.clientY);
  _circleOne = p.cone;
  _circleTwo = p.ctwo;

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


  _circleOne && _circleOne.set({
      'left': _c1Left,
      'top': _c1Top
  });

  _circleOne.setCoords();

  _circleOne.line && _circleOne.line.set({
     'x1': _circleOne.left,
     'y1': _circleOne.top
  });

  _circleOne.line.setCoords();
      p && p.set({ 'x1': _circleOne.left, 'y1': _circleOne.top, 'x2':  _circleTwo.left, 'y2':  _circleTwo.top });
  };


  lineobject.objectBoundaryCheck=  function(e){
     var boundaryHit = false;
     this.setLinePositions(e);
     log.info( "Entering  objectBoundaryCheck");
     $("#saveMessage").text('Changes Made, Save Pending...');
     e.target.setCoords();
     console.log("Object in boundary check: ", e.target);

     log.debug( "Checking to see if the end points of a line are being dragged ");
        var obj = e.target;
        var posBottom = e.target.getBoundingRect().top + e.target.getBoundingRect().height;
        var posRight = e.target.getBoundingRect().left + e.target.getBoundingRect().width;
        var boundRect = obj.getBoundingRect();
        var x1Delta = -(boundRect.left - obj.left);
        var y1Delta = -(boundRect.top - obj.top);
        bounds = {tl: {x: 0, y: 0}, br: {x: canvas.width , y: canvas.height } };
        log.debug( "Checking to see if we hit the top-left corner");
        if((e.target.getBoundingRect().top <= bounds.tl.y || e.target.getBoundingRect().left <= bounds.tl.x) ){
          log.debug( "hit the top-left corner");
          e.target.setTop(Math.max(e.target.top  , y1Delta  ));
          e.target.left = Math.max(e.target.left , x1Delta );
          this.setLineCirclePositionsBoundary(e);
          canvas.deactivateAll();
          boundaryHit = true;
          e.target.setCoords();
        }

        // bot-right corner
        log.debug( "Checking to see if we hit the bot-right corner");
        if((posBottom >= bounds.br.y || posRight >= bounds.br.x )){
           if (posBottom >= bounds.br.y) {
              if (e.target.angle >= 270 && e.target.angle < 360) {
                 e.target.top = bounds.br.y -  e.target.getBoundingRect().height + y1Delta;
              } else if (e.target.angle >= 90 && e.target.angle <= 180){
                 e.target.top = bounds.br.y -  e.target.getBoundingRect().height + y1Delta;
                 log.debug("Calculated Top: " + (bounds.br.y -  e.target.getBoundingRect().height + y1Delta));
              } else if (e.target.angle > 180 && e.target.angle < 270){
                 e.target.top = bounds.br.y -  e.target.getBoundingRect().height +y1Delta;
              } else if (e.target.angle >= 0 && e.target.angle < 90){
                 e.target.top = bounds.br.y -  e.target.getBoundingRect().height +y1Delta ;
              }

           }
           if (posRight >= bounds.br.x) {
              if (e.target.angle >= 270 && e.target.angle < 360) {
                 e.target.left = bounds.br.x -  e.target.getBoundingRect().width;
              } else if (e.target.angle >= 90 && e.target.angle <= 180){
                 e.target.left = bounds.br.x;
              } else if (e.target.angle > 180 && e.target.angle < 270){
                 e.target.left = bounds.br.x -  e.target.getBoundingRect().width +x1Delta;
              } else if (e.target.angle >= 0 && e.target.angle < 90){
                 e.target.left = bounds.br.x -  e.target.getBoundingRect().width +x1Delta ;
              }
           }
           boundaryHit = true;
           this.setLineCirclePositionsBoundary(e);
           canvas.deactivateAll();
           e.target.setCoords();

       }
     onSave();
     log.info( "Leaving objectBoundaryCheck");
   };

   lineobject.objectSelected= function(e) {
       log.info( "Entering objectSelected");
       activeObject = true;
       activeObjectVal = e.target;
       console.log("objectSelected: ", activeObjectVal);
       var objType = e.target.get('type');
       console.log("custom line selected");
       _curX = e.e.clientX;
       _curY = e.e.clientY;
       _c1Top = e.target.cone.getTop();
       _c1Left =  e.target.cone.getLeft();
       _c2Top = e.target.ctwo.getTop();
       _c2Left = e.target.ctwo.getLeft();
   };

   lineobject.lineDown= function(data,index) {
      log.info( "Entering lineDown");
      console.log( "Entering lineDown");
      console.log("data: ", data);

      if (activeObjectVal) {
        activeObject = true;
      }
      /*
      if (canvas.getActiveObject() != null) {
        activeObjectVal = canvas.getActiveObject();
        activeObject = true;
        console.log("ActiveObjectVal: " , activeObjectVal )
      }
      */
      if (handler !== "") {
         document.removeEventListener('contextmenu', handler);
      }
      if (data.e.which == 3) {
         handler = function(e) {
            if (contextmenuon === false &&  activeObject === true) {
               e.preventDefault();
               var items = ["Delete Line", "Change Color", "Send Backward", "Send To Back", "Bring Forward", "Bring To Front"];
               menus(items, e);
               $('a:contains("Delete")').click(  function() {
                                                if (activeObjectVal.type) {
                                                  if (activeObjectVal.type == "customline") {
                                                    canvas.remove(activeObjectVal.cone);
                                                    canvas.remove(activeObjectVal.ctwo);
                                                    canvas.remove(activeObjectVal);
                                                  } else if(activeObjectVal.hasOwnProperty('belongsTo')) {
                                                    console.log("removing belongTo object");
                                                    var objs = canvas.getObjects();
                                                    // find line with belongsTo value
                                                    var searchVal = activeObjectVal.get('belongsTo');
                                                    var found = false;
                                                    var i = 0;
                                                    while (!found && i < objs.length) {
                                                      if (objs[i].type == "customline") {
                                                        if (objs[i].objId == searchVal) {
                                                          found= true;
                                                        }
                                                      }
                                                      i = i + 1;
                                                    }
                                                    if (found) {
                                                      i = i -1;
                                                      canvas.remove(objs[i].cone);
                                                      canvas.remove(objs[i].ctwo);
                                                      canvas.remove(objs[i]);
                                                    }
                                                    canvas.renderAll();
                                                  }
                                                }
                                                $('#contextMenu').remove();
                                                contextmenuon = false;
                                                activeObject = false;
                                              });
              $('a:contains("Change Color")').click(function() {activateColorPicker(e);
                                                                $('#contextMenu').remove();
                                                                contextmenuon = false;}
                                                   );
              $('a:contains("Send Backward")').click(function() {sendBackward();});
              $('a:contains("Send To Back")').click(function() {sendToBack();});
              $('a:contains("Bring Forward")').click(function() {bringFoward();});
              $('a:contains("Bring To Front")').click(function() {bringToFront();});
              contextmenuon = true;
           }
         };
         document.addEventListener('contextmenu', handler, false);
      }
      log.info( "Leaving lineDown");
   };

   lineobject.lineDrop = function(e,id) {
      objectName = "customline";
      var xpos1 = e.layerX;
      var ypos1 = e.layerY;
      var xpos2 = xpos1 + 25;
      var ypos2 = ypos1 + 25;
      objId = id;
      line = lineobject.makeLine([ xpos1, ypos1, xpos2, ypos2 ], id);
      line.hasControls = false;
      itemId = itemId + 1;
      line.id = itemId;
      line.objId = itemId;
      canvas.add(line);
      c[id] = lineobject.makeCircle(line);
      line.cone = c[id][0];
      line.ctwo = c[id][1];
      console.log("Line coords: ",line.get('x1') ,line.get('y1') ,line.get('x2') , line.get('y2'));
      canvas.add(c[id][0],c[id][1]);
      canvas.renderAll();
      line.on("mousedown", function(data, index) { lineDown(data,index); });
   };

   lineobject.makeCircle = function(line) {
       log.info( "Entering makeCircle");
       var c1 = new fabric.Circlezero({
         left: line.get('x1')-2.5,
         top: line.get('y1')-2.5,
         visible: 'true',
         hoverCursor: 'crosshair',
         strokeWidth:  2,
         stroke: '#000',
         radius: 5,
         fill: '#fff'
       });
       c1.setBelongsTo(line.objId);
       var c2 = new fabric.Circleone({
         left: line.get('x2')-2.5,
         top: line.get('y2')-2.5,
         visible: 'true',
         hoverCursor: 'crosshair',
         strokeWidth:  2,
         stroke: '#000',
         radius: 5,
         fill: '#fff'
       });
       c2.setBelongsTo(line.objId);
       c1.hasBorders = c1.hasControls = false;
       c2.hasBorders = c2.hasControls = false;

       c1.line = line;
       c2.line = line;
       line.cone = c1;
       line.ctwo = c2;
       var c = new Array(c1, c2);
       log.info( "Leaving makeCircle");
       return c;
   }
