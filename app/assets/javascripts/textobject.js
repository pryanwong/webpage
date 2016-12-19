var textobject = function() {
};

textobject.textDown = function(data,index) {
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
            var items = ["Delete", "Change Color", "Send Backward", "Send To Back", "Bring Forward", "Bring To Front"];
            angular.element(document.querySelector('[ng-controller="ModalProductConfigController as mpc"]')).scope().mpc.deleteAction = (  function() {log.debug("textDown: In Delete");
                                             var activeObjectVal = getItemByIndex(searchId)
                                             log.trace(activeObjectVal);
                                             canvas.remove(activeObjectVal);
                                             $('#contextMenu').remove();
                                             contextmenuon = false;
                                             activeObject = false;}   );
            updateSearchId(data)
            textmenus(items, e);
            contextmenuon = true;
         };
       }
   }
   document.addEventListener('contextmenu', handler, false);
   log.info( "Leaving textDown");
};
