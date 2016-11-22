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
            var items = ["Delete Text", "Change Color", "Send Backward", "Send To Back", "Bring Forward", "Bring To Front"];
            textmenus(items, e);
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
            $('a:contains("Small")').click(function(){changeFontSize(6);});
            $('a:contains("Medium")').click(function(){changeFontSize(12);});
            $('a:contains("Large")').click(function(){changeFontSize(24);});
            $('a:contains("Arial")').click(function(){changeFontFamily('arial black');});
            $('a:contains("Sans-Serif")').click(function(){changeFontFamily('sans-serif');});
            $('a:contains("Rockwell")').click(function(){changeFontFamily('rockwell');});
            contextmenuon = true;
         };
       }
   }
   document.addEventListener('contextmenu', handler, false);
   log.info( "Leaving textDown");
};
