var circleobject=function(){};circleobject.objectResize=function(e){log.info("Entering objectResize"),newWidth=e.target.width*e.target.scaleX,newRadius=e.target.radius*e.target.scaleX,e.target.set({width:newWidth,radius:newRadius,height:newWidth,scaleX:1,scaleY:1})},circleobject.postprocessLoading=function(e){log.debug("Processing circle"),e.fill=void 0,e.on("mousedown",function(e,c){circleDown(e,c)})},circleobject.makeCircleShape=function(e){return log.info("Entering makeCircleShape"),new fabric.Circle({top:e[1],left:e[0],radius:15,fill:void 0,stroke:"red",lockUniScaling:!0,hasRotatingPoint:!1,strokeWidth:5})},circleobject.circleDown=function(e){log.info("Entering circleDown"),""!=handler&&document.removeEventListener("contextmenu",handler),activeObjectVal&&(activeObject=!0),3==e.e.which&&(handler=function(e){if(0==contextmenuon&&1==activeObject){e.preventDefault();var c=["Delete","Change Color","Send Backward","Send To Back","Bring Forward","Bring To Front"];angular.element(document.querySelector('[ng-controller="ModalProductConfigController as mpc"]')).scope().mpc.deleteAction=function(){log.debug("circleDown: In Delete"),activeObjectVal=canvas.getActiveObject(),log.trace(activeObjectVal),canvas.remove(activeObjectVal),$("#contextMenu").remove(),contextmenuon=!1,activeObject=!1},menus(c,e),contextmenuon=!0}},document.addEventListener("contextmenu",handler,!1)),log.info("Leaving circleDown")},circleobject.circledrop=function(e,c){log.debug("In circle_icon.png section"),objectName="circle";var n=e.layerX,t=e.layerY,c=objId_var+1;objId=c;var o=circleobject.makeCircleShape([n,t],c);o.hasBorders=o.hasControls=!0,o.on("mousedown",function(e,c){circleDown(e,c)}),o.id=itemId,itemId+=1,canvas.add(o)};