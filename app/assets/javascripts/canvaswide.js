function textChangedEvent(e) {
  console.log("Text Change Event Fired");
  $("#saveMessage").text('Changes Made, Save Pending...');
  log.debug('text:changed', e.target, e);
  onSave();
};

function objectDeletedEvent(e) {
  $("#saveMessage").text('Changes Made, Save Pending...');
  log.debug('lineDeletedEvent', e.target, e);
  onSave();
};

var onSave  =  debounce(function() {
    log.info( "Entering onSave");
    modified = true;
    // Remove circle0 and circle1 from image
    //$(".spinner").show();
    $("#saveMessage").text('Save In Progress...');

    objects = canvas.getObjects();

    var len = objects.length;
    log.debug( "Number of objects to process: ", len);
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
                   log.debug("Text Msg: ", textMsg)
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
      console.log("data_drawing not blank")
      console.log(data_drawing)
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
              log.debug("customline: ", objs[i])
              log.debug("Item Id of line set to: ", objs[i].getObjId())
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
                   log.debug("found circlezero")
                   foundCircle = foundCircle + 1;

                }
                if (circleProspect.type == "circleone" && circleProspect.belongsTo == objs[i].objId) {
                  circleProspect.hasBorders = circleProspect.hasControls = false;
                  circleProspect.line = objs[i]
                  circleProspect.belongsTo = itemId;
                  objs[i].ctwo = circleProspect
                  circleProspect.set('hoverCursor','crosshair')
                  log.debug("found circleone")
                  foundCircle = foundCircle + 1;
                }
                if (foundCircle == 2) {
                  log.debug("objId: ", objs[i].get('objId'))
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
              log.debug("customline: ", objs[i])
              log.debug("Item Id of line set to: ", objs[i].getObjId())
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
                   log.debug("found conearrow")
                   foundCircle = foundCircle + 1;

                }
                if (circleProspect.type == "carrow" && circleProspect.belongsTo == objs[i].objId) {
                  circleProspect.hasBorders = circleProspect.hasControls = false;
                  circleProspect.line = objs[i]
                  circleProspect.belongsTo = itemId;
                  objs[i].carrow = circleProspect
                  circleProspect.set('hoverCursor','crosshair')
                  log.debug("found carrow")
                  foundCircle = foundCircle + 1;
                }
                if (foundCircle == 2) {
                  log.debug("objId: ", objs[i].get('objId'))
                  objs[i].setObjId(itemId)
                  itemId = itemId + 1;
                  objs[i].conearrow.id = itemId;
                  itemId = itemId + 1;
                  objs[i].carrow.id = itemId;
                  foundCircle = 0;
                }
              });

              objs[i].on("mousedown", function(data, index) { customlinearrow.lineArrowDown(data,index); });
            }

            if (objs[i].type == "customlinetwoarrow")  {
              objs[i].hasControls = false;
              log.debug("customline: ", objs[i])
              log.debug("Item Id of line set to: ", objs[i].getObjId())
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
                   log.debug("found carrowtwo")
                   foundCircle = foundCircle + 1;

                }
                if (circleProspect.type == "carrow" && circleProspect.belongsTo == objs[i].objId) {
                  circleProspect.hasBorders = circleProspect.hasControls = false;
                  circleProspect.line = objs[i]
                  circleProspect.belongsTo = itemId;
                  objs[i].carrow = circleProspect
                  circleProspect.set('hoverCursor','crosshair')
                  log.debug("found carrow")
                  foundCircle = foundCircle + 1;
                }
                if (foundCircle == 2) {
                  log.debug("objId: ", objs[i].get('objId'))
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
      },
      postProcessLoading);

  }
}

function checkBackgroundFileExists( link ) {
  log.info("Entering checkBackgroundFileExists")
  log.debug(link);
  console.log("Checkbackgroundfileexists: ", link)
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
