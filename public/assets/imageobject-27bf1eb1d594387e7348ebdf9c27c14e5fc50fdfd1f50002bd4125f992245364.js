var imageobject=function(){};imageobject.imageDown=function(e){log.info("Entering imageDown"),""!=handler&&document.removeEventListener("contextmenu",handler),activeObjectVal&&(activeObject=!0),3==e.e.which&&(handler=function(e){if(0==contextmenuon&&1==activeObject){if(e.preventDefault(),log.trace("ActiveObjectVal: ",activeObjectVal),log.trace("Has configdbid property: ",activeObjectVal.hasOwnProperty("configdbid")),0!=activeObjectVal.configdbid)var n=["Configure","Delete","Send To Back","Send Backward","Bring Forward","Bring To Front"];else var n=["Delete","Send To Back","Send Backward","Bring Forward","Bring To Front"];angular.element(document.querySelector('[ng-controller="ModalProductConfigController as mpc"]')).scope().mpc.deleteAction=function(){log.debug("imageDown: In Delete"),log.trace(activeObjectVal),canvas.remove(activeObjectVal),$("#contextMenu").remove(),contextmenuon=!1,activeObject=!1},angular.element(document.querySelector('[ng-controller="ModalProductConfigController as mpc"]')).scope().mpc.configureAction=function(){console.log("mpc.open");var e=getItemIndex(activeObjectVal);canvas.setActiveObject(canvas.item(e));var n=activeObjectVal.configdbid;document.getElementById("data").innerHTML="";var t=!1,o="",c=canvas.item(e).config;void 0!=c&&(log.info("Object Config is Defined: ",c),t=!0,o=c.split("-")),angular.element(document.querySelector('[ng-controller="ModalProductConfigController as mpc"]')).scope().mpc.open(company_id,n,t,o,e,canvas),$("#contextMenu").remove(),contextmenuon=!1,activeObject=!1},menus(n,e),contextmenuon=!0}}),document.addEventListener("contextmenu",handler,!1),log.info("Leaving imageDown")};