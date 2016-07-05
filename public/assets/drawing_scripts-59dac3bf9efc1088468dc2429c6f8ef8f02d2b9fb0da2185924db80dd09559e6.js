function setLinePositions(e){var t=e.target,o=t.get("type");"customline"==o&&lineobject.setLinePositions(e),"customlinearrow"==o&&customlinearrow.setLinePositions(e),"customlinetwoarrow"==o&&customlinetwoarrow.setLinePositions(e)}function setLineCirclePositionsBoundary(e){var t=e.target;"customline"==t.type&&lineobject.setLineCirclePositionsBoundary(e),"customlinearrow"==t.type&&customlinearrow.setLineCirclePositionsBoundary(e),"customlinetwoarrow"==t.type&&customlinetwoarrow.setLineCirclePositionsBoundary(e),t.setCoords(),_curX=e.e.clientX,_curY=e.e.clientY}function objectBoundaryCheck(e){"customline"==e.target.type?lineobject.objectBoundaryCheck(e):"customlinearrow"==e.target.type?customlinearrow.objectBoundaryCheck(e):objectBoundaryCheckAll(e)}function objectBoundaryCheckAll(e){var t=!1;if(setLinePositions(e),log.info("Entering  objectBoundaryCheck"),$("#saveMessage").text("Changes Made, Save Pending..."),e.target.setCoords(),log.debug("Checking to see if the end points of a line are being dragged "),"circlezero"!=e.target.type&&"circleone"!=e.target.type&&"conearrow"!=e.target.type&&"carrow"!=e.target.type&&"carrowtwo"!=e.target.type){var o=e.target,n=e.target.getBoundingRect().top+e.target.getBoundingRect().height,i=e.target.getBoundingRect().left+e.target.getBoundingRect().width,r=o.getBoundingRect(),a=-(r.left-o.left),l=-(r.top-o.top);bounds={tl:{x:0,y:0},br:{x:canvas.width,y:canvas.height}},log.debug("Checking to see if we hit the top-left corner"),(e.target.getBoundingRect().top<=bounds.tl.y||e.target.getBoundingRect().left<=bounds.tl.x)&&(log.debug("hit the top-left corner"),e.target.setTop(Math.max(e.target.top,l)),e.target.left=Math.max(e.target.left,a),setLineCirclePositionsBoundary(e),canvas.deactivateAll(),t=!0,e.target.setCoords()),log.debug("Checking to see if we hit the bot-right corner"),(n>=bounds.br.y||i>=bounds.br.x)&&(n>=bounds.br.y&&(e.target.angle>=270&&e.target.angle<360?e.target.top=bounds.br.y-e.target.getBoundingRect().height+l:e.target.angle>=90&&e.target.angle<=180?(e.target.top=bounds.br.y-e.target.getBoundingRect().height+l,log.debug("Calculated Top: "+(bounds.br.y-e.target.getBoundingRect().height+l))):e.target.angle>180&&e.target.angle<270?e.target.top=bounds.br.y-e.target.getBoundingRect().height+l:e.target.angle>=0&&e.target.angle<90&&(e.target.top=bounds.br.y-e.target.getBoundingRect().height+l)),i>=bounds.br.x&&(e.target.angle>=270&&e.target.angle<360?e.target.left=bounds.br.x-e.target.getBoundingRect().width:e.target.angle>=90&&e.target.angle<=180?e.target.left=bounds.br.x:e.target.angle>180&&e.target.angle<270?e.target.left=bounds.br.x-e.target.getBoundingRect().width+a:e.target.angle>=0&&e.target.angle<90&&(e.target.left=bounds.br.x-e.target.getBoundingRect().width+a)),t=!0,"customline"==e.target.type?lineobject.setLineCirclePositionsBoundary(e):"customlinearrow"!=e.target.type&&"customlinetwoarrow"!=e.target.type||(setLineCirclePositionsBoundary(e),canvas.deactivateAll()),e.target.setCoords())}else boundaryInspectorCircle(e);onSave(),log.info("Leaving objectBoundaryCheck")}function boundaryInspectorCircle(e){log.info("Entering boundaryInspectorCircle"),e.target.setCoords();var t=e.target;console.log("Type is: ",t.type),bounds={tl:{x:0,y:0},br:{x:canvas.width,y:canvas.height}},"circleone"!=t.type&&"circlezero"!=t.type||(t.top<bounds.tl.y||t.left<bounds.tl.x?(e.target.setTop(Math.max("0",e.target.top)),e.target.left=Math.max("0",e.target.left)):(t.top+2*t.radius>bounds.br.y||t.left+2*t.radius>bounds.br.x)&&(e.target.setTop(Math.min(bounds.br.y,e.target.top+2*t.radius)),e.target.left=Math.min(bounds.br.x,e.target.left+2*t.radius)),t.line&&t.line.set({x1:t.line.cone.left,y1:t.line.cone.top,x2:t.line.ctwo.left,y2:t.line.ctwo.top}),t.line.setCoords(),e.target.setCoords()),"conearrow"==t.type&&(t.top<bounds.tl.y||t.left<bounds.tl.x?(e.target.setTop(Math.max("0",e.target.top)),e.target.left=Math.max("0",e.target.left)):(t.top+2*t.radius>bounds.br.y||t.left+2*t.radius>bounds.br.x)&&(e.target.setTop(Math.min(bounds.br.y,e.target.top+2*t.radius)),e.target.left=Math.min(bounds.br.x,e.target.left+2*t.radius)),t.line&&t.line.set({x1:t.line.conearrow.left,y1:t.line.conearrow.top,x2:t.line.carrow.left,y2:t.line.carrow.top}),t.line.setCoords(),angle=calcArrowAngle(t.line.x1,t.line.y1,t.line.x2,t.line.y2),t.line.carrow.set("angle",angle+90),e.target.setCoords()),"carrow"==t.type&&(t.top<bounds.tl.y||t.left<bounds.tl.x?(e.target.setTop(Math.max("0",e.target.top)),e.target.left=Math.max("0",e.target.left)):(t.top>bounds.br.y||t.left+t.width>bounds.br.x)&&(e.target.setTop(Math.min(bounds.br.y,e.target.top)),e.target.left=Math.min(bounds.br.x,e.target.left+t.width)),"customlinetwoarrow"==t.line.type?t.line&&t.line.set({x1:t.line.carrowtwo.left,y1:t.line.carrowtwo.top,x2:t.line.carrow.left,y2:t.line.carrow.top}):t.line&&t.line.set({x1:t.line.conearrow.left,y1:t.line.conearrow.top,x2:t.line.carrow.left,y2:t.line.carrow.top}),t.line.setCoords(),angle=calcArrowAngle(t.line.x1,t.line.y1,t.line.x2,t.line.y2),t.set("angle",angle+90),"customlinetwoarrow"==t.line.type&&t.line.carrowtwo.set({angle:angle-90}),e.target.setCoords()),"carrowtwo"==t.type&&(t.top<bounds.tl.y||t.left<bounds.tl.x?(e.target.setTop(Math.max("0",e.target.top)),e.target.left=Math.max("0",e.target.left)):(t.top>bounds.br.y||t.left+t.width>bounds.br.x)&&(e.target.setTop(Math.min(bounds.br.y,e.target.top)),e.target.left=Math.min(bounds.br.x,e.target.left+t.width)),t.line&&t.line.set({x1:t.left,y1:t.top,x2:t.line.carrow.left,y2:t.line.carrow.top}),t.line.setCoords(),angle=calcArrowAngle(t.line.x1,t.line.y1,t.line.x2,t.line.y2),t.set("angle",angle-90),t.line.carrow.set("angle",angle+90),e.target.setCoords()),log.info("Leaving boundaryInspectorCircle")}function objectResize(e){log.info("Entering objectResize"),"circle"==e.target.type?circleobject.objectResize(e):"ellipse"==e.target.type?ellipseobject.objectResize(e):"rect"==e.target.type&&rectobject.objectResize(e),objectBoundaryCheck(e),log.info("Leaving objectResize")}function selectionCleared(){log.info("Entering selectionCleared"),lineActive=!0,lineSelected=!1,log.debug("lineActive: ",lineActive),log.debug("lineSelected: ",lineSelected),log.info("Leaving selectionCleared")}function mouseDown(e){log.info("Entering mouseDown"),e.preventDefault&&e.preventDefault(),$("#contextMenu").remove(),contextmenuon=!1,activeObject=!1,log.debug("contextmenuon: ",contextmenuon),log.info("Leaving mouseDown")}function objectSelected(e){log.info("Entering objectSelected"),activeObject=!0,activeObjectVal=e.target;var t=e.target.get("type");"customline"==t&&lineobject.objectSelected(e),"customlinearrow"==t&&(_curX=e.e.clientX,_curY=e.e.clientY,_c1Top=e.target.conearrow.getTop(),_c1Left=e.target.conearrow.getLeft(),_c2Top=e.target.carrow.getTop(),_c2Left=e.target.carrow.getLeft()),"customlinetwoarrow"==t&&(_curX=e.e.clientX,_curY=e.e.clientY,_c1Top=e.target.carrow.getTop(),_c1Left=e.target.carrow.getLeft(),_c2Top=e.target.carrowtwo.get("top"),_c2Left=e.target.carrowtwo.getLeft());var o=canvas.getActiveGroup(),n=new Array,r=new Array,a=new Array,l=new Array,c=new Array,g=new Array;if(o){for(groupObjectsCustomLineArrow=o.getObjects("customlinearrow"),i=0;i<groupObjectsCustomLineArrow.length;i++)g.push(groupObjectsCustomLineArrow[i].objId),console.log("Found Custom Line Arrow: ",groupObjectsCustomLineArrow[i].objId);for(groupObjectsCircleZero=o.getObjects("circlezero"),i=0;i<groupObjectsCircleZero.length;i++)n.push(groupObjectsCircleZero[i].belongsTo);for(groupObjectsCustomLine=o.getObjects("customline"),i=0;i<groupObjectsCustomLine.length;i++)c.push(groupObjectsCustomLine[i].objId);for(groupObjectsCircleOne=o.getObjects("circleone"),i=0;i<groupObjectsCircleOne.length;i++)r.push(groupObjectsCircleOne[i].belongsTo);for(groupObjectsCircleOneArrow=o.getObjects("conearrow"),i=0;i<groupObjectsCircleOneArrow.length;i++)a.push(groupObjectsCircleOneArrow[i].belongsTo);for(groupObjectsCArrow=o.getObjects("carrow"),i=0;i<groupObjectsCArrow.length;i++)l.push(groupObjectsCArrow[i].belongsTo);for(allObjects=canvas.getObjects(),i=0;i<n.length;i++){if(-1==$.inArray(n[i],r))for(j=0,notFound=!0;j<allObjects.length&&notFound;)"circleone"==allObjects[j].type&&allObjects[j].belongsTo==n[i]&&(r.push(n[i]),o.addWithUpdate(allObjects[j]),notFound=!1),j+=1;if(-1==$.inArray(n[i],c))for(j=0,notFound=!0;j<allObjects.length&&notFound;)"customline"==allObjects[j].type&&allObjects[j].objId==n[i]&&(c.push(n[i]),o.addWithUpdate(allObjects[j]),notFound=!1),j+=1}for(i=0;i<r.length;i++){if(-1==$.inArray(r[i],n))for(j=0,notFound=!0;j<allObjects.length&&notFound;)"circlezero"==allObjects[j].type&&allObjects[j].belongsTo==r[i]&&(n.push(r[i]),o.addWithUpdate(allObjects[j]),notFound=!1),j+=1;if(-1==$.inArray(r[i],c))for(j=0,notFound=!0;j<allObjects.length&&notFound;)"customline"==allObjects[j].type&&allObjects[j].objId==r[i]&&(c.push(r[i]),o.addWithUpdate(allObjects[j]),notFound=!1),j+=1}for(i=0;i<c.length;i++){if(-1==$.inArray(c[i],n))for(j=0,notFound=!0;j<allObjects.length&&notFound;)"circlezero"==allObjects[j].type&&allObjects[j].belongsTo==c[i]&&(n.push(c[i]),o.addWithUpdate(allObjects[j]),notFound=!1),j+=1;if(-1==$.inArray(c[i],r))for(j=0,notFound=!0;j<allObjects.length&&notFound;)"circleone"==allObjects[j].type&&allObjects[j].belongsTo==c[i]&&(r.push(c[i]),o.addWithUpdate(allObjects[j]),notFound=!1),j+=1}for(i=0;i<g.length;i++){if(console.log("Searching for LineArrow ends"),-1==$.inArray(g[i],a))for(j=0,notFound=!0;j<allObjects.length&&notFound;)"conearrow"==allObjects[j].type&&allObjects[j].belongsTo==g[i]&&(a.push(g[i]),o.addWithUpdate(allObjects[j]),notFound=!1),j+=1;if(-1==$.inArray(g[i],l))for(j=0,notFound=!0;j<allObjects.length&&notFound;)"carrow"==allObjects[j].type&&allObjects[j].belongsTo==g[i]&&(l.push(g[i]),o.addWithUpdate(allObjects[j]),notFound=!1),j+=1}for(i=0;i<l.length;i++){if(-1==$.inArray(l[i],a))for(j=0,notFound=!0;j<allObjects.length&&notFound;)"circleonearrow"==allObjects[j].type&&allObjects[j].belongsTo==l[i]&&(a.push(l[i]),o.addWithUpdate(allObjects[j]),notFound=!1),j+=1;if(-1==$.inArray(l[i],c))for(j=0,notFound=!0;j<allObjects.length&&notFound;)"customlinearrow"==allObjects[j].type&&allObjects[j].objId==l[i]&&(g.push(l[i]),o.addWithUpdate(allObjects[j]),notFound=!1),j+=1}canvas.renderAll()}log.info("Leaving objectSelected")}function mouseOut(){log.info("Entering mouseOut"),contextmenuon=!0,canvas.renderAll(),log.info("Leaving mouseOut")}function mouseOver(e){log.info("Entering mouseOver"),contextmenuon=!1,activeObjectVal=e.target,e.target.type&&"line"==e.target.type&&(log.debug("Target is line"),searchId=getItemIndex(e.target),log.trace(e.target),canvas.setActiveObject(canvas.item(searchId))),log.info("Leaving mouseOver")}function postProcessLoading(e,t){log.info("Entering postProcessLoading"),"custom-image"==t.type&&(log.debug("Processing custom-image"),t.on("mousedown",function(e,t){imageobject.imageDown(e,t)})),"circle"==t.type&&circleobject.postprocessLoading(t),"circleone"==t.type&&(log.debug("Processing circleone"),t.hasBorders=t.hasControls=!1),"circlezero"==t.type&&(log.debug("Processing circleone"),t.hasBorders=t.hasControls=!1),"ellipse"==t.type&&(log.debug("Processing ellipse"),t.fill=void 0,t.on("mousedown",function(e,t){ellipseobject.ellipseDown(e,t)})),"rect"==t.type&&(log.debug("Processing rect"),t.fill=void 0,t.on("mousedown",function(e,t){rectobject.rectangleDown(e,t)})),"customline"==t.type&&(log.debug("Processing customline"),t.hasControls=!1,t.on("mousedown",function(e,t){lineDown(e,t)})),"i-text"==t.type&&(log.debug("Processing i-text"),t.on("mousedown",function(e,t){textobject.textDown(e,t)})),log.info("Leaving postProcessLoading")}function handleDragStart(){log.info("Entering handleDragStart"),[].forEach.call(images,function(e){e.classList.remove("img_dragging")}),this.classList.add("img_dragging"),log.info("Leaving handleDragStart")}function makeLine(e,t){lineobject.makeLine(e,t)}function makeCircleShape(e,t){circleobject.makeCircleShape(e,t)}function activateColorPicker(e){log.info("Entering activateColorPicker"),console.log("activateColorPicker: ",e),activeObjectValCP=activeObjectVal,document.getElementById("myColor").color.showPicker(),log.info("Leaving activateColorPicker")}function colorPickerChange(e){log.info("Entering colorPickerChange"),log.debug("newLineColor: ",e),activeObjectValCP&&(log.trace("activeObjectVal: ",activeObjectValCP),activeObjectValCP.type&&(log.trace("activeObjectVal.type: ",activeObjectValCP.type),"customline"==activeObjectValCP.type&&(log.debug("colorPickerChange on line type"),activeObjectValCP.fill=e,activeObjectValCP.stroke=e),"customlinearrow"==activeObjectValCP.type&&(log.debug("colorPickerChange on line type"),activeObjectValCP.fill=e,activeObjectValCP.stroke=e),"customlinetwoarrow"==activeObjectValCP.type&&(log.debug("colorPickerChange on line type"),activeObjectValCP.fill=e,activeObjectValCP.stroke=e),"circle"==activeObjectValCP.type&&(log.debug("colorPickerChange on circle type"),activeObjectValCP.stroke=e),"ellipse"==activeObjectValCP.type&&(log.debug("colorPickerChange on ellipse type"),activeObjectValCP.stroke=e),"rect"==activeObjectValCP.type&&(log.debug("colorPickerChange on rect type"),activeObjectValCP.stroke=e),"i-text"==activeObjectValCP.type&&(log.debug("colorPickerChange on i-text type"),activeObjectValCP.stroke=e))),canvas.renderAll(),log.info("Leaving colorPickerChange")}function handleDragOver(e){return log.info("Entering handleDragOver"),e.preventDefault&&e.preventDefault(),e.dataTransfer.dropEffect="copy",log.info("Leaving handleDragOver"),!1}function handleDragEnter(){log.info("Entering handleDragEnter"),this.classList.add("over"),log.info("Leaving handleDragEnter")}function handleDragLeave(){log.info("Entering handleDragLeave"),this.classList.remove("over"),log.info("Leaving handleDragLeave")}function sendBackward(){log.info("Entering sendBackward");var e=canvas.getActiveObject();e&&canvas.sendBackwards(e),$("#contextMenu").remove(),contextmenuon=!1,activeObject=!1,log.info("Leaving sendBackward")}function sendToBack(){log.info("Entering sendToBack");var e=canvas.getActiveObject();e&&canvas.sendToBack(e),$("#contextMenu").remove(),contextmenuon=!1,activeObject=!1,log.info("Leaving sendToBack")}function bringFoward(){log.info("Entering bringFoward");var e=canvas.getActiveObject();e&&canvas.bringForward(e),$("#contextMenu").remove(),contextmenuon=!1,activeObject=!1,log.info("Leaving bringFoward")}function bringToFront(){log.info("Entering bringToFront");var e=canvas.getActiveObject();e&&canvas.bringToFront(e),$("#contextMenu").remove(),contextmenuon=!1,activeObject=!1,log.info("Leaving bringToFront")}function lineDown(e,t){lineobject.lineDown(e,t)}function lineArrowTwoDown(e,t){customlinetwoarrow.lineArrowTwoDown(e,t)}function circleDown(e,t){circleobject.circleDown(e,t)}function handleDrop(e){log.info("Entering handleDrop"),$("#saveMessage").text("Changes Made, Save Pending...");var t=document.querySelector("#images img.img_dragging");t.height=t.height,t.width=t.width,log.trace("Draggable Stage:",t);if(e.stopPropagation&&e.stopPropagation(),null!=t){var o=t.getAttribute("img_val");if(log.debug("imgsrc_val: ",o),"line.png"==o)lineobject.lineDrop(e,id);else if("line_arrow_icon.png"==o)customlinearrow.linearrowdrop(e,id);else if("line_arrow_two_icon.png"==o)customlinetwoarrow.lineDrop(e,id);else if("circle_icon.png"==o)circleobject.circledrop(e,id);else if("ellipse_icon.png"==o)ellipseobject.ellipsedrop(e,id);else if("rectangle-icon.png"==o)rectobject.rectdrop(e,id);else if("textbox_icon.png"==o){log.debug("In textbox_icon.png section");var n=new fabric.IText("Tap and Type",{fontFamily:"arial black",fontSize:12,left:e.layerX,top:e.layerY});n.hasBorders=n.hasControls=!0,n.id=itemId,itemId+=1,canvas.add(n),n.on("mousedown",function(e,t){textobject.textDown(e,t)})}else{log.debug("In drag down else category");var i=new fabric.CustomImage(t,{width:t.width,height:t.height,left:e.layerX,top:e.layerY,config:"undefined",origloc:"undefined"});t.hasAttribute("data-config")?(log.debug("Has data-config"),i.configdbid=t.getAttribute("data-config"),log.debug("data-config: ",i.configdbid)):i.configdbid=!1,t.hasAttribute("data-model")?(log.debug("Has data-model"),i.model=t.getAttribute("data-model"),log.debug("data-model: ",i.model)):i.model=!1,t.hasAttribute("data-loc")?(log.debug("Has data-loc"),i.origloc=t.getAttribute("data-loc"),log.debug("data-loc: ",i.origloc)):i.origloc=!1,i.id=itemId,i.setSrc("/assets/"+i.origloc,function(e){log.debug("Object"),log.debug("In callback for setSrc function"),log.trace(e)},{height:t.height,width:t.width}),i.setCoords(),log.debug("--- newImage.src ------"),log.debug("src:",i.getSrc()),log.debug("Height",i.getHeight()),log.debug("Width",i.getWidth()),itemId+=1,i.on("mousedown",function(e,t){imageobject.imageDown(e,t)}),canvas.add(i),canvas.renderAll()}return this.classList.remove("over"),onSave(),!1}onSave(),log.info("Leaving handleDrop")}function contextMenu(e){log.info("Entering contextMenu");var t=e.offsetX,o=e.offsetY;return $.each(canvas._objects,function(e,n){var i=n.width/2,r=n.height/2;return t>=n.left-i&&t<=n.left+i&&o>=n.top-r&&o<=n.top+r?!1:void 0}),log.info("Leaving contextMenu"),!1}function menus(e,t){log.info("Entering menus");var o="";if(0==contextmenuon){var n=document.createElement("div");n.id="contextMenu";var i="<ul class='dropdown-menu' role='menu' style='display:block;position:static;' >";for(index=0;index<e.length;index++)i+="<li> <a tabindex=''-1'>"+e[index]+"</a> </li>";i+="</ul>",n.innerHTML=i,$("body").append(n),o=$("#contextMenu"),o.css({display:"block",left:t.pageX,top:t.pageY})}else log.info("Menu Not Displayed contextmenu is true");log.info("Leaving menus")}function handleDragEnd(){log.info("Entering handleDragEnd"),[].forEach.call(images,function(e){e.classList.remove("img_dragging")}),log.info("Leaving handleDragEnd")}function drawAsPNG(){return log.info("Entering drawAsPNG"),canvas.isDrawingMode=!1,window.localStorage?(window.open(canvas.toDataURL("png")),void log.info("Leaving drawAsPNG")):void alert("This function is not supported by your browser.")}function getItemIndex(e){for(log.info("Entering getItemIndex"),id=e.id,index=0,objectList=canvas.getObjects(),i=0;i<objectList.length;i++)objectList[i].id==id&&(index=i);return log.info("Leaving getItemIndex"),index}function backgroundModal(){log.info("Entering backgroundModal"),$("#backgroundSection").modal("show"),log.info("Leaving backgroundModal")}function calcArrowAngle(e,t,o,n){var i,r,a=0;return i=o-e,r=n-t,a=0===i?0===r?0:r>0?Math.PI/2:3*Math.PI/2:0===r?i>0?0:Math.PI:0>i?Math.atan(r/i)+Math.PI:0>r?Math.atan(r/i)+2*Math.PI:Math.atan(r/i),180*a/Math.PI}var id=0;