var textobject=function(){};textobject.textDown=function(n){log.info("Entering textDown"),""!=handler&&document.removeEventListener("contextmenu",handler),activeObjectVal&&(activeObject=!0),3==n.e.which&&(handler=function(n){if(0==contextmenuon&&1==activeObject){n.preventDefault();var e=["Delete Text","Change Color","Send Backward","Send To Back","Bring Forward","Bring To Front"];textmenus(e,n),$('a:contains("Delete")').click(function(){log.debug("textDown: In Delete"),activeObjectVal=canvas.getActiveObject(),log.trace(activeObjectVal),canvas.remove(activeObjectVal),$("#contextMenu").remove(),contextmenuon=!1,activeObject=!1}),$('a:contains("Change Color")').click(function(){activateColorPicker(n),$("#contextMenu").remove(),contextmenuon=!1,activeObject=!1}),$('a:contains("Send Backward")').click(function(){sendBackward()}),$('a:contains("Send To Back")').click(function(){sendToBack()}),$('a:contains("Bring Forward")').click(function(){bringFoward()}),$('a:contains("Bring To Front")').click(function(){bringToFront()}),$('a:contains("Small")').click(function(){changeFontSize(6)}),$('a:contains("Medium")').click(function(){changeFontSize(12)}),$('a:contains("Large")').click(function(){changeFontSize(24)}),$('a:contains("Arial")').click(function(){changeFontFamily("arial black")}),$('a:contains("Sans-Serif")').click(function(){changeFontFamily("sans-serif")}),$('a:contains("Rockwell")').click(function(){changeFontFamily("rockwell")}),contextmenuon=!0}}),document.addEventListener("contextmenu",handler,!1),log.info("Leaving textDown")};