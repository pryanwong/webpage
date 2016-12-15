var imageobject = function(coords, id) {
};

imageobject.imageDown = function(data,index) {
   log.info( "Entering imageDown");
   //console.log("data", data)
   if (handler != "") {
      document.removeEventListener('contextmenu', handler);
   }
   if (activeObjectVal) {
     activeObject = true;
   }
   if (data.e.which == 3) {
      handler = function(e) {
         if (contextmenuon == false &&  activeObject == true) {
            e.preventDefault();
            log.trace("ActiveObjectVal: ", activeObjectVal);
            log.trace("Has configdbid property: ", activeObjectVal.hasOwnProperty('configdbid'));
            if (activeObjectVal.configdbid != false) {
               var items = ["Configure","Delete", "Send To Back", "Send Backward", "Bring Forward", "Bring To Front"];
            } else {
               var items = ["Delete", "Send To Back", "Send Backward", "Bring Forward", "Bring To Front"];
            }
            angular.element(document.querySelector('[ng-controller="ModalProductConfigController as mpc"]')).scope().mpc.deleteAction = (  function() {log.debug("imageDown: In Delete");
                                               log.trace(activeObjectVal);
                                               canvas.remove(activeObjectVal);
                                               $('#contextMenu').remove();
                                               contextmenuon = false;
                                               activeObject = false;}   );
            angular.element(document.querySelector('[ng-controller="ModalProductConfigController as mpc"]')).scope().mpc.configureAction = ( function() {
                                                   var productId = activeObjectVal.configdbid
                                                   var companyId = 1
                                                   searchId = getItemIndex(activeObjectVal)
                                                   canvas.setActiveObject(canvas.item(searchId))
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
                                                                   loadConfigScreen( data, selectChoices, splitVals );
                                                                   log.trace(data)
                                                                   log.info( "Ajax Call is Success");
                                                                },
                                                         error: function(data, textStatus) {
                                                                log.trace(data);
                                                                alert(textStatus);
                                                                log.info( textStatus);
                                                                }
                                                        });
                                                   $('#contextMenu').remove();
                                                   contextmenuon = false;
                                                   activeObject = true;
                                                });
            menus(items, e);
            contextmenuon = true;
        };
     };
   };
   document.addEventListener('contextmenu', handler, false);
   log.info( "Leaving imageDown");
};
