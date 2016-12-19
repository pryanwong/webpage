var customlinearrow=function(){};customlinearrow.setLinePositions=function(e){for(var t=e.target,o=(t.get("type"),t.get("objId")),r=_curX-e.e.clientX,n=_curY-e.e.clientY,a=0;a<canvas.getObjects().length;a++){var c=canvas.getObjects()[a];"carrow"==c.type&&c.get("belongsTo")==o&&(_c2Top=c.getTop(),_c2Left=c.getLeft(),c.set({left:c.left-r,top:c.top-n}),c.setCoords(),c.line&&c.line.set({x2:c.left,y2:c.top}),c.line.setCoords()),"conearrow"==c.type&&c.get("belongsTo")==o&&(_c1Top=c.getTop(),_c1Left=c.getLeft(),c.set({left:c.left-r,top:c.top-n}),c.setCoords(),c.line&&c.line.set({x1:c.left,y1:c.top}),c.line.setCoords())}_curX=e.e.clientX,_curY=e.e.clientY},customlinearrow.objectBoundaryCheck=function(e){var t=!1;setLinePositions(e),log.info("Entering  objectBoundaryCheck"),$("#saveMessage").text("Changes Made, Save Pending..."),e.target.setCoords(),log.debug("Checking to see if the end points of a line are being dragged ");var o=e.target,r=e.target.getBoundingRect().top+e.target.getBoundingRect().height,n=e.target.getBoundingRect().left+e.target.getBoundingRect().width,a=o.getBoundingRect(),c=-(a.left-o.left),i=-(a.top-o.top);bounds={tl:{x:0,y:0},br:{x:canvas.width,y:canvas.height}},log.debug("Checking to see if we hit the top-left corner"),(e.target.getBoundingRect().top<=bounds.tl.y||e.target.getBoundingRect().left<=bounds.tl.x)&&(log.debug("hit the top-left corner"),e.target.setTop(Math.max(e.target.top,i)),e.target.left=Math.max(e.target.left,c),"customline"!=e.target.type&&"customlinearrow"!=e.target.type&&"customlinetwoarrow"!=e.target.type||(setLineCirclePositionsBoundary(e),canvas.deactivateAll()),t=!0,e.target.setCoords()),log.debug("Checking to see if we hit the bot-right corner"),(r>=bounds.br.y||n>=bounds.br.x)&&(r>=bounds.br.y&&(e.target.angle>=270&&e.target.angle<360?e.target.top=bounds.br.y-e.target.getBoundingRect().height+i:e.target.angle>=90&&e.target.angle<=180?(e.target.top=bounds.br.y-e.target.getBoundingRect().height+i,log.debug("Calculated Top: "+(bounds.br.y-e.target.getBoundingRect().height+i))):e.target.angle>180&&e.target.angle<270?e.target.top=bounds.br.y-e.target.getBoundingRect().height+i:e.target.angle>=0&&e.target.angle<90&&(e.target.top=bounds.br.y-e.target.getBoundingRect().height+i)),n>=bounds.br.x&&(e.target.angle>=270&&e.target.angle<360?e.target.left=bounds.br.x-e.target.getBoundingRect().width:e.target.angle>=90&&e.target.angle<=180?e.target.left=bounds.br.x:e.target.angle>180&&e.target.angle<270?e.target.left=bounds.br.x-e.target.getBoundingRect().width+c:e.target.angle>=0&&e.target.angle<90&&(e.target.left=bounds.br.x-e.target.getBoundingRect().width+c)),t=!0,customlinearrow.setLineCirclePositionsBoundary(e),canvas.deactivateAll(),e.target.setCoords()),onSave(),log.info("Leaving objectBoundaryCheck")},customlinearrow.setLineCirclePositionsBoundary=function(e){var t=e.target;t.get("type"),t.get("objId"),_curX-e.e.clientX,_curY-e.e.clientY;_circleOne=t.conearrow,_circleTwo=t.carrow,_circleTwo&&_circleTwo.set({left:_c2Left,top:_c2Top}),_circleTwo.setCoords(),_circleTwo.line&&_circleTwo.line.set({x2:_circleTwo.left,y2:_circleTwo.top}),_circleTwo.line.setCoords(),_circleOne&&_circleOne.set({left:_c1Left,top:_c1Top}),_circleOne.setCoords(),_circleOne.line&&_circleOne.line.set({x1:_circleOne.left,y1:_circleOne.top}),_circleOne.line.setCoords(),t&&t.set({x1:_circleOne.left,y1:_circleOne.top,x2:_circleTwo.left,y2:_circleTwo.top})},customlinearrow.makeLineArrow=function(e,t){return log.info("Entering makeLine"),log.debug("Coords are: ",e),line=new fabric.Customlinearrow(e,{x1:e[0],y1:e[1],x2:e[2],y2:e[3],fill:"red",stroke:"red",strokeWidth:5,selectable:!0,objId:t,perPixelTargetFind:!0}),line.hasControls=!1,log.info("Leaving makeLine"),line},customlinearrow.lineArrowDown=function(e){log.info("Entering lineDown"),activeObjectVal&&(activeObject=!0),""!==handler&&document.removeEventListener("contextmenu",handler),3==e.e.which&&(handler=function(e){if(contextmenuon===!1&&activeObject===!0){e.preventDefault();var t=["Delete","Change Color","Send Backward","Send To Back","Bring Forward","Bring To Front"];angular.element(document.querySelector('[ng-controller="ModalProductConfigController as mpc"]')).scope().mpc.deleteAction=function(){if(activeObjectVal.type)if("customlinearrow"==activeObjectVal.type)canvas.remove(activeObjectVal.conearrow),canvas.remove(activeObjectVal.carrow),canvas.remove(activeObjectVal);else if(activeObjectVal.hasOwnProperty("belongsTo")){console.log("removing belongTo object");for(var e=canvas.getObjects(),t=activeObjectVal.get("belongsTo"),o=!1,r=0;!o&&r<e.length;)"customlinearrow"==e[r].type&&e[r].objId==t&&(o=!0),r+=1;o&&(r-=1,canvas.remove(e[r].conearrow),canvas.remove(e[r].carrow),canvas.remove(e[r])),canvas.renderAll()}$("#contextMenu").remove(),contextmenuon=!1,activeObject=!1},menus(t,e),contextmenuon=!0}},document.addEventListener("contextmenu",handler,!1)),log.info("Leaving lineDown")},customlinearrow.makeCircleArrow=function(e){log.info("Entering makeCircleArrow");var t=new fabric.Conearrow({left:e.get("x1")-2.5,top:e.get("y1")-2.5,visible:"true",hoverCursor:"crosshair",strokeWidth:2,stroke:"#000",radius:5,fill:"#fff"});t.setBelongsTo(e.objId);var o=new fabric.Carrow({left:e.get("x2"),top:e.get("y2"),originX:"center",originY:"center",hasBorders:!1,hasControls:!1,lockScalingX:!0,lockScalingY:!0,lockRotation:!0,pointType:"arrow_start",angle:135,width:20,height:20,fill:"#000"});o.setBelongsTo(e.objId),t.hasBorders=t.hasControls=!1,o.hasBorders=o.hasControls=!1,t.line=e,o.line=e,e.conearrow=t,e.carrow=o;var r=new Array(t,o);return log.info("Leaving makeCircle"),r},customlinearrow.linearrowdrop=function(e,t){log.debug("In line.png section"),objectName="customlinearrow";var o=e.layerX,r=e.layerY,n=o+25,a=r+25;objId=t;var i=customlinearrow.makeLineArrow([o,r,n,a],t);i.hasControls=!1,itemId+=1,i.id=itemId,i.objId=itemId,canvas.add(i),c[t]=customlinearrow.makeCircleArrow(i),i.conearrow=c[t][0],i.carrow=c[t][1],canvas.add(c[t][0],c[t][1]),canvas.renderAll(),i.on("mousedown",function(e,t){customlinearrow.lineArrowDown(e,t)})};