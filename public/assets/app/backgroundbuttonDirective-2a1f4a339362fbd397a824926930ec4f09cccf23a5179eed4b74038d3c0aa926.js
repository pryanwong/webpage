angular.module("app").service("backgroundAService",function(){this.backgroundImg="",this.imageSrc=""}),angular.module("app").directive("backgroundbuttonDirective",["backgroundAService",function(){return{restrict:"E",replace:!0,scope:{openModal:"&",background:"@"},template:'<button id="backgroundButtonText" class="btn btn-default" background="" >{{backgroundText}}</button>',link:function(n,o,a){function c(){$("#saveMessage").text("Changes Made, Save Pending..."),$("#lefile").attr("value",""),$("#lefile").val(""),canvas.setBackgroundImage(0,canvas.renderAll.bind(canvas)),onSave()}function r(n){n?$("#backgroundButtonText").html("Remove Background"):$("#backgroundButtonText").html("Background")}n.backgroundText="Background",n.$watch(function(){o.attr("background")&&console.log("background changed")}),backgroundExists=function(n){log.info("In background exists"),console.log("In background exists:",n);var o=!1;return void 0===n||""===n?(o=!1,log.debug("Using Background Button"),backgroundText="Background"):(o=!0,log.debug("Using Remove Background Button"),backgroundText="Remove Background"),log.info("Leaving Background Exists"),o},backgroundModal=function(){console.log("Entering backgroundModal"),console.log(n.openModal),n.openModal(),console.log("Leaving backgroundModal")},runBackground=function(){console.log("In Run Background"),$("#lefile").value="",$("#backgroundfile").val("");var n=$("#bar");return n.addClass("progress-success"),n.text("0%"),n.attr("value","0"),!1},$(window).load(function(){backgroundImageVal="",null!==canvas.backgroundImage&&(backgroundimg=canvas.backgroundImage,console.log("drawing_scripts: ",backgroundimg),null!==backgroundimg.src&&(backgroundImageVal=canvas.backgroundImage.src)),$("#backgroundButtonText").attr("background",backgroundImageVal),console.log("In link background val: ",o.attr("background")),backgroundExists(o.attr("background"))}),o.bind("click",function(){return console.log("background val: ",o.attr("background")),""==o.attr("background")?(runBackground(),backgroundModal(),r(!0),!1):(c(),r(!1),a.$set("background",""),!1)})}}}]);