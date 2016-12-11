function setLinePositions(e){var t=e.target,o=t.get("type");"customline"==o&&lineobject.setLinePositions(e),"customlinearrow"==o&&customlinearrow.setLinePositions(e),"customlinetwoarrow"==o&&customlinetwoarrow.setLinePositions(e)}function setLineCirclePositionsBoundary(e){var t=e.target;"customline"==t.type&&lineobject.setLineCirclePositionsBoundary(e),"customlinearrow"==t.type&&customlinearrow.setLineCirclePositionsBoundary(e),"customlinetwoarrow"==t.type&&customlinetwoarrow.setLineCirclePositionsBoundary(e),t.setCoords(),_curX=e.e.clientX,_curY=e.e.clientY}function objectBoundaryCheck(e){"customline"==e.target.type?lineobject.objectBoundaryCheck(e):"customlinearrow"==e.target.type?customlinearrow.objectBoundaryCheck(e):objectBoundaryCheckAll(e)}function objectBoundaryCheckAll(e){var t=!1;if(setLinePositions(e),log.info("Entering  objectBoundaryCheck"),$("#saveMessage").text("Changes Made, Save Pending..."),e.target.setCoords(),log.debug("Checking to see if the end points of a line are being dragged "),"circlezero"!=e.target.type&&"circleone"!=e.target.type&&"conearrow"!=e.target.type&&"carrow"!=e.target.type&&"carrowtwo"!=e.target.type){var o=e.target,n=e.target.getBoundingRect().top+e.target.getBoundingRect().height,i=e.target.getBoundingRect().left+e.target.getBoundingRect().width,r=o.getBoundingRect(),a=-(r.left-o.left),l=-(r.top-o.top);bounds={tl:{x:0,y:0},br:{x:canvas.width,y:canvas.height}},log.debug("Checking to see if we hit the top-left corner"),(e.target.getBoundingRect().top<=bounds.tl.y||e.target.getBoundingRect().left<=bounds.tl.x)&&(log.debug("hit the top-left corner"),e.target.setTop(Math.max(e.target.top,l)),e.target.left=Math.max(e.target.left,a),setLineCirclePositionsBoundary(e),t=!0,e.target.setCoords()),log.debug("Checking to see if we hit the bot-right corner"),(n>=bounds.br.y||i>=bounds.br.x)&&(n>=bounds.br.y&&(e.target.angle>=270&&e.target.angle<360?e.target.top=bounds.br.y-e.target.getBoundingRect().height+l:e.target.angle>=90&&e.target.angle<=180?(e.target.top=bounds.br.y-e.target.getBoundingRect().height+l,log.debug("Calculated Top: "+(bounds.br.y-e.target.getBoundingRect().height+l))):e.target.angle>180&&e.target.angle<270?e.target.top=bounds.br.y-e.target.getBoundingRect().height+l:e.target.angle>=0&&e.target.angle<90&&(e.target.top=bounds.br.y-e.target.getBoundingRect().height+l)),i>=bounds.br.x&&(e.target.angle>=270&&e.target.angle<360?e.target.left=bounds.br.x-e.target.getBoundingRect().width:e.target.angle>=90&&e.target.angle<=180?e.target.left=bounds.br.x:e.target.angle>180&&e.target.angle<270?e.target.left=bounds.br.x-e.target.getBoundingRect().width+a:e.target.angle>=0&&e.target.angle<90&&(e.target.left=bounds.br.x-e.target.getBoundingRect().width+a)),t=!0,"customline"==e.target.type?lineobject.setLineCirclePositionsBoundary(e):"customlinearrow"!=e.target.type&&"customlinetwoarrow"!=e.target.type||setLineCirclePositionsBoundary(e),e.target.setCoords())}else boundaryInspectorCircle(e);onSave(),log.info("Leaving objectBoundaryCheck")}function boundaryInspectorCircle(e){log.info("Entering boundaryInspectorCircle"),e.target.setCoords();var t=e.target;bounds={tl:{x:0,y:0},br:{x:canvas.width,y:canvas.height}},"circleone"!=t.type&&"circlezero"!=t.type||(t.top<bounds.tl.y||t.left<bounds.tl.x?(e.target.setTop(Math.max("0",e.target.top)),e.target.left=Math.max("0",e.target.left)):(t.top+2*t.radius>bounds.br.y||t.left+2*t.radius>bounds.br.x)&&(e.target.setTop(Math.min(bounds.br.y,e.target.top+2*t.radius)),e.target.left=Math.min(bounds.br.x,e.target.left+2*t.radius)),t.line&&t.line.set({x1:t.line.cone.left,y1:t.line.cone.top,x2:t.line.ctwo.left,y2:t.line.ctwo.top}),t.line.setCoords(),e.target.setCoords()),"conearrow"==t.type&&(t.top<bounds.tl.y||t.left<bounds.tl.x?(e.target.setTop(Math.max("0",e.target.top)),e.target.left=Math.max("0",e.target.left)):(t.top+2*t.radius>bounds.br.y||t.left+2*t.radius>bounds.br.x)&&(e.target.setTop(Math.min(bounds.br.y,e.target.top+2*t.radius)),e.target.left=Math.min(bounds.br.x,e.target.left+2*t.radius)),t.line&&t.line.set({x1:t.line.conearrow.left,y1:t.line.conearrow.top,x2:t.line.carrow.left,y2:t.line.carrow.top}),t.line.setCoords(),angle=calcArrowAngle(t.line.x1,t.line.y1,t.line.x2,t.line.y2),t.line.carrow.set("angle",angle+90),e.target.setCoords()),"carrow"==t.type&&(t.top<bounds.tl.y||t.left<bounds.tl.x?(e.target.setTop(Math.max("0",e.target.top)),e.target.left=Math.max("0",e.target.left)):(t.top>bounds.br.y||t.left+t.width>bounds.br.x)&&(e.target.setTop(Math.min(bounds.br.y,e.target.top)),e.target.left=Math.min(bounds.br.x,e.target.left+t.width)),"customlinetwoarrow"==t.line.type?t.line&&t.line.set({x1:t.line.carrowtwo.left,y1:t.line.carrowtwo.top,x2:t.line.carrow.left,y2:t.line.carrow.top}):t.line&&t.line.set({x1:t.line.conearrow.left,y1:t.line.conearrow.top,x2:t.line.carrow.left,y2:t.line.carrow.top}),t.line.setCoords(),angle=calcArrowAngle(t.line.x1,t.line.y1,t.line.x2,t.line.y2),t.set("angle",angle+90),"customlinetwoarrow"==t.line.type&&t.line.carrowtwo.set({angle:angle-90}),e.target.setCoords()),"carrowtwo"==t.type&&(t.top<bounds.tl.y||t.left<bounds.tl.x?(e.target.setTop(Math.max("0",e.target.top)),e.target.left=Math.max("0",e.target.left)):(t.top>bounds.br.y||t.left+t.width>bounds.br.x)&&(e.target.setTop(Math.min(bounds.br.y,e.target.top)),e.target.left=Math.min(bounds.br.x,e.target.left+t.width)),t.line&&t.line.set({x1:t.left,y1:t.top,x2:t.line.carrow.left,y2:t.line.carrow.top}),t.line.setCoords(),angle=calcArrowAngle(t.line.x1,t.line.y1,t.line.x2,t.line.y2),t.set("angle",angle-90),t.line.carrow.set("angle",angle+90),e.target.setCoords()),log.info("Leaving boundaryInspectorCircle")}function objectResize(e){log.info("Entering objectResize"),"circle"==e.target.type?circleobject.objectResize(e):"ellipse"==e.target.type?ellipseobject.objectResize(e):"rect"==e.target.type&&rectobject.objectResize(e),objectBoundaryCheck(e),log.info("Leaving objectResize")}function selectionCleared(){log.info("Entering selectionCleared"),lineActive=!0,lineSelected=!1,log.debug("lineActive: ",lineActive),log.debug("lineSelected: ",lineSelected),log.info("Leaving selectionCleared")}function mouseDown(e){log.info("Entering mouseDown"),e.preventDefault&&e.preventDefault(),$("#contextMenu").remove(),contextmenuon=!1,activeObject=!1,log.debug("contextmenuon: ",contextmenuon),log.info("Leaving mouseDown")}function objectSelected(e){log.info("Entering objectSelected"),activeObject=!0,activeObjectVal=e.target,console.log("Object Selected, ",activeObjectVal);var t=e.target.get("type");"customline"==t&&lineobject.objectSelected(e),"customlinearrow"==t&&(_curX=e.e.clientX,_curY=e.e.clientY,_c1Top=e.target.conearrow.getTop(),_c1Left=e.target.conearrow.getLeft(),_c2Top=e.target.carrow.getTop(),_c2Left=e.target.carrow.getLeft()),"customlinetwoarrow"==t&&(_curX=e.e.clientX,_curY=e.e.clientY,_c1Top=e.target.carrow.getTop(),_c1Left=e.target.carrow.getLeft(),_c2Top=e.target.carrowtwo.get("top"),_c2Left=e.target.carrowtwo.getLeft());var o=canvas.getActiveGroup(),n=new Array,r=new Array,a=new Array,l=new Array,c=new Array,g=new Array,s=new Array,d=new Array;if(o){for(groupObjectsCustomLineArrow=o.getObjects("customlinearrow"),i=0;i<groupObjectsCustomLineArrow.length;i++)s.push(groupObjectsCustomLineArrow[i].objId);for(groupObjectsCustomLineTwoArrow=o.getObjects("customlinetwoarrow"),i=0;i<groupObjectsCustomLineTwoArrow.length;i++)d.push(groupObjectsCustomLineTwoArrow[i].objId);for(groupObjectsCircleZero=o.getObjects("circlezero"),i=0;i<groupObjectsCircleZero.length;i++)n.push(groupObjectsCircleZero[i].belongsTo);for(groupObjectsCustomLine=o.getObjects("customline"),i=0;i<groupObjectsCustomLine.length;i++)g.push(groupObjectsCustomLine[i].objId);for(groupObjectsCircleOne=o.getObjects("circleone"),i=0;i<groupObjectsCircleOne.length;i++)r.push(groupObjectsCircleOne[i].belongsTo);for(groupObjectsCircleOneArrow=o.getObjects("conearrow"),i=0;i<groupObjectsCircleOneArrow.length;i++)a.push(groupObjectsCircleOneArrow[i].belongsTo);for(groupObjectsCArrow=o.getObjects("carrow"),i=0;i<groupObjectsCArrow.length;i++)c.push(groupObjectsCArrow[i].belongsTo);for(groupObjectsCircleTwoArrow=o.getObjects("carrowtwo"),i=0;i<groupObjectsCircleTwoArrow.length;i++)l.push(groupObjectsCircleTwoArrow[i].belongsTo);allObjects=canvas.getObjects(),includeEndPointsInGroup(o,g,n,r,allObjects,"customline","circleone","circlezero"),includeEndPointsInGroup(o,s,a,c,allObjects,"customlinearrow","carrow","conearrow"),includeEndPointsInGroup(o,d,l,c,allObjects,"customlinetwoarrow","carrow","carrowtwo"),canvas.renderAll()}log.info("Leaving objectSelected")}function includeEndPointsInGroup(e,t,o,n,r,a,l,c){for(i=0;i<o.length;i++){if($.inArray(o[i],n)==-1)for(j=0,notFound=!0;j<r.length&&notFound;)r[j].type==l&&r[j].belongsTo==o[i]&&(n.push(o[i]),e.addWithUpdate(r[j]),notFound=!1),j+=1;if($.inArray(o[i],t)==-1)for(j=0,notFound=!0;j<r.length&&notFound;)r[j].type==a&&r[j].objId==o[i]&&(t.push(o[i]),e.addWithUpdate(r[j]),notFound=!1),j+=1}for(i=0;i<n.length;i++){if($.inArray(n[i],o)==-1)for(j=0,notFound=!0;j<r.length&&notFound;)r[j].type==c&&r[j].belongsTo==n[i]&&(o.push(n[i]),e.addWithUpdate(r[j]),notFound=!1),j+=1;if($.inArray(n[i],t)==-1)for(j=0,notFound=!0;j<r.length&&notFound;)r[j].type==a&&r[j].objId==n[i]&&(t.push(n[i]),e.addWithUpdate(r[j]),notFound=!1),j+=1}for(i=0;i<t.length;i++){if($.inArray(t[i],o)==-1)for(j=0,notFound=!0;j<r.length&&notFound;)r[j].type==c&&r[j].belongsTo==t[i]&&(o.push(t[i]),e.addWithUpdate(r[j]),notFound=!1),j+=1;if($.inArray(t[i],n)==-1)for(j=0,notFound=!0;j<r.length&&notFound;)r[j].type==l&&r[j].belongsTo==t[i]&&(n.push(t[i]),e.addWithUpdate(r[j]),notFound=!1),j+=1}}function mouseOut(){log.info("Entering mouseOut"),contextmenuon=!0,canvas.renderAll(),log.info("Leaving mouseOut")}function mouseOver(e){log.info("Entering mouseOver"),contextmenuon=!1,activeObjectVal=e.target,e.target&&"line"==e.target.type&&(log.debug("Target is line"),searchId=getItemIndex(e.target),log.trace(e.target),canvas.setActiveObject(canvas.item(searchId))),log.info("Leaving mouseOver")}function postProcessLoading(e,t){log.info("Entering postProcessLoading"),"custom-image"==t.type&&(log.debug("Processing custom-image"),t.on("mousedown",function(e,t){imageobject.imageDown(e,t)})),"circle"==t.type&&circleobject.postprocessLoading(t),"circleone"==t.type&&(log.debug("Processing circleone"),t.hasBorders=t.hasControls=!1),"circlezero"==t.type&&(log.debug("Processing circleone"),t.hasBorders=t.hasControls=!1),"ellipse"==t.type&&(log.debug("Processing ellipse"),t.fill=void 0,t.on("mousedown",function(e,t){ellipseobject.ellipseDown(e,t)})),"rect"==t.type&&(log.debug("Processing rect"),t.fill=void 0,t.on("mousedown",function(e,t){rectobject.rectangleDown(e,t)})),"customline"==t.type&&(log.debug("Processing customline"),t.hasControls=!1,t.on("mousedown",function(e,t){lineDown(e,t)})),"i-text"==t.type&&(log.debug("Processing i-text"),t.on("mousedown",function(e,t){textobject.textDown(e,t)})),backgroundImageVal="",null!==canvas.backgroundImage&&(backgroundimg=canvas.backgroundImage,console.log("drawing_scripts: ",backgroundimg),null!==backgroundimg.src&&(backgroundImageVal=canvas.backgroundImage.src)),log.info("Leaving postProcessLoading")}function handleDragStart(){log.info("Entering handleDragStart"),[].forEach.call(images,function(e){e.classList.remove("img_dragging")}),this.classList.add("img_dragging"),log.info("Leaving handleDragStart")}function makeLine(e,t){lineobject.makeLine(e,t)}function makeCircleShape(e,t){circleobject.makeCircleShape(e,t)}function activateColorPicker(){log.info("Entering activateColorPicker"),activeObjectValCP=activeObjectVal,document.getElementById("myColor").color.showPicker(),log.info("Leaving activateColorPicker")}function colorPickerChange(e){console.log("Entering colorPickerChange"),log.debug("newLineColor: ",e),canvas.getActiveObject()&&(console.log("activeObjectVal: ",canvas.getActiveObject()),console.log("type: ",canvas.getActiveObject().type),valType=canvas.getActiveObject().type,valType&&(log.trace("activeObjectVal.type: ",valType),"customline"==valType|"customlinearrow"==valType|"customlinetwoarrow"==valType&&(canvas.getActiveObject().set("fill",e),canvas.getActiveObject().set("stroke",e)),"circle"==valType|"ellipse"==valType|"rect"==valType&&(log.debug("colorPickerChange on circle type"),canvas.getActiveObject().set("stroke",e)),"i-text"==valType&&(console.log("colorPickerChange on i-text type"),canvas.getActiveObject().setColor(e)))),canvas.renderAll(),log.info("Leaving colorPickerChange")}function changeFontSize(e){var t=canvas.getActiveObject();"i-text"==t.type&&(t.set("fontSize",e),canvas.renderAll()),$("#saveMessage").text("Changes Made, Save Pending..."),onSave()}function changeFontFamily(e){var t=canvas.getActiveObject();"i-text"==t.type&&(console.log("changeFontFamily on i-text type"),t.set("fontFamily",e),canvas.renderAll()),$("#saveMessage").text("Changes Made, Save Pending..."),onSave()}function handleDragOver(e){return log.info("Entering handleDragOver"),e.preventDefault&&e.preventDefault(),e.dataTransfer.dropEffect="copy",log.info("Leaving handleDragOver"),!1}function handleDragEnter(){log.info("Entering handleDragEnter"),this.classList.add("over"),log.info("Leaving handleDragEnter")}function handleDragLeave(){log.info("Entering handleDragLeave"),this.classList.remove("over"),log.info("Leaving handleDragLeave")}function sendBackward(){log.info("Entering sendBackward");var e=canvas.getActiveObject();e&&canvas.sendBackwards(canvas.getActiveObject(),!0),$("#contextMenu").remove(),contextmenuon=!1,activeObject=!1,canvas.deactivateAll().renderAll(),log.info("Leaving sendBackward")}function sendToBack(){log.info("Entering sendToBack");var e=canvas.getActiveObject();e&&canvas.sendToBack(canvas.getActiveObject()),$("#contextMenu").remove(),contextmenuon=!1,activeObject=!1,canvas.deactivateAll().renderAll(),log.info("Leaving sendToBack")}function bringFoward(){log.info("Entering bringFoward");var e=canvas.getActiveObject();e&&canvas.bringForward(e),$("#contextMenu").remove(),contextmenuon=!1,activeObject=!1,canvas.deactivateAll().renderAll(),log.info("Leaving bringFoward")}function bringToFront(){log.info("Entering bringToFront");var e=canvas.getActiveObject();e&&canvas.bringToFront(e),$("#contextMenu").remove(),contextmenuon=!1,activeObject=!1,canvas.deactivateAll().renderAll(),log.info("Leaving bringToFront")}function lineDown(e,t){lineobject.lineDown(e,t)}function lineArrowTwoDown(e,t){customlinetwoarrow.lineArrowTwoDown(e,t)}function circleDown(e,t){circleobject.circleDown(e,t)}function handleDrop(e){log.info("Entering handleDrop"),$("#saveMessage").text("Changes Made, Save Pending...");var t=document.querySelector("#images img.img_dragging");console.log(t),t.height=t.height,t.width=t.width,log.trace("Draggable Stage:",t);if(e.stopPropagation&&e.stopPropagation(),null!=t){var o=t.getAttribute("img_val");if(log.debug("imgsrc_val: ",o),"line.png"==o)lineobject.lineDrop(e,id);else if("line_arrow_icon.png"==o)customlinearrow.linearrowdrop(e,id);else if("line_arrow_two_icon.png"==o)customlinetwoarrow.lineDrop(e,id);else if("circle_icon.png"==o)circleobject.circledrop(e,id);else if("ellipse_icon.png"==o)ellipseobject.ellipsedrop(e,id);else if("rectangle-icon.png"==o)rectobject.rectdrop(e,id);else if("textbox_icon.png"==o){log.debug("In textbox_icon.png section");var n=new fabric.IText("Tap and Type",{fontFamily:"arial black",fontSize:12,left:e.layerX,top:e.layerY});n.hasBorders=n.hasControls=!0,n.id=itemId,itemId+=1,canvas.add(n),n.on("mousedown",function(e,t){textobject.textDown(e,t)})}else{log.debug("In drag down else category");var i=new fabric.CustomImage(t,{width:t.width,height:t.height,left:e.layerX,top:e.layerY,config:"undefined",origloc:"undefined"});t.hasAttribute("data-config")?(log.debug("Has data-config"),i.configdbid=t.getAttribute("data-config"),log.debug("data-config: ",i.configdbid)):i.configdbid=!1,t.hasAttribute("data-model")?(log.debug("Has data-model"),i.model=t.getAttribute("data-model"),log.debug("data-model: ",i.model)):i.model=!1,t.hasAttribute("data-loc")?(log.debug("Has data-loc"),i.origloc=t.getAttribute("data-loc"),log.debug("data-loc: ",i.origloc)):i.origloc=!1,i.id=itemId,i.setSrc("/assets/"+i.origloc,function(e){log.debug("Object"),log.debug("In callback for setSrc function"),log.trace(e)},{height:t.height,width:t.width}),i.setCoords(),log.debug("--- newImage.src ------"),log.debug("src:",i.getSrc()),log.debug("Height",i.getHeight()),log.debug("Width",i.getWidth()),itemId+=1,i.on("mousedown",function(e,t){imageobject.imageDown(e,t)}),canvas.add(i),canvas.renderAll()}return this.classList.remove("over"),onSave(),!1}onSave(),log.info("Leaving handleDrop")}function contextMenu(e){log.info("Entering contextMenu");var t=e.offsetX,o=e.offsetY;return $.each(canvas._objects,function(e,n){var i=n.width/2,r=n.height/2;if(t>=n.left-i&&t<=n.left+i&&o>=n.top-r&&o<=n.top+r)return!1}),log.info("Leaving contextMenu"),!1}function menus(e,t){log.info("Entering menus");var o="";if(0==contextmenuon){var n=document.createElement("div");n.id="contextMenu";var i="<ul class='dropdown-menu' role='menu' style='display:block;position:static;' >";for(index=0;index<e.length;index++)i+="<li> <a tabindex=''-1'>"+e[index]+"</a> </li>";i+="</ul>",n.innerHTML=i,$("body").append(n),o=$("#contextMenu"),o.css({display:"block",left:t.pageX,top:t.pageY})}else log.info("Menu Not Displayed contextmenu is true");log.info("Leaving menus")}function textmenus(e,t){log.info("Entering textmenus");var o="";if(0==contextmenuon){var n=document.createElement("div");n.id="contextMenu";var i="<ul class='dropdown-menu' role='menu' style='display:block;position:static;' >";for(index=0;index<e.length;index++)i+="<li> <a tabindex=''-1'>"+e[index]+"</a> </li>";i+='<li role="separator" class="divider"></li>',i+='<li class="dropdown dropdown-submenu"><a href="#" class="dropdown-toggle" data-toggle="dropdown">Font Size</a>',i+='   <ul class="dropdown-menu sub-menu">',i+="     <li><a tabindex=''-1'>Large</a></li>",i+="     <li><a tabindex=''-1'>Medium</a></li>",i+="     <li><a tabindex=''-1'>Small</a></li>",i+="   </ul>",i+="</li>",i+='<li class="dropdown dropdown-submenu"><a href="#" class="dropdown-toggle" data-toggle="dropdown">Font Family</a>',i+='   <ul class="dropdown-menu sub-menu">',i+="     <li><a tabindex=''-1'>Arial</a></li>",i+="     <li><a tabindex=''-1'>Sans-Serif</a></li>",i+="     <li><a tabindex=''-1'>Rockwell</a></li>",i+="   </ul>",i+="</li>",i+="</ul>",n.innerHTML=i,$("body").append(n),o=$("#contextMenu"),o.css({display:"block",left:t.pageX,top:t.pageY})}else log.info("Menu Not Displayed contextmenu is true");log.info("Leaving textmenus")}function handleDragEnd(){log.info("Entering handleDragEnd"),[].forEach.call(images,function(e){e.classList.remove("img_dragging")}),log.info("Leaving handleDragEnd")}function drawAsPNG(){return log.info("Entering drawAsPNG"),canvas.isDrawingMode=!1,window.localStorage?(window.open(canvas.toDataURL("png")),void log.info("Leaving drawAsPNG")):void alert("This function is not supported by your browser.")}function getItemIndex(e){for(log.info("Entering getItemIndex"),id=e.id,index=0,objectList=canvas.getObjects(),i=0;i<objectList.length;i++)objectList[i].id==id&&(index=i);return log.info("Leaving getItemIndex"),index}function calcArrowAngle(e,t,o,n){var i,r,a=0;return i=o-e,r=n-t,a=0===i?0===r?0:r>0?Math.PI/2:3*Math.PI/2:0===r?i>0?0:Math.PI:i<0?Math.atan(r/i)+Math.PI:r<0?Math.atan(r/i)+2*Math.PI:Math.atan(r/i),180*a/Math.PI}var id=0;