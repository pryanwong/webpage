var customlinetwoarrow=function(){};customlinetwoarrow.setLinePositions=function(e){for(var o=e.target,t=(o.get("type"),o.get("objId")),n=_curX-e.e.clientX,r=_curY-e.e.clientY,c=0;c<canvas.getObjects().length;c++){var i=canvas.getObjects()[c];"carrowtwo"==i.type&&i.get("belongsTo")==t&&(_c2Top=i.getTop(),_c2Left=i.getLeft(),i.set({left:i.left-n,top:i.top-r}),i.setCoords(),i.line&&i.line.set({x1:i.left,y1:i.top}),i.line.setCoords()),"carrow"==i.type&&i.get("belongsTo")==t&&(_c1Top=i.getTop(),_c1Left=i.getLeft(),i.set({left:i.left-n,top:i.top-r}),i.setCoords(),i.line&&i.line.set({x2:i.left,y2:i.top}),i.line.setCoords())}_curX=e.e.clientX,_curY=e.e.clientY},customlinetwoarrow.setLineCirclePositionsBoundary=function(e){var o=e.target;o.get("type"),o.get("objId"),_curX-e.e.clientX,_curY-e.e.clientY;_circleOne=o.carrow,_circleTwo=o.carrowtwo,_circleTwo&&_circleTwo.set({left:_c2Left,top:_c2Top}),_circleTwo.setCoords(),_circleTwo.line&&_circleTwo.line.set({x2:_circleTwo.left,y2:_circleTwo.top}),_circleTwo.line.setCoords(),_circleOne.line&&_circleOne.set({left:_c1Left,top:_c1Top}),_circleOne.setCoords(),_circleOne.line&&_circleOne.line.set({x1:_circleOne.left,y1:_circleOne.top}),_circleOne.line.setCoords(),o&&o.set({x1:_circleOne.left,y1:_circleOne.top,x2:_circleTwo.left,y2:_circleTwo.top}),o.setCoords(),_curX=e.e.clientX,_curY=e.e.clientY},customlinetwoarrow.makeLineTwoArrow=function(e,o){return log.info("Entering makeLine"),log.debug("Coords are: ",e),line=new fabric.Customlinetwoarrow(e,{x1:e[0],y1:e[1],x2:e[2],y2:e[3],fill:"red",stroke:"red",strokeWidth:5,selectable:!0,objId:o,perPixelTargetFind:!0}),line.hasControls=!1,log.info("Leaving makeLine"),line},customlinetwoarrow.lineArrowTwoDown=function(e){log.info("Entering lineDown"),activeObjectVal&&(activeObject=!0),""!=handler&&document.removeEventListener("contextmenu",handler),3==e.e.which&&(handler=function(e){if(0==contextmenuon&&1==activeObject){e.preventDefault();var o=["Delete Line","Change Color","Send Backward","Send To Back","Bring Forward","Bring To Front"];menus(o,e),$('a:contains("Delete")').click(function(){if(activeObjectVal.type)if("customlinetwoarrow"==activeObjectVal.type)canvas.remove(activeObjectVal.carrowtwo),canvas.remove(activeObjectVal.carrow),canvas.remove(activeObjectVal);else if(activeObjectVal.hasOwnProperty("belongsTo")){for(var e=canvas.getObjects(),o=activeObjectVal.get("belongsTo"),t=!1,n=0;!t&&n<e.length;)"customlinetwoarrow"==e[n].type&&e[n].objId==o&&(t=!0),n+=1;t&&(n-=1,canvas.remove(e[n].carrowtwo),canvas.remove(e[n].carrow),canvas.remove(e[n])),canvas.renderAll()}$("#contextMenu").remove(),contextmenuon=!1,activeObject=!1}),$('a:contains("Change Color")').click(function(){activateColorPicker(e),$("#contextMenu").remove(),contextmenuon=!1}),$('a:contains("Send Backward")').click(function(){sendBackward()}),$('a:contains("Send To Back")').click(function(){sendToBack()}),$('a:contains("Bring Forward")').click(function(){bringFoward()}),$('a:contains("Bring To Front")').click(function(){bringToFront()}),contextmenuon=!0}},document.addEventListener("contextmenu",handler,!1)),log.info("Leaving lineDown")},customlinetwoarrow.makeArrowTwo=function(e){log.info("Entering makeArrowTwo");var o=new fabric.Carrowtwo({left:e.get("x1")-2.5,top:e.get("y1")-2.5,originX:"center",originY:"center",hasBorders:!1,hasControls:!1,lockScalingX:!0,lockScalingY:!0,lockRotation:!0,pointType:"arrow_start",angle:-45,width:20,height:20,fill:"#000"});o.setBelongsTo(e.objId);var t=new fabric.Carrow({left:e.get("x2"),top:e.get("y2"),originX:"center",originY:"center",hasBorders:!1,hasControls:!1,lockScalingX:!0,lockScalingY:!0,lockRotation:!0,pointType:"arrow_start",angle:135,width:20,height:20,fill:"#000"});t.setBelongsTo(e.objId),o.hasBorders=o.hasControls=!1,t.hasBorders=t.hasControls=!1,o.line=e,t.line=e,e.carrowtwo=o,e.carrow=t;var n=new Array(o,t);return log.info("Leaving makeCircle"),n},customlinetwoarrow.lineDrop=function(e,o){log.debug("In line.png section"),objectName="customlinetwoarrow";var t=e.layerX,n=e.layerY,r=t+25,i=n+25;objId=o;var a=customlinetwoarrow.makeLineTwoArrow([t,n,r,i],o);a.hasControls=!1,itemId+=1,a.id=itemId,a.objId=itemId,canvas.add(a),c[o]=customlinetwoarrow.makeArrowTwo(a),a.carrowtwo=c[o][0],a.carrow=c[o][1],canvas.add(c[o][0],c[o][1]),canvas.renderAll(),a.on("mousedown",function(e,o){customlinetwoarrow.lineArrowTwoDown(e,o)})};