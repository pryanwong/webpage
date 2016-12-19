angular.module("app").controller("ModalController",["$uibModal","$log","$document","$scope",function(e,n,a,o){function t(o,t){var l=t?angular.element(a[0].querySelector(".modal-demo "+t)):void 0;console.log(l),console.log("In open");var r=e.open({animation:i.animationsEnabled,ariaLabelledBy:"modal-title",ariaDescribedBy:"modal-body",templateUrl:"fileUploadContent.html",controller:"ModalInstanceCtrl",controllerAs:"mc",size:o,appendTo:l});r.result.then(function(){},function(){n.info("Modal dismissed at: "+new Date)})}o.fileNameChanged=function(){alert(o.file.name)},o.file="";var i=this;i.open=t,i.animationsEnabled=!0,i.init=function(e,n,a){i.company_id=e,i.user_id=n,i.drawing_id=a},i.actionLink=function(){return val="/companies/"+i.company_id+"/users/"+i.user_id+"/drawings/"+i.drawing_id+"/updateBackground",val},i.closeModal=function(){$("backgroundButtonText").html("Background"),i.cancel()},i.openComponentModal=function(){var n=e.open({animation:i.animationsEnabled,component:"modalComponent"});n.result.then(function(e){i.selected=e},function(){})},i.toggleAnimation=function(){i.animationsEnabled=!i.animationsEnabled}}]),angular.module("app").controller("ModalInstanceCtrl",["$scope","$uibModalInstance",function(e,n){var a=this;a.file="",add=function(){},a.load=function(){$(function(){$(".directUpload").find("input:file").each(function(e,n){console.log("URL directUpload"),log.debug(t);var o=$(n);log.debug("fileInput"),log.trace(o);var t=$(o.parents("form:first")),i=(t.data("url")+"/"+t.data("form-data").key,$("#submitButton")),l=$("#bar");l.css("display","none"),l.css("display","inline"),o.fileupload({add:function(e,n){var a=[],o=/^image\/(gif|jpe?g|png)$/i;n.files[0].type.length&&!o.test(n.files[0].type)&&a.push("Not an accepted file type"),n.files[0].size.length&&n.files[0].size>1e6&&a.push("Filesize is too big"),a.length>0?alert(a.join("\n")):n.submit()},fileInput:o,url:t.data("url"),type:"POST",autoUpload:!0,formData:t.data("form-data"),paramName:"file",dataType:"XML",replaceFileInput:!1,progressall:function(e,n){var a=parseInt(n.loaded/n.total*100,10);$("#progress").show(),l.text(a+"%"),l.attr("value",a)},start:function(){l.addClass("progress-success"),log.trace(t)},done:function(e,n){$("#saveMessage").text("Changes Made, Save Pending..."),i.prop("disabled",!1),$("#upload_button").removeAttr("disabled");var l=$(n.jqXHR.responseXML).find("Key").text(),r="//"+t.data("host")+"/"+l;log.debug("done:key,url"),log.debug(l),log.debug(r);var c=$("<input />",{type:"hidden",name:o.attr("name"),value:r});t.append(c),imageURL="https:"+r,log.debug("imageURL"),log.debug(imageURL),canvas.setBackgroundImage(imageURL,canvas.renderAll.bind(canvas),{backgroundImageOpacity:.5,backgroundImageStretch:!1,scaleX:1,scaleY:1,top:center.top,left:center.left,originX:"center",originY:"center",crossOrigin:"anonymous"}),$("#progress").hide(),a.cancelWithBackground(),onSave()},fail:function(){i.prop("disabled",!1),l.removeClass("progress-success").addClass("progress-danger")}})})})},a.ok=function(){n.close(a.selected.item)},a.cancelWithBackground=function(){$("#backgroundButtonText").html("Remove Background"),$("#backgroundButtonText").attr("background",a.file.name),n.dismiss("cancel")},a.cancel=function(){$("#backgroundButtonText").html("Background"),$("#backgroundButtonText").attr("background",""),n.dismiss("cancel")}}]).directive("fileChange",function(){return{restrict:"A",require:"ngModel",scope:{fileChange:"&"},link:function(e,n,a,o){function t(){a.multiple?o.$setViewValue(n[0].files):o.$setViewValue(n[0].files[0]),e.$apply(function(){e.fileChange()})}n.on("change",t),e.$on("destroy",function(){n.off("change",t)})}}}),angular.module("app").component("modalComponent",{templateUrl:"fileUploadContent.html",bindings:{resolve:"<",close:"&",dismiss:"&"},controller:function(){var e=this;e.$onInit=function(){},e.ok=function(){},e.cancel=function(){e.dismiss({$value:"cancel"})}}});