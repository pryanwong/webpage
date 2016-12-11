angular.module('app').service('backgroundAService', function() {
    this.backgroundImg = "";
    this.imageSrc = "";
});

angular.module('app').directive('backgroundbuttonDirective',  ['backgroundAService', function (backgroundAService) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
              openModal:'&',
              background:'@'
            },
            template: '<button id="backgroundButtonText" class="btn btn-default" background="" >{{backgroundText}}</button>',
            link: function (scope, el, attrs, ctrl) {
              scope.backgroundText="Background";
              scope.$watch(function() {
                 if (el.attr('background')) console.log('background changed');
              });

              backgroundExists = function(link) {

                log.info("In background exists:", link)
                 var background_exists = false;
                 if (link === undefined || link === "") {
                    background_exists = false;
                    log.debug("Using Background Button");
                    backgroundText="Background";
                 } else {
                    background_exists = true;
                    log.debug("Using Remove Background Button");
                    backgroundText="Remove Background";
                 }
                 log.info("Leaving Background Exists")
                 return background_exists;
              }

              backgroundModal = function() {
                log.info( "Entering backgroundModal");
                //$('#backgroundSection').modal('show');
                log.infog(scope.openModal);
                scope.openModal();
                log.info( "Leaving backgroundModal");
              };

              runBackground = function() {
                log.info("In Run Background")
                $('#lefile').value = '';
                $("#backgroundfile").val('');
                //submitButton.removeAttr('disabled');
                var progressBar  = $("#bar");
                progressBar.addClass("progress-success");
                progressBar.text('0%');
                progressBar.attr('value','0');
                return false;
              };

              function removeBackground() {
                 $("#saveMessage").text('Changes Made, Save Pending...');
                 $('#lefile').attr("value", "");
                 $('#lefile').val("");
                 canvas.setBackgroundImage(0, canvas.renderAll.bind(canvas));
                 onSave();
              }

              function backgroundButton( background )
              {
                 if (background) {
                   $("#backgroundButtonText").html('Remove Background');
                 } else {
                   $("#backgroundButtonText").html('Background');
                 }
              }

             $(window).load(function() {
                 backgroundImageVal = "";
                if (canvas.backgroundImage !== null) {
                  backgroundimg = canvas.backgroundImage;
                  log.info("drawing_scripts: ", backgroundimg)
                  if (backgroundimg.src !== null ) {
                     backgroundImageVal = canvas.backgroundImage.src;
                  }
                }
                $('#backgroundButtonText').attr('background',backgroundImageVal);
                log.info("In link background val: ", el.attr('background'))
                backgroundExists(el.attr('background'));
             });

             el.bind("click", function () {
                 log.info("background val: ", el.attr('background'))
                 if (el.attr('background') == '') {
                         runBackground();
                         backgroundModal();
                         backgroundButton(true);
                         return false;
                 } else {
                         removeBackground();
                         backgroundButton(false);
                         attrs.$set('background','');
                         return false;
                 }
             });

            }

        };
}]);
