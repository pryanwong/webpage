function textChangedEvent(o){$("#saveMessage").text("Changes Made, Save Pending..."),log.debug("text:changed",o.target,o),onSave()}function objectDeletedEvent(o){$("#saveMessage").text("Changes Made, Save Pending..."),log.debug("lineDeletedEvent",o.target,o),onSave()}function loadCanvasDrawing(o){""!=o&&(log.debug("data_drawing not blank"),canvas.loadFromJSON(o,function(){canvas.renderAll.bind(canvas);var o=canvas.getObjects().map(function(o){return o.set("active",!1)});log.debug("Entering loop for objects"),log.debug("Loop size: ",o.length);var e=0,n=0;for(i=0;i<o.length;i++)log.debug("Objs Type: ",o[i].type),o[i].id=n,"customline"==o[i].type&&(o[i].hasControls=!1,log.debug("customline: ",o[i]),log.debug("Item Id of line set to: ",o[i].getObjId()),canvas.forEachObject(function(r){log.debug("Object Type: ",r.type),"circlezero"!=r.type&&"circleone"!=r.type||(log.debug("circleProspect.belongsTo: ",r.belongsTo),log.debug("objs[1].objId: ",o[i].objId)),"circlezero"==r.type&&r.belongsTo==o[i].objId&&(r.hasBorders=r.hasControls=!1,r.line=o[i],r.belongsTo=n,o[i].cone=r,r.set("hoverCursor","crosshair"),log.debug("found circlezero"),e+=1),"circleone"==r.type&&r.belongsTo==o[i].objId&&(r.hasBorders=r.hasControls=!1,r.line=o[i],r.belongsTo=n,o[i].ctwo=r,r.set("hoverCursor","crosshair"),log.debug("found circleone"),e+=1),2==e&&(log.debug("objId: ",o[i].get("objId")),o[i].setObjId(n),n+=1,o[i].cone.id=n,n+=1,o[i].ctwo.id=n,e=0)}),o[i].on("mousedown",function(o,e){lineDown(o,e)})),"customlinearrow"==o[i].type&&(o[i].hasControls=!1,log.debug("customline: ",o[i]),log.debug("Item Id of line set to: ",o[i].getObjId()),canvas.forEachObject(function(r){log.debug("Object Type: ",r.type),"carrow"!=r.type&&"conearrow"!=r.type||(log.debug("circleProspect.belongsTo: ",r.belongsTo),log.debug("objs[1].objId: ",o[i].objId)),"conearrow"==r.type&&r.belongsTo==o[i].objId&&(r.hasBorders=r.hasControls=!1,r.line=o[i],r.belongsTo=n,o[i].conearrow=r,r.set("hoverCursor","crosshair"),log.debug("found conearrow"),e+=1),"carrow"==r.type&&r.belongsTo==o[i].objId&&(r.hasBorders=r.hasControls=!1,r.line=o[i],r.belongsTo=n,o[i].carrow=r,r.set("hoverCursor","crosshair"),log.debug("found carrow"),e+=1),2==e&&(log.debug("objId: ",o[i].get("objId")),o[i].setObjId(n),n+=1,o[i].conearrow.id=n,n+=1,o[i].carrow.id=n,e=0)}),o[i].on("mousedown",function(o,e){customlinearrow.lineArrowDown(o,e)})),"customlinetwoarrow"==o[i].type&&(o[i].hasControls=!1,log.debug("customline: ",o[i]),log.debug("Item Id of line set to: ",o[i].getObjId()),canvas.forEachObject(function(r){log.debug("Object Type: ",r.type),"carrow"!=r.type&&"carrowtwo"!=r.type||(log.debug("circleProspect.belongsTo: ",r.belongsTo),log.debug("objs[1].objId: ",o[i].objId)),"carrowtwo"==r.type&&r.belongsTo==o[i].objId&&(r.hasBorders=r.hasControls=!1,r.line=o[i],r.belongsTo=n,o[i].carrowtwo=r,r.set("hoverCursor","crosshair"),log.debug("found carrowtwo"),e+=1),"carrow"==r.type&&r.belongsTo==o[i].objId&&(r.hasBorders=r.hasControls=!1,r.line=o[i],r.belongsTo=n,o[i].carrow=r,r.set("hoverCursor","crosshair"),log.debug("found carrow"),e+=1),2==e&&(log.debug("objId: ",o[i].get("objId")),o[i].setObjId(n),n+=1,o[i].carrowtwo.id=n,n+=1,o[i].carrow.id=n,e=0)}),o[i].on("mousedown",function(o,e){lineArrowTwoDown(o,e)})),n+=1;canvas.renderAll(),backgroundImageVal="",canvas.hasOwnProperty("backgroundImage")&&canvas.backgroundImage.hasOwnProperty("src")&&(backgroundImageVal=canvas.backgroundImage.src),log.debug("BackgroundImage Loc: ",backgroundImageVal),backgroundExists(backgroundImageVal)},postProcessLoading))}function checkBackgroundFileExists(o){log.info("Entering checkBackgroundFileExists"),log.debug(o),$.ajax({url:o,type:"HEAD",error:function(){return log.debug("In Error Function checkBackgroundFileExists"),log.debug("Background File Not Found"),!1},success:function(){return log.debug("In success Function checkBackgroundFileExists"),log.debug("Background File Exists"),!0}}),log.info("Leaving checkBackgroundFileExists")}var onSave=debounce(function(){log.info("Entering onSave"),modified=!0,$("#saveMessage").text("Save In Progress..."),objects=canvas.getObjects();var o=objects.length;log.debug("Number of objects to process: ",o),canvas.renderAll();var e=$('meta[name="csrf-token"]').attr("content");canvas.backgroundColor="";var n={company_id:company_id,user_id:user_id,id:drawing_id,authenticity_token:e,png:"",drawing:canvas};log.trace(n);var r="/companies/"+company_id+"/users/"+user_id+"/drawings/"+drawing_id+".json";$.ajax({url:r,type:"patch",dataType:"json",contentType:"application/json",data:JSON.stringify(n),timeout:3e3,complete:function(){},success:function(o){textMsg=JSON.parse(o[0]),log.debug("Text Msg: ",textMsg),$("#saveMessage").text(textMsg[0]),loadVersionsIntoPanel(o[1])},error:function(o,e){msg="Error: "+e,$("#saveMessage").text(msg)}}),log.info("Leaving onSave")},3e3);