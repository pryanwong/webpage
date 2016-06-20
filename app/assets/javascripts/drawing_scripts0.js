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

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function GetDebugParameter(sParam){
    log.info( "Entering  GetDebugParameter");
    var sPageURL = window.location.hash;
    log.debug("sPageURL:");
    log.debug( sPageURL);
    sPageURL = sPageURL.split("?");
    if (sPageURL.length > 1) {
       var sURLVariables = sPageURL[1].split('&');
       log.debug("sURLVariables:");
       log.debug( sURLVariables);
       for (var i = 0; i < sURLVariables.length; i++)
       {
          var sParameterName = sURLVariables[i].split('=');
          log.debug("sParameterName:")
          log.debug(sParameterName);
          if (sParameterName[0] == sParam)
          {
            log.debug("sParameterName[1]:")
            log.debug(sParameterName[1]);
            log.info( "Leaving GetDebugParameter");
            return sParameterName[1];
          }
       }
    } else {
      log.info( "Leaving GetDebugParameter returning false");
      return false;
    }
};

function setLinePositions(e) {
  var p = e.target;
  var objType = p.get('type');
  if (objType == 'customline') {
      var objId = p.get('objId')
      var _curXm = (_curX - e.e.clientX);
      var _curYm = (_curY - e.e.clientY);
      console.log("_curX, _curY: ", _curX, " ", _curY)
      console.log("Deltas: ", _curXm, " ", _curYm)
      //console.log("moved: " + _curXm);
      //console.log("moved: " + _curYm);

      //loop all circles and if some contains the line - move it
      for (var i = 0; i < canvas.getObjects().length; i++) {
        var currentObj = canvas.getObjects()[i];
        if (currentObj.type == "circleone" && currentObj.get('belongsTo') == objId) {
          _c2Top = currentObj.getTop();
          _c2Left = currentObj.getLeft();
          console.log("In circleone", currentObj)
          console.log("currentObj.left: ", currentObj.left)
          console.log("currentObj.top: ", currentObj.top)
          console.log("New currentObj.left: ", (currentObj.left -_curXm))
          console.log("New currentObj.top: ", (currentObj.top - _curYm))
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
    }

    if (objType == 'customlinearrow') {
        console.log("In customlinearrow")
        var objId = p.get('objId')
        var _curXm = (_curX - e.e.clientX);
        var _curYm = (_curY - e.e.clientY);
        console.log("Deltas: ", _curXm, " ", _curYm)
        for (var i = 0; i < canvas.getObjects().length; i++) {
          var currentObj = canvas.getObjects()[i];
          console.log("currentObj: ", currentObj)
          if (currentObj.type == "carrow" && currentObj.get('belongsTo') == objId) {
            console.log("In carrow", currentObj)
            console.log("currentObj.left: ", currentObj.left)
            console.log("currentObj.top: ", currentObj.top)
            console.log("New currentObj.left: ", (currentObj.left -_curXm))
            console.log("New currentObj.top: ", (currentObj.top - _curYm))
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

          if (currentObj.type == "conearrow" && currentObj.get('belongsTo') == objId) {
            console.log("In conearrow", currentObj)
            _c1Top = currentObj.getTop();
            _c1Left = currentObj.getLeft();
            console.log("New currentObj.left: ", (currentObj.left -_curXm))
            console.log("New currentObj.top: ", (currentObj.top - _curYm))
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
      }

      if (objType == 'customlinetwoarrow') {
          console.log("In customlinetwoarrow")
          var objId = p.get('objId')
          var _curXm = (_curX - e.e.clientX);
          var _curYm = (_curY - e.e.clientY);
          console.log("Deltas: ", _curXm, " ", _curYm)
          for (var i = 0; i < canvas.getObjects().length; i++) {
            var currentObj = canvas.getObjects()[i];
            console.log("currentObj: ", currentObj)
            if (currentObj.type == "carrowtwo" && currentObj.get('belongsTo') == objId) {
              console.log("In carrowtwo", currentObj)
              console.log("currentObj.left: ", currentObj.left)
              console.log("currentObj.top: ", currentObj.top)
              console.log("New currentObj.left: ", (currentObj.left -_curXm))
              console.log("New currentObj.top: ", (currentObj.top - _curYm))
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
              console.log("In conearrow", currentObj)
              _c1Top = currentObj.getTop();
              _c1Left = currentObj.getLeft();
              console.log("New currentObj.left: ", (currentObj.left -_curXm))
              console.log("New currentObj.top: ", (currentObj.top - _curYm))
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
        }
}

function setLineCirclePositionsBoundary(e) {
  var p = e.target;
  var objType = p.get('type');
      var objId = p.get('objId')
      var _curXm = (_curX - e.e.clientX);
      var _curYm = (_curY - e.e.clientY);
      if (p.type == "customline") {
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
          //setCircleLineAtBoundary(currentObj,p)

          _circleOne.line && _circleOne.line.set({
              'x1': _circleOne.left,
              'y1': _circleOne.top
            });

          _circleOne.line.setCoords();
          p && p.set({ 'x1': _circleOne.left, 'y1': _circleOne.top, 'x2':  _circleTwo.left, 'y2':  _circleTwo.top });

    }
    if (p.type == "customlinearrow") {
       _circleOne = p.conearrow;
       _circleTwo = p.carrow;

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
        //setCircleLineAtBoundary(currentObj,p)

        _circleOne.line && _circleOne.line.set({
            'x1': _circleOne.left,
            'y1': _circleOne.top
          });

        _circleOne.line.setCoords();
        p && p.set({ 'x1': _circleOne.left, 'y1': _circleOne.top, 'x2':  _circleTwo.left, 'y2':  _circleTwo.top });

      }

      if (p.type == "customlinetwoarrow") {
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

        }
      p.setCoords();
      _curX = e.e.clientX;
      _curY = e.e.clientY;

}
function objectBoundaryCheck(e){
  var boundaryHit = false;
  setLinePositions(e);
  log.info( "Entering  objectBoundaryCheck");
  $("#saveMessage").text('Changes Made, Save Pending...');
  e.target.setCoords();
  console.log("Object in boundary check: ", e.target)

  log.debug( "Checking to see if the end points of a line are being dragged ");
  if (e.target.type != "circlezero" && e.target.type != "circleone" && e.target.type != "conearrow" && e.target.type != "carrow"  && e.target.type != "carrowtwo") {
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
       if (e.target.type == "customline" || e.target.type == "customlinearrow" || e.target.type == "customlinetwoarrow") {
          setLineCirclePositionsBoundary(e);
          canvas.deactivateAll();
       }
       boundaryHit = true;
       e.target.setCoords();
       //canvas.renderAll();
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
        boundaryHit = true;
        if (e.target.type == "customline" || e.target.type == "customlinearrow" || e.target.type == "customlinetwoarrow") {
           setLineCirclePositionsBoundary(e);
           canvas.deactivateAll();
        }
        e.target.setCoords();

    }
  } else {
    boundaryInspectorCircle(e)
  }
  onSave();
  log.info( "Leaving objectBoundaryCheck");
};

function textChangedEvent(e) {
  $("#saveMessage").text('Changes Made, Save Pending...');
  log.debug('text:changed', e.target, e);
  onSave();
};

function objectDeletedEvent(e) {
  $("#saveMessage").text('Changes Made, Save Pending...');
  log.debug('lineDeletedEvent', e.target, e);
  onSave();
};

function boundaryInspectorCircle(e) {
   log.info( "Entering boundaryInspectorCircle");

   e.target.setCoords()
   var p = e.target;
   console.log("Type is: ", p.type)
   bounds = {tl: {x: 0, y:0}, br: {x: canvas.width , y: canvas.height } };
   if((p.type == 'circleone' || p.type == 'circlezero')) {
      if(p.top < bounds.tl.y || p.left < bounds.tl.x) {
         e.target.setTop(Math.max('0', e.target.top))
         e.target.left = Math.max('0', e.target.left)
      }  else if ((p.top + 2*p.radius) > bounds.br.y || (p.left + 2*p.radius) > bounds.br.x ) {
         e.target.setTop(Math.min(bounds.br.y, e.target.top + 2*p.radius ))
         e.target.left = Math.min(bounds.br.x, e.target.left + 2*p.radius)
      }
      if (p.type == "circleone")  {
         p.line && p.line.set({ 'x1': p.line.cone.left, 'y1': p.line.cone.top, 'x2': p.line.ctwo.left, 'y2': p.line.ctwo.top });
      } else {
         p.line && p.line.set({ 'x1': p.line.cone.left, 'y1': p.line.cone.top, 'x2': p.line.ctwo.left, 'y2': p.line.ctwo.top });
      }

      p.line.setCoords();
      e.target.setCoords();
      //canvas.renderAll();
   }
   if (p.type == 'conearrow') {
        if(p.top < bounds.tl.y || p.left < bounds.tl.x) {
           e.target.setTop(Math.max('0', e.target.top))
           e.target.left = Math.max('0', e.target.left)
        }  else if ((p.top + 2*p.radius) > bounds.br.y || (p.left + 2*p.radius) > bounds.br.x ) {
           e.target.setTop(Math.min(bounds.br.y, e.target.top + 2*p.radius ))
           e.target.left = Math.min(bounds.br.x, e.target.left + 2*p.radius)
        }
        console.log("conearrow: ", p.line)
        p.line && p.line.set({ 'x1': p.line.conearrow.left, 'y1': p.line.conearrow.top, 'x2': p.line.carrow.left, 'y2': p.line.carrow.top});
        p.line.setCoords();
        angle = calcArrowAngle(p.line.x1, p.line.y1, p.line.x2, p.line.y2);
        p.line.carrow.set('angle', angle + 90);
        e.target.setCoords();
   }

   if (p.type == 'carrow') {
        if(p.top < bounds.tl.y || p.left < bounds.tl.x) {
           e.target.setTop(Math.max('0', e.target.top))
           e.target.left = Math.max('0', e.target.left)
        }  else if ((p.top) > bounds.br.y || (p.left + p.width) > bounds.br.x ) {
           e.target.setTop(Math.min(bounds.br.y, e.target.top ))
           e.target.left = Math.min(bounds.br.x, e.target.left + p.width)
        }
        console.log("carrow: ", p)
        console.log("line: ", p.line)
        if (p.line.type == "customlinetwoarrow") {
           p.line && p.line.set({ 'x1': p.line.carrowtwo.left, 'y1': p.line.carrowtwo.top, 'x2': p.line.carrow.left, 'y2': p.line.carrow.top });
        } else {
           p.line && p.line.set({ 'x1': p.line.conearrow.left, 'y1': p.line.conearrow.top, 'x2': p.line.carrow.left, 'y2': p.line.carrow.top });
        }
        p.line.setCoords();
        angle = calcArrowAngle(p.line.x1, p.line.y1, p.line.x2, p.line.y2);
        p.set('angle', angle + 90);
        if (p.line.type == "customlinetwoarrow") {
          (p.line.carrowtwo).set({'angle': angle - 90});
        }
        e.target.setCoords();
   }

   if (p.type == 'carrowtwo') {
        if(p.top < bounds.tl.y || p.left < bounds.tl.x) {
           e.target.setTop(Math.max('0', e.target.top))
           e.target.left = Math.max('0', e.target.left)
        }  else if ((p.top) > bounds.br.y || (p.left + p.width) > bounds.br.x ) {
           e.target.setTop(Math.min(bounds.br.y, e.target.top))
           e.target.left = Math.min(bounds.br.x, e.target.left + p.width)
        }
        console.log("carrowtwo: ", p.line)
        p.line && p.line.set({'x1': p.left, 'y1': p.top, 'x2': p.line.carrow.left, 'y2': p.line.carrow.top});
        p.line.setCoords();
        angle = calcArrowAngle(p.line.x1, p.line.y1, p.line.x2, p.line.y2);
        p.set('angle', angle - 90);
        p.line.carrow.set('angle', angle+ 90);
        e.target.setCoords();
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
    if (e.preventDefault) {
       e.preventDefault(); // Necessary. Allows us to drop.
    }
    $('#contextMenu').remove();
    contextmenuon = false;
    activeObject = false;
    log.debug( "contextmenuon: ", contextmenuon);
    log.info( "Leaving mouseDown");
};

function objectSelected(e) {
   log.info( "Entering objectSelected");
   activeObject = true;
   activeObjectVal = e.target;
   console.log("objectSelected: ", activeObjectVal);
   var objType = e.target.get('type');
    if (objType == 'customline') {
      console.log("custom line selected");
      _curX = e.e.clientX;
      _curY = e.e.clientY;
      _c1Top = e.target.cone.getTop();
      _c1Left =  e.target.cone.getLeft();
      _c2Top = e.target.ctwo.getTop();
      _c2Left = e.target.ctwo.getLeft();
   }
   if (objType == 'customlinearrow') {
     console.log("custom line selected");
     _curX = e.e.clientX;
     _curY = e.e.clientY;
     _c1Top = e.target.conearrow.getTop();
     _c1Left =  e.target.conearrow.getLeft();
     _c2Top = e.target.carrow.getTop();
     _c2Left = e.target.carrow.getLeft();
  }
  if (objType == 'customlinetwoarrow') {
    console.log("custom line two selected");
    _curX = e.e.clientX;
    _curY = e.e.clientY;
    _c1Top = e.target.carrow.getTop();
    _c1Left =  e.target.carrow.getLeft();
    console.log("customlinetwoarrow: ", e.target );
    _c2Top = e.target.carrowtwo.get('top');
    _c2Left = e.target.carrowtwo.getLeft();
 }
   var activeGroupCollection = canvas.getActiveGroup();
   var circleZeroInCollection = new Array();
   var circleOneInCollection = new Array();
   var customLineInCollection = new Array();
   if (activeGroupCollection)
   {
     //iterate through objects to see if it contains lineSelected
     groupObjectsCircleOne = activeGroupCollection.getObjects('circleone');
     for ( i=0; i < groupObjectsCircleOne.length; i++) {
       circleOneInCollection.push(groupObjectsCircleOne[i].belongsTo)
     }
     groupObjectsCircleZero = activeGroupCollection.getObjects('circlezero');
     for ( i=0; i < groupObjectsCircleZero.length; i++) {
       circleZeroInCollection.push(groupObjectsCircleZero[i].belongsTo)
     }
     groupObjectsCustomLine = activeGroupCollection.getObjects('customline');
     for ( i=0; i < groupObjectsCustomLine.length; i++) {
       customLineInCollection.push(groupObjectsCustomLine[i].objId)
     }
     console.log("circleOneInCollection:", circleOneInCollection)
     console.log("circleZeroInCollection:", circleZeroInCollection)
     console.log("customLineInCollection:", customLineInCollection)

     allObjects = canvas.getObjects();
     for (i=0; i< circleZeroInCollection.length; i++) {
       //Is the belongsTo found in circleOneInCollection
       if ($.inArray(circleZeroInCollection[i], circleOneInCollection) == -1)
       {
             // not found
             j = 0;
             notFound = true
             while(j < allObjects.length && notFound) {
               if (allObjects[j].type == 'circleone') {
                 if (allObjects[j].belongsTo == circleZeroInCollection[i]) {
                     circleOneInCollection.push( circleZeroInCollection[i])
                     activeGroupCollection.addWithUpdate(allObjects[j])
                     console.log("Found circleone for circlezero", circleOneInCollection)
                     notFound = false
                 }
               }
               j = j+1;
             }

       }
       if ($.inArray(circleZeroInCollection[i], customLineInCollection) == -1)
       {
             // not found
             j = 0;
             notFound = true
             while(j < allObjects.length && notFound) {
               if (allObjects[j].type == 'customline') {
                 if (allObjects[j].objId == circleZeroInCollection[i]) {
                     customLineInCollection.push( circleZeroInCollection[i])
                     activeGroupCollection.addWithUpdate(allObjects[j])
                     notFound = false
                     console.log("Found customline for circlezero", customLineInCollection)
                 }
               }
               j = j+1;
             }

       }
     }

     for (i=0; i< circleOneInCollection.length; i++) {
       //Is the belongsTo found in circleOneInCollection
       if ($.inArray(circleOneInCollection[i], circleZeroInCollection) == -1)
       {
             // not found
             j = 0;
             notFound = true
             while(j < allObjects.length && notFound) {
               if (allObjects[j].type == 'circlezero') {
                 if (allObjects[j].belongsTo == circleOneInCollection[i]) {
                     circleZeroInCollection.push( circleOneInCollection[i])
                     activeGroupCollection.addWithUpdate(allObjects[j])
                     notFound = false
                     console.log("Found circlezero for circleone", circleZeroInCollection)
                 }
               }
               j = j+1;
             }

       }
       if ($.inArray(circleOneInCollection[i], customLineInCollection) == -1)
       {
             // not found
             j = 0;
             notFound = true
             while(j < allObjects.length && notFound) {
               if (allObjects[j].type == 'customline') {
                 if (allObjects[j].objId == circleOneInCollection[i]) {
                     customLineInCollection.push( circleOneInCollection[i])
                     activeGroupCollection.addWithUpdate(allObjects[j])
                     notFound = false
                     console.log("Found customline for circleone", customLineInCollection)
                 }
               }
               j = j+1;
             }

       }
     }

     for (i=0; i< customLineInCollection.length; i++) {
       //Is the belongsTo found in circleOneInCollection
       if ($.inArray(customLineInCollection[i], circleZeroInCollection) == -1)
       {
             // not found
             j = 0;
             notFound = true
             while(j < allObjects.length && notFound) {
               if (allObjects[j].type == 'circlezero') {
                 if (allObjects[j].belongsTo == customLineInCollection[i]) {
                     circleZeroInCollection.push( customLineInCollection[i])
                     activeGroupCollection.addWithUpdate(allObjects[j])
                     notFound = false
                     console.log("Found circlezero for customline", circleZeroInCollection)
                 }
               }
               j = j+1;
             }

       }
       if ($.inArray(customLineInCollection[i], circleOneInCollection) == -1)
       {
             // not found
             j = 0;
             notFound = true
             while(j < allObjects.length && notFound) {
               if (allObjects[j].type == 'circleone') {
                 if (allObjects[j].belongsTo == customLineInCollection[i]) {
                     circleOneInCollection.push( customLineInCollection[i])
                     activeGroupCollection.addWithUpdate(allObjects[j])
                     notFound = false
                      console.log("Found circleone for customline", circleOneInCollection)
                 }
               }
               j = j+1;
             }

       }
     }
     console.log("circleOneInCollection:", circleOneInCollection)
     console.log("circleZeroInCollection:", circleZeroInCollection)
     console.log("customLineInCollection:", customLineInCollection)
     canvas.renderAll();

   }
   log.info( "Leaving objectSelected");
};

function mouseOut(e){
   log.info( "Entering mouseOut");
   contextmenuon = true;
   log.trace("Viewing target in mouseOut")
   log.trace(e.target)
   log.debug("Rendering All")
   canvas.renderAll();
   log.debug("Done Rendering All")
   log.info( "Leaving mouseOut");
};

function mouseOver(e) {
  log.info( "Entering mouseOver");
  contextmenuon = false;
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

  if (object.type == "circleone") {
    log.debug( "Processing circleone");
    object.hasBorders = object.hasControls = false;
  }

  if (object.type == "circlezero") {
    log.debug( "Processing circleone");
    object.hasBorders = object.hasControls = false;
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

  if (object.type == "customline") {
    log.debug( "Processing customline");
    object.hasControls = false;
    object.on("mousedown", function(data, index) { lineDown(data,index); });
  }
  if (object.type == "i-text") {
    log.debug( "Processing i-text");
    object.on("mousedown", function(data, index) { textDown(data,index)   });
  }
  log.info( "Leaving postProcessLoading");

};

function checkBackgroundFileExists( link ) {
  log.info("Entering checkBackgroundFileExists")
  log.debug(link);
  $.ajax({
    url:link,
    type:'HEAD',
    error: function()
    {
        log.debug("In Error Function checkBackgroundFileExists");
        log.debug("Background File Not Found")
        return false;
    },
    success: function()
    {
        log.debug("In success Function checkBackgroundFileExists")
        log.debug("Background File Exists")
        return true;
    }
  });
  log.info("Leaving checkBackgroundFileExists")
}

var onSave  =  debounce(function() {
    log.info( "Entering onSave");
    modified = true;
    // Remove circle0 and circle1 from image
    //$(".spinner").show();
    $(".saveMessage").text('Save In Progress...');

    objects = canvas.getObjects();

    var len = objects.length;
    log.debug( "Number of objects to process: ", len);
    console.log( "Number of objects to process: ", len);
    canvas.renderAll();
    var token = $('meta[name="csrf-token"]').attr('content');

    canvas.backgroundColor = "";

    var json_data = { company_id: company_id,
                   user_id:  user_id,
                   id: drawing_id,
                   authenticity_token: token,
                   png: "",
                   drawing: canvas  }
    log.trace(json_data)
    //console.log(json_data)
    var json_url = "/companies/" + company_id + "/users/" + user_id + "/drawings/" + drawing_id +".json"
    $.ajax({
            url: json_url, // Route to the Script Controller method
           type: "patch",
       dataType: "json",
    contentType: "application/json",
           data: JSON.stringify(json_data), // This goes to Controller in params hash, i.e. params[:file_name]
        timeout: 3000, // sets timeout to 3 seconds
       complete: function() {
                 },
        success: function(data, textStatus, xhr) {
                   textMsg = JSON.parse(data[0]);
                   console.log("Text Msg: ", textMsg)
                   $("#saveMessage").text(textMsg[0]);
                   loadVersionsIntoPanel(data[1])
                 },
          error: function(data, textStatus) {
                   msg = "Error: " + textStatus;
                   $("#saveMessage").text(msg);
                 }
      });
     //canvas.renderAll.bind(canvas);
     log.info( "Leaving onSave");
}, 3000);

function loadCanvasDrawing(data_drawing) {
  if (data_drawing != "") {
      log.debug("data_drawing not blank")
      canvas.loadFromJSON(data_drawing, function () {
         //first render
         canvas.renderAll.bind(canvas);
         var objs = canvas.getObjects().map(function(o) {
           return o.set('active', false);
         });
         log.debug("Entering loop for objects")
         log.debug("Loop size: ", objs.length)
         var foundCircle = 0;
         var itemId = 0;
         for(i = 0; i < objs.length; i++ ) {
            log.debug("Objs Type: ", objs[i].type)
            objs[i].id = itemId
            if (objs[i].type == "customline")  {
              objs[i].hasControls = false;
              console.log("customline: ", objs[i])
              console.log("Item Id of line set to: ", objs[i].getObjId())
              canvas.forEachObject(function(circleProspect){
                log.debug("Object Type: ", circleProspect.type)
                if (circleProspect.type == "circlezero" || circleProspect.type == "circleone") {
                   log.debug("circleProspect.belongsTo: ", circleProspect.belongsTo)
                   log.debug("objs[1].objId: ", objs[i].objId)
                }
                if (circleProspect.type == "circlezero" && circleProspect.belongsTo == objs[i].objId) {
                   circleProspect.hasBorders = circleProspect.hasControls = false;
                   circleProspect.line = objs[i]
                   circleProspect.belongsTo = itemId;
                   objs[i].cone = circleProspect
                   circleProspect.set('hoverCursor','crosshair')
                   console.log("found circlezero")
                   foundCircle = foundCircle + 1;

                }
                if (circleProspect.type == "circleone" && circleProspect.belongsTo == objs[i].objId) {
                  circleProspect.hasBorders = circleProspect.hasControls = false;
                  circleProspect.line = objs[i]
                  circleProspect.belongsTo = itemId;
                  objs[i].ctwo = circleProspect
                  circleProspect.set('hoverCursor','crosshair')
                  console.log("found circleone")
                  foundCircle = foundCircle + 1;
                }
                if (foundCircle == 2) {
                  console.log("objId: ", objs[i].get('objId'))
                  objs[i].setObjId(itemId)
                  itemId = itemId + 1;
                  objs[i].cone.id = itemId;
                  itemId = itemId + 1;
                  objs[i].ctwo.id = itemId;
                  foundCircle = 0;
                }
              });
              objs[i].on("mousedown", function(data, index) { lineDown(data,index); });
            }

            if (objs[i].type == "customlinearrow")  {
              objs[i].hasControls = false;
              console.log("customline: ", objs[i])
              console.log("Item Id of line set to: ", objs[i].getObjId())
              canvas.forEachObject(function(circleProspect){
                log.debug("Object Type: ", circleProspect.type)
                if (circleProspect.type == "carrow" || circleProspect.type == "conearrow") {
                   log.debug("circleProspect.belongsTo: ", circleProspect.belongsTo)
                   log.debug("objs[1].objId: ", objs[i].objId)
                }
                if (circleProspect.type == "conearrow" && circleProspect.belongsTo == objs[i].objId) {
                   circleProspect.hasBorders = circleProspect.hasControls = false;
                   circleProspect.line = objs[i]
                   circleProspect.belongsTo = itemId;
                   objs[i].conearrow = circleProspect
                   circleProspect.set('hoverCursor','crosshair')
                   console.log("found conearrow")
                   foundCircle = foundCircle + 1;

                }
                if (circleProspect.type == "carrow" && circleProspect.belongsTo == objs[i].objId) {
                  circleProspect.hasBorders = circleProspect.hasControls = false;
                  circleProspect.line = objs[i]
                  circleProspect.belongsTo = itemId;
                  objs[i].carrow = circleProspect
                  circleProspect.set('hoverCursor','crosshair')
                  console.log("found carrow")
                  foundCircle = foundCircle + 1;
                }
                if (foundCircle == 2) {
                  console.log("objId: ", objs[i].get('objId'))
                  objs[i].setObjId(itemId)
                  itemId = itemId + 1;
                  objs[i].conearrow.id = itemId;
                  itemId = itemId + 1;
                  objs[i].carrow.id = itemId;
                  foundCircle = 0;
                }
              });

              objs[i].on("mousedown", function(data, index) { lineArrowDown(data,index); });
            }

            if (objs[i].type == "customlinetwoarrow")  {
              objs[i].hasControls = false;
              console.log("customline: ", objs[i])
              console.log("Item Id of line set to: ", objs[i].getObjId())
              canvas.forEachObject(function(circleProspect){
                log.debug("Object Type: ", circleProspect.type)
                if (circleProspect.type == "carrow" || circleProspect.type == "carrowtwo") {
                   log.debug("circleProspect.belongsTo: ", circleProspect.belongsTo)
                   log.debug("objs[1].objId: ", objs[i].objId)
                }
                if (circleProspect.type == "carrowtwo" && circleProspect.belongsTo == objs[i].objId) {
                   circleProspect.hasBorders = circleProspect.hasControls = false;
                   circleProspect.line = objs[i]
                   circleProspect.belongsTo = itemId;
                   objs[i].carrowtwo = circleProspect
                   circleProspect.set('hoverCursor','crosshair')
                   console.log("found carrowtwo")
                   foundCircle = foundCircle + 1;

                }
                if (circleProspect.type == "carrow" && circleProspect.belongsTo == objs[i].objId) {
                  circleProspect.hasBorders = circleProspect.hasControls = false;
                  circleProspect.line = objs[i]
                  circleProspect.belongsTo = itemId;
                  objs[i].carrow = circleProspect
                  circleProspect.set('hoverCursor','crosshair')
                  console.log("found carrow")
                  foundCircle = foundCircle + 1;
                }
                if (foundCircle == 2) {
                  console.log("objId: ", objs[i].get('objId'))
                  objs[i].setObjId(itemId)
                  itemId = itemId + 1;
                  objs[i].carrowtwo.id = itemId;
                  itemId = itemId + 1;
                  objs[i].carrow.id = itemId;
                  foundCircle = 0;
                }
              });

              objs[i].on("mousedown", function(data, index) { lineArrowTwoDown(data,index); });
            }

            itemId = itemId + 1;
         }
         canvas.renderAll();
         backgroundImageVal = "";
         if (canvas.hasOwnProperty('backgroundImage')) {
            if ((canvas.backgroundImage).hasOwnProperty('src')) {
                backgroundImageVal = canvas.backgroundImage.src;
            }
         }
         log.debug("BackgroundImage Loc: ", backgroundImageVal)
         backgroundExists(backgroundImageVal);
      },
      postProcessLoading);

  }
}

function loadVersionsIntoPanel(timestamps) {
   versions = JSON.parse(timestamps)
   $("tbody#versionslisttab tr").remove()
   var arrayLength = versions.length;

   for (var i = 0; i < arrayLength; i++) {
      vararray = JSON.parse(versions[i])
      log.debug("Timestamp: ", vararray[0], ":", vararray[1])
      var link = '/companies/' + company_id + '/users/' + user_id + '/drawings/' + drawing_id + '/changeversion?version=' + vararray[0];
      tr = '<tr> <td> <a href="#" onclick="loadversion(\'' + link + '\'); return false;">' + vararray[1] + '</a></td> </tr>'
      $('#versionslisttab').append(tr);
   }
}

$(function() {
   $('.directUpload').find("input:file").each(function(i, elem) {
     log.debug("URL directUpload")
     log.debug(form)
     var fileInput    = $(elem);
     log.debug("fileInput")
     log.trace(fileInput)
     var form         = $(fileInput.parents('form:first'));
     var URL_dest = form.data('url') + "/" + form.data('form-data').key
     var submitButton = $('#submitButton');
     progressBar.css('display','inline');
     fileInput.fileupload({
     add: function(e, data) {
             var uploadErrors = [];
             var acceptFileTypes = /^image\/(gif|jpe?g|png)$/i;
             if(data.originalFiles[0]['type'].length && !acceptFileTypes.test(data.originalFiles[0]['type'])) {
                 uploadErrors.push('Not an accepted file type');
             }
             if(data.originalFiles[0]['size'].length && data.originalFiles[0]['size'] > 1000000) {
                 uploadErrors.push('Filesize is too big');
             }
             if(uploadErrors.length > 0) {
                 alert(uploadErrors.join("\n"));
             } else {
                 data.submit();
             }
     },
     fileInput:       fileInput,
     url:             form.data('url'),
     type:            'POST',
     autoUpload:       true,
     formData:         form.data('form-data'),
     paramName:        'file', // S3 does not like nested name fields i.e. name="user[avatar_url]"
     dataType:         'XML',  // S3 returns XML if success_action_status is set to 201
     replaceFileInput: false,
     progressall: function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        //progressBar.css('width', progress + '%')
        $('#progress').show();
        progressBar.text(progress + '%');
        progressBar.attr('value',progress);
        console.log("Progress: ", progress);
     },
     start: function (e) {
        //submitButton.attr('disabled', 'disabled');
        progressBar.addClass('progress-success');
        log.trace(form);
     },
     done: function(e, data) {
        $("#saveMessage").text('Changes Made, Save Pending...');
        submitButton.prop('disabled', false);
        //progressBar.text("Uploading done");
        $('#upload_button').removeAttr('disabled');
        // extract key and generate URL from response
        var key   = $(data.jqXHR.responseXML).find("Key").text();
        var url   = '//' + form.data('host') + '/' + key;
        log.debug("done:key,url")
        log.debug(key)
        log.debug(url)
        // create hidden field
        var input = $("<input />", { type:'hidden', name: fileInput.attr('name'), value: url })
        form.append(input);
        imageURL = "https:" + url;
        log.debug("imageURL");
        log.debug(imageURL);
        canvas.setBackgroundImage(imageURL,
             canvas.renderAll.bind(canvas), {
                backgroundImageOpacity: 0.5,
                backgroundImageStretch: false,
                scaleX:1,
                scaleY:1,
                top: center.top,
                left: center.left,
                originX: 'center',
                originY: 'center',
                crossOrigin: 'anonymous'
             }
        );
        $('#progress').hide();
        //submitButton.removeAttr('disabled');
        //resetFormElement($('#backgroundfile'));
        //$("#backgroundfile").val("");
        $('#backgroundSection').modal('hide');
        backgroundButton(true);
        onSave();
      },
      fail: function(e, data) {
        submitButton.prop('disabled', false);
        progressBar.removeClass('progress-success').addClass('progress-danger');
      }
    });
  });
});

function resetFormElement(e) {
  e.wrap('<form>').closest('form').get(0).reset();
  e.unwrap();

  // Prevent form submission
  e.stopPropagation();
  e.preventDefault();
}

function loadversion(link) {
   $(".spinner").show();
   link = link + '&modified=' + modified;
   $.ajax({
       url: link,
       data: {
          format: 'json'
       },
       error: function(data) {
          console.log(data)
          console.log("An error has occurred");
          $(".spinner").fadeOut( 400 );
       },
       success: function(data) {
          log.trace("Data from AJAX: ", data)
          log.trace("Last Edit: ", JSON.parse(data[0]))
          loadVersionsIntoPanel(data[1])
          loadCanvasDrawing(data[2])
          modified = false;
          $(".spinner").fadeOut( 400 );
       },
       type: 'GET'
     });
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

 function makeLineArrow(coords, id) {
    log.info( "Entering makeLine");
    log.debug("Coords are: ", coords);
    line =  new fabric.Customlinearrow(coords, {
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

  function makeLineTwoArrow(coords, id) {
     log.info( "Entering makeLine");
     log.debug("Coords are: ", coords);
     line =  new fabric.Customlinetwoarrow(coords, {
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

 function makeArrowShape(coords, id) {
   arrow = new fabric.Arrowone({
            left: line.get(coords[0]),
            top: line.get(coords[1]),
            originX: 'center',
            originY: 'center',
            hasBorders: false,
            hasControls: false,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            pointType: 'arrow_start',
            angle: -225,
            width: 20,
            height: 20,
            fill: '#000'
        });
   return arrow;
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
      console.log("activateColorPicker: ", e)
      activeObjectValCP = activeObjectVal;
      document.getElementById('myColor').color.showPicker();
      log.info( "Leaving activateColorPicker");
 }

 function colorPickerChange(newLineColor) {
      log.info( "Entering colorPickerChange");
      log.debug( "newLineColor: ", newLineColor);
      if (activeObjectValCP) {
        log.trace( "activeObjectVal: ", activeObjectValCP);
        if (activeObjectValCP.type) {
          log.trace( "activeObjectVal.type: ", activeObjectValCP.type);
          if (activeObjectValCP.type == "customline") {
            log.debug( "colorPickerChange on line type");
            activeObjectValCP.fill = newLineColor;
            activeObjectValCP.stroke = newLineColor;
          }
          if (activeObjectValCP.type == "customlinearrow") {
            log.debug( "colorPickerChange on line type");
            activeObjectValCP.fill = newLineColor;
            activeObjectValCP.stroke = newLineColor;
          }
          if (activeObjectValCP.type == "customlinetwoarrow") {
            log.debug( "colorPickerChange on line type");
            activeObjectValCP.fill = newLineColor;
            activeObjectValCP.stroke = newLineColor;
          }
          if (activeObjectValCP.type == "circle") {
            log.debug( "colorPickerChange on circle type");
            activeObjectValCP.stroke = newLineColor;
          }
          if (activeObjectValCP.type == "ellipse") {
            log.debug( "colorPickerChange on ellipse type");
            activeObjectValCP.stroke = newLineColor;
          }
          if (activeObjectValCP.type == "rect") {
            log.debug( "colorPickerChange on rect type");
            activeObjectValCP.stroke = newLineColor;
          }
          if (activeObjectValCP.type == "i-text") {
            log.debug( "colorPickerChange on i-text type");
            activeObjectValCP.stroke = newLineColor;
            //activeObjectVal.setColor(newLineColor);
          }
        }
      }
      canvas.renderAll();
      log.info( "Leaving colorPickerChange");
 }

 function makeCircle(line) {
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

 function makeCircleArrow(line) {
     log.info( "Entering makeCircleArrow");
     var c1 = new fabric.Conearrow({
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
              width: 20,
              height: 20,
              fill: '#000'
          });
     c2.setBelongsTo(line.objId);
     c1.hasBorders = c1.hasControls = false;
     c2.hasBorders = c2.hasControls = false;

     c1.line = line;
     c2.line = line;
     line.conearrow = c1;
     line.carrow = c2;
     var c = new Array(c1, c2);
     log.info( "Leaving makeCircle");
     return c;
 }

 function makeArrowTwo(line) {
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
              width: 20,
              height: 20,
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
              width: 20,
              height: 20,
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
   $('#contextMenu').remove();
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
   $('#contextMenu').remove();
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
   $('#contextMenu').remove();
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
   $('#contextMenu').remove();
   contextmenuon = false;
   activeObject = false;
   log.info( "Leaving bringToFront");
}


function lineDown(data,index) {
   log.info( "Entering lineDown");
   console.log( "Entering lineDown");
   console.log("data: ", data)

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
                                             if (activeObjectVal.type) {
                                               if (activeObjectVal.type == "customline") {
                                                 canvas.remove(activeObjectVal.cone)
                                                 canvas.remove(activeObjectVal.ctwo)
                                                 canvas.remove(activeObjectVal);
                                               } else if(activeObjectVal.hasOwnProperty('belongsTo')) {
                                                 console.log("removing belongTo object")
                                                 var objs = canvas.getObjects()
                                                 // find line with belongsTo value
                                                 var searchVal = activeObjectVal.get('belongsTo')
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
                                                   canvas.remove(objs[i].cone)
                                                   canvas.remove(objs[i].ctwo)
                                                   canvas.remove(objs[i]);
                                                 }
                                                 canvas.renderAll()
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
        };
      }
      document.addEventListener('contextmenu', handler, false);
   }
   log.info( "Leaving lineDown");
}

function lineArrowDown(data,index) {
   log.info( "Entering lineDown");
   console.log( "Entering lineDown");
   console.log("data: ", data)

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
            var items = ["Delete Line", "Change Color", "Send Backward", "Send To Back", "Bring Forward", "Bring To Front"];
            menus(items, e);
            $('a:contains("Delete")').click(  function() {
                                             if (activeObjectVal.type) {
                                               if (activeObjectVal.type == "customlinearrow") {
                                                 canvas.remove(activeObjectVal.conearrow)
                                                 canvas.remove(activeObjectVal.carrow)
                                                 canvas.remove(activeObjectVal);
                                               } else if(activeObjectVal.hasOwnProperty('belongsTo')) {
                                                 console.log("removing belongTo object")
                                                 var objs = canvas.getObjects()
                                                 // find line with belongsTo value
                                                 var searchVal = activeObjectVal.get('belongsTo')
                                                 var found = false;
                                                 var i = 0;
                                                 while (!found && i < objs.length) {
                                                   if (objs[i].type == "customlinearrow") {
                                                     if (objs[i].objId == searchVal) {
                                                       found= true;
                                                     }
                                                   }
                                                   i = i + 1;
                                                 }
                                                 if (found) {
                                                   i = i -1;
                                                   canvas.remove(objs[i].conearrow)
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
           $('a:contains("Change Color")').click(function() {activateColorPicker(e);
                                                             $('#contextMenu').remove();
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

function lineArrowTwoDown(data,index) {
   log.info( "Entering lineDown");
   console.log( "Entering lineDown");
   console.log("data: ", data)

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
            var items = ["Delete Line", "Change Color", "Send Backward", "Send To Back", "Bring Forward", "Bring To Front"];
            menus(items, e);
            $('a:contains("Delete")').click(  function() {
                                             console.log("In Delete customlinetwoarrow")
                                             if (activeObjectVal.type) {
                                               console.log("Object Found: ", activeObjectVal.type)
                                               if (activeObjectVal.type == "customlinetwoarrow") {
                                                 canvas.remove(activeObjectVal.carrowtwo)
                                                 canvas.remove(activeObjectVal.carrow)
                                                 canvas.remove(activeObjectVal);
                                               } else if(activeObjectVal.hasOwnProperty('belongsTo')) {
                                                 console.log("removing belongTo object")
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
           $('a:contains("Change Color")').click(function() {activateColorPicker(e);
                                                             $('#contextMenu').remove();
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
}

function circleDown(data,index) {
   console.log("Data: ", data)
   log.info( "Entering circleDown");
   if (handler != "") {
      document.removeEventListener('contextmenu', handler);
   }
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
}

function rectangleDown(data,index) {
   log.info( "Entering rectangleDown");
   if (handler != "") {
      document.removeEventListener('contextmenu', handler);
   }
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
   if (data.e.which == 3) {
      handler = function(e) {
         if (contextmenuon == false &&  activeObject == true) {
            e.preventDefault();
            var items = ["Delete Rectangle", "Change Color", "Send Backward", "Send To Back", "Bring Forward", "Bring To Front"];
            menus(items, e);
            $('a:contains("Delete")').click(  function() {log.debug("rectangleDown: In Delete");
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
   log.info( "Leaving rectangleDown");
}

function textDown(data,index) {
   log.info( "Entering textDown");
   if (handler != "") {
      document.removeEventListener('contextmenu', handler);
   }
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
   if (data.e.which == 3) {
      handler = function(e) {
         if (contextmenuon == false &&  activeObject == true) {
            e.preventDefault();
            var items = ["Delete Text", "Change Color", "Send Backward", "Send To Back", "Bring Forward", "Bring To Front"];
            menus(items, e);
            $('a:contains("Delete")').click(  function() {log.debug("textDown: In Delete");
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
   }
   document.addEventListener('contextmenu', handler, false);
   log.info( "Leaving textDown");
}

function imageDown(data,index) {
   log.info( "Entering imageDown");
   console.log("data", data)
   if (handler != "") {
      document.removeEventListener('contextmenu', handler);
   }
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
   if (data.e.which == 3) {
      handler = function(e) {
         if (contextmenuon == false &&  activeObject == true) {
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
                                                   configuratorProduct2(productId, companyId, searchId);
                                                   $('#contextMenu').remove();
                                                   contextmenuon = false;
                                                   activeObject = true;
                                                });
            $('a:contains("Delete")').click(  function() {log.debug("imageDown: In Delete");
                                               log.trace(activeObjectVal);
                                               canvas.remove(activeObjectVal);
                                               $('#contextMenu').remove();
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
   $("#saveMessage").text('Changes Made, Save Pending...');
   var img = document.querySelector('#images img.img_dragging');
   img.height = img.height;
   img.width = img.width;
   log.trace("Draggable Stage:", img);
   var draggy = "";
   if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
   }

   if (!(img == null)) {
      var imgsrc_val = img.getAttribute("img_val");
      log.debug("imgsrc_val: ", imgsrc_val)
      if (imgsrc_val == "line.png")
      {
         log.debug("In line.png section");
         objectName = "customline";
         var xpos1 = e.layerX;
         var ypos1 = e.layerY;
         var xpos2 = xpos1 + 25;
         var ypos2 = ypos1 + 25;
         objId = id;
         var line = makeLine([ xpos1, ypos1, xpos2, ypos2 ], id)
         line.hasControls = false
         itemId = itemId + 1;
         line.id = itemId
         line.objId = itemId;
         canvas.add(line)
         c[id] = makeCircle(line);
         line.cone = c[id][0];
         line.ctwo = c[id][1];
         console.log("Line coords: ",line.get('x1') ,line.get('y1') ,line.get('x2') , line.get('y2'))
         canvas.add(c[id][0],c[id][1]);
         canvas.renderAll();
         line.on("mousedown", function(data, index) { lineDown(data,index); });
      } else if (imgsrc_val == "line_arrow_icon.png") {
         log.debug("In line.png section");
         objectName = "customlinearrow";
         var xpos1 = e.layerX;
         var ypos1 = e.layerY;
         var xpos2 = xpos1 + 25;
         var ypos2 = ypos1 + 25;
         objId = id;
         var line = makeLineArrow([ xpos1, ypos1, xpos2, ypos2 ], id)
         line.hasControls = false
         itemId = itemId + 1;
         line.id = itemId
         line.objId = itemId;
         canvas.add(line)
         c[id] = makeCircleArrow(line);
         line.conearrow = c[id][0];
         line.carrow= c[id][1];
         console.log("Line coords: ",line.get('x1') ,line.get('y1') ,line.get('x2') , line.get('y2'))
         console.log("circle and arrow: ", c[id][0], ":", c[id][1])
         canvas.add(c[id][0],c[id][1]);
         canvas.renderAll();
         line.on("mousedown", function(data, index) { lineArrowDown(data,index); });
      } else if (imgsrc_val == "line_arrow_two_icon.png") {
        log.debug("In line.png section");
        objectName = "customlinetwoarrow";
        var xpos1 = e.layerX;
        var ypos1 = e.layerY;
        var xpos2 = xpos1 + 25;
        var ypos2 = ypos1 + 25;
        objId = id;
        var line = makeLineTwoArrow([ xpos1, ypos1, xpos2, ypos2 ], id)
        line.hasControls = false
        itemId = itemId + 1;
        line.id = itemId
        line.objId = itemId;
        canvas.add(line)
        c[id] = makeArrowTwo(line);
        line.carrowtwo = c[id][0];
        line.carrow    = c[id][1];
        console.log("Line coords: ",line.get('x1') ,line.get('y1') ,line.get('x2') , line.get('y2'))
        console.log("circle and arrow: ", c[id][0], ":", c[id][1])
        canvas.add(c[id][0],c[id][1]);
        canvas.renderAll();
        line.on("mousedown", function(data, index) { lineArrowTwoDown(data,index); });
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
         textbox.on("mousedown", function(data, index) { textDown(data,index); });
      } else {
         log.debug("In drag down else category")
         var newImage = new fabric.CustomImage(img, {
            width: img.width,
            height: img.height,
            left: e.layerX,
            top: e.layerY,
            config: 'undefined',
            origloc: 'undefined'
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
         if(img.hasAttribute('data-loc')) {
           log.debug("Has data-loc")
           newImage.origloc = img.getAttribute('data-loc')
           log.debug("data-loc: ", newImage.origloc);
         } else {
           newImage.origloc = false;
         }
         newImage.id = itemId
         newImage.setSrc("/assets/" + newImage.origloc,
                  function(obj) {
                    log.debug("Object");
                    log.debug("In callback for setSrc function");
                    log.trace(obj);
                  },
                  {
                    'height':img.height,
                    'width':img.width
                  });
         newImage.setCoords();
         log.debug("--- newImage.src ------");
         log.debug("src:",newImage.getSrc());
         log.debug("Height",newImage.getHeight());
         log.debug("Width", newImage.getWidth());
         itemId = itemId + 1;
         newImage.on("mousedown", function(data, index) { imageDown(data,index); });
         canvas.add(newImage);
         canvas.renderAll();

      }
      this.classList.remove('over');
      onSave();
      return false;
   }
   onSave();
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
           return false; //in case the icons are stacked only take action on one.
        }
     }
   });
   log.info( "Leaving contextMenu");
   return false; //stops the event propigation
}

function menus(items, event) {
   log.info( "Entering menus");
   var $contextMenu = "";
   if (contextmenuon == false) {
      var menucontainer = document.createElement('div');
      menucontainer.id = 'contextMenu';
      //menucontainer.className = "dropdown clearfix";
      //var html = "<ul class='dropdown-menu' role='menu' aria-labelledby='dropdownMenu' style='display:block;position:static;margin-bottom:5px;'>";
      var html = "<ul class='dropdown-menu' role='menu' style='display:block;position:static;' >";
      for (index=0; index < items.length; index++) {
         html += "<li> <a tabindex=''-1'>" + items[index] + "</a> </li>";
      }
      html += "</ul>" ;
      menucontainer.innerHTML = html;
      $('body').append(menucontainer);
      $contextMenu = $("#contextMenu");
      $contextMenu.css({
         display: "block",
         left: event.pageX,
         top: event.pageY
       });

   } else {
     log.info("Menu Not Displayed contextmenu is true");
   }
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

function loadConfigScreen( data, selectChoices, splitVals ) {
   jsondata = data;
   log.info( "Entering loadConfigScreen");
   log.trace("jsondata: ", jsondata)
   if (jsondata.error == "Data Not Found") {
      document.getElementById('data').innerHTML += '<br>' + jsondata.error;
   }
   else {
     jsondataprice = JSON.parse(jsondata.price);
     //document.getElementById('data').innerHTML += '<br>' + jsondata['name'];
     var prodName = document.createElement('div')
     prodName.className = 'form-group form-group-sm';
     var prodName2 = document.createElement('div');
     prodName2.className = 'control-label col-sm-3';
     prodName2.innerHTML += jsondata['name'];
     prodName.appendChild(prodName2);
     document.getElementById('data').appendChild(prodName);
     for (i=0; i< jsondataprice.product.options.length; i++) {
        var newNode = document.createElement('div');
        newNode.className = 'form-group form-group-sm';
        var newNode2 = document.createElement('label');
        newNode2.className = 'control-label col-sm-3';
        newNode2.innerHTML += jsondataprice.product.options[i].opname
        newNode.appendChild(newNode2)
        var newNode3 = document.createElement('div');
        newNode3.className = 'control-label col-sm-9';
        var selectHTML = "";
        var selectid = 'select' + i
        selectHTML='<select class="form-control input-sm" id="' + selectid + '">';
        for (j=0; j< jsondataprice.product.options[i].selections.length; j++) {
           selectHTML += '<option value=\'{"code":"'
           selectHTML += jsondataprice.product.options[i].selections[j].code
           selectHTML += '","price":"'
           selectHTML += jsondataprice.product.options[i].selections[j].price
           selectHTML +='"}\''
           if (selectChoices) {
             if (jsondataprice.product.options[i].selections[j].code == splitVals[i+1]) {
                selectHTML +=' selected="selected" '
             }
           }
           selectHTML += '>'
           selectHTML +=jsondataprice.product.options[i].selections[j].description
           selectHTML +='</option>'
        }
        selectHTML += "</select>";
        newNode3.innerHTML += selectHTML
        newNode.appendChild(newNode3)
        document.getElementById('data').appendChild(newNode);
   }
   // Configuration
   var newNode = document.createElement('div');
   newNode.className = 'form-group form-group-sm';
   var newNode2 = document.createElement('label');
   newNode2.className = 'control-label col-sm-3';
   newNode2.innerHTML += "Configuration: "
   newNode.appendChild(newNode2)
   var newNodeDiv = document.createElement('div');
   newNodeDiv.className = "col-sm-9 input-sm";
   var newNode3 = document.createElement('p');
   newNode3.className = 'pull-left';
   newNode3.id = "prodconfig"
   newNodeDiv.appendChild(newNode3);
   newNode.appendChild(newNodeDiv);
   document.getElementById('data').appendChild(newNode);

   // List Price
   var newPriceNode = document.createElement('div');
   newPriceNode.className = 'form-group form-group-sm';
   var newNode2 = document.createElement('label');
   newNode2.className = 'control-label col-sm-3';
   newNode2.innerHTML += "List Price: "
   newPriceNode.appendChild(newNode2)
   var newNodeDiv = document.createElement('div');
   newNodeDiv.className = "col-sm-9 input-sm";
   var newNode3 = document.createElement('p');
   newNode3.className = 'pull-left';
   newNode3.id = "price"
   newNodeDiv.appendChild(newNode3);
   newPriceNode.appendChild(newNodeDiv);

   document.getElementById('data').appendChild(newPriceNode);
   // done configuration
   configString(jsondata,searchId)
   log.debug("Adding Listeners: Before For Loop")
   for (i=0; i< jsondataprice.product.options.length; i++) {
      var selectid = 'select' + i
      document.getElementById(selectid).onchange = function() {
            var index = this.selectedIndex;
            var inputText = this.children[index].innerHTML.trim();
            log.trace(inputText);
            configString(jsondata,searchId)
      }
    }
   }
   $('#gifspinner').fadeOut( 400 );
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
                   log.trace("configuratorProduct2: In Ajax Success")
                   loadConfigScreen( data, selectChoices, splitVals );
                   log.trace(data)
                   //configString(data,searchId);
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
  log.trace ("configString:jasontext", jsontext);
  jsondataprice = JSON.parse(jsontext.price);
  log.trace("configString:jsondataprice", jsondataprice);
  var configurationString = jsondataprice.product.name;
  var priceString = "List Price: $";
  var listPrice = jsondataprice.product.basePrice;
  for (i=0; i< jsondataprice.product.options.length; i++) {
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
         //console.log(canvas.item(searchId))
         //canvas.item(searchId).config = document.getElementById('prodconfig').innerHTML
         canvas.item(searchId).setConfig(document.getElementById('prodconfig').innerHTML)
         canvas.item(searchId).price = document.getElementById('price').innerHTML
         canvas.renderAll();
         log.info( "Leaving SetConfig");
     //}
     //window.close();
 }


 var Inspect = {
     TYPE_FUNCTION: 'function',
     // Returns an array of (the names of) all methods
     methods: function(obj) {
         var testObj = obj || self;
         var methods = [];
         for (prop in testObj) {
             if (typeof testObj[prop] == Inspect.TYPE_FUNCTION && typeof Inspect[prop] != Inspect.TYPE_FUNCTION) {
                 methods.push(prop);
             }
         }
         return methods;
     },
     // Returns an array of (the names of) all properties
     properties: function(obj) {
         var testObj = obj || self;
         var properties = [];
         for (prop in testObj) {
             if (typeof testObj[prop] != Inspect.TYPE_FUNCTION && typeof Inspect[prop] != Inspect.TYPE_FUNCTION) {
                 properties.push(prop);
             }
         }
         return properties;
     }
 }

 function runBackground() {
    $('#lefile').value = '';
    $("#backgroundfile").val('');
    //submitButton.removeAttr('disabled');
    progressBar.addClass("progress-success");
    progressBar.text('0%');
    progressBar.attr('value','0');
 }

 function removeBackground() {
    $("#saveMessage").text('Changes Made, Save Pending...');
    $('#lefile').attr("value", "");
    $('#lefile').val("");
    canvas.setBackgroundImage(0, canvas.renderAll.bind(canvas));
    onSave();
 }

 function backgroundExists(link) {

    log.info("In background exists")
    log.debug(link)
    var background_exists = false;
    if (link === undefined || link === "") {
       background_exists = false;
       log.debug("Using Background Button")
       if ( $( "#backgroundButton" ).length ) {
               log.debug("Found Background Button")
       }
       if ( $( "#backgroundButtonText" ).length ) {
               log.debug("Found backgroundButtonText")
       }
       backgroundButton(false);
    } else {
       background_exists = true;
       log.debug("Using Remove Background Button")
       if ( $( "#backgroundButton" ).length ) {
               log.debug("Found Background Button")
       }
       if ( $( "#backgroundButtonText" ).length ) {
               log.debug("Found backgroundButtonText")
       }
       backgroundButton(true);
    }
    log.debug("Background Exists?")
    log.debug(background_exists)
    log.info("Leaving Background Exists")
    return background_exists;
 }

 function backgroundButton( background )
 {
    if (background) {
      $("#backgroundButton").attr("onclick","removeBackgroundRoutine(); return false;");
      $("#backgroundButtonText").html('Remove Background');
    } else {
      $("#backgroundButton").attr("onclick","addBackgroundRoutine(); return false;");
      $("#backgroundButtonText").html('Background');
    }
 }

 function removeBackgroundRoutine()
 {
    removeBackground();
    backgroundButton(false);
    return false;
 }

 function addBackgroundRoutine()
 {
    runBackground();
    backgroundModal();
    return false;
 }

 function toggle_versions_pane()
 {
    var effect = 'slide';
    // Set the options for the effect type chosen
    var options = { direction: 'right' };
    // Set the duration (default: 400 milliseconds)
    var duration = 500;
    $('#versionspanel').toggle(effect, options, duration);
 }

 function calcArrowAngle(x1, y1, x2, y2) {
        var angle = 0,
            x, y;

        x = (x2 - x1);
        y = (y2 - y1);

        if (x === 0) {
            angle = (y === 0) ? 0 : (y > 0) ? Math.PI / 2 : Math.PI * 3 / 2;
        } else if (y === 0) {
            angle = (x > 0) ? 0 : Math.PI;
        } else {
            angle = (x < 0) ? Math.atan(y / x) + Math.PI : (y < 0) ? Math.atan(y / x) + (2 * Math.PI) : Math.atan(y / x);
        }

        return (angle * 180 / Math.PI);
    }
