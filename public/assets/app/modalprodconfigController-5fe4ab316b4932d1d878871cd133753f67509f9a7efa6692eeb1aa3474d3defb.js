angular.module("app").controller("ModalProductConfigController",["$uibModal","$compile","$log","$document","$scope",function(n,o,e,t,l){function i(o,l){var i=l?angular.element(t[0].querySelector(".product-config-modal"+l)):void 0;console.log(i),console.log("In open");var a=n.open({animation:c.animationsEnabled,ariaLabelledBy:"modal-title",ariaDescribedBy:"modal-body",templateUrl:"productConfigTmpl.html",controller:"ModalProductConfigInstanceCtrl",controllerAs:"mpc",size:o,appendTo:i});a.result.then(function(){},function(){e.info("Modal dismissed at: "+new Date)})}var c=this;c.open=i,c.animationsEnabled=!0,c.init=function(n,o){c.company_id=n,c.product_id=o},c.deleteAction="",c.configureAction="",c.menuFn=function(n,o){c.menus(n,o,"false")},c.menus=function(n,e,t){textmenu=t,console.log('"'+n.join('","')+'"'),console.log(e.pageX),console.log(e.pageY),$("#mpc_holder").append(o('<contextmenu id="contextMenu" textmenu="'+textmenu+'" configureobj="mpc.configureAction()" deleteobj="mpc.deleteAction()" style="display:block;left:'+e.pageX+"px;top:"+e.pageY+'px" items="[\''+n.join("','")+'\']" x="'+e.pageX+'" y="'+e.pageY+'"></contextmenu>')(l))},c.closeModal=function(){c.cancel()},c.openComponentModal=function(){var o=n.open({animation:c.animationsEnabled,component:"modalProdcutConfigComponent"});o.result.then(function(n){c.selected=n},function(){})},c.toggleAnimation=function(){c.animationsEnabled=!c.animationsEnabled}}]),angular.module("app").controller("ModalProductConfigInstanceCtrl",["$scope","$uibModalInstance",function(n,o){var e=this;e.load=function(){console.log("Running load inside ModalProductConfigInstanceCtrl")},e.ok=function(){o.close(mc.selected.item)},e.cancelWithBackground=function(){o.dismiss("cancel")},e.cancel=function(){o.dismiss("cancel")}}]),angular.module("app").component("modalProdcutConfigComponent",{templateUrl:"productConfigTmpl.html",bindings:{resolve:"<",close:"&",dismiss:"&"},controller:function(){var n=this;n.$onInit=function(){},n.ok=function(){},n.cancel=function(){n.dismiss({$value:"cancel"})}}});