angular.module("app").controller("IconController",["$scope","iconHub",function(o,n){var e=this;e.jsonObj="",e.jsonObjerror="",e.iconlist=null,e.panelStatus="",e.toggle_versions_pane=function(){var o="slide",n={direction:"right"},e=500;return $("#versionspanel").toggle(o,n,e),!1},e.panelActive=function(o){o==e.panelStatus?e.panelStatus=-1:e.panelStatus=o,console.log(e.panelStatus)},e.loadIcons=function(o){console.log("In loadIcons");e.jsonObj=n.getIconGallery({id:o}),e.jsonObj.$promise.then(function(o){e.jsonObj=o.objects,console.log(o.objects),e.jsonObjerror=!1},function(){e.jsonObjerror=!0,console.log("Error")})}}]);