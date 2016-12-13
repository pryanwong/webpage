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

              scope.$watch('backgroundText',
                 function(newValue) {
                     console.log("watch backround attr:", scope.backgroundText,":", scope.background);
                 }
              );

              scope.$watch('background',
                 function(newValue) {
                     console.log("watch backround attr:", scope.backgroundText,":", scope.background);
                 }
              );

              runBackground = function() {
                console.log("In Run Background")
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
                 $('#backgroundButtonText').attr('background',"");
                 canvas.setBackgroundImage(0, canvas.renderAll.bind(canvas));
                 onSave();
              }

             $(window).load(function() {
                 backgroundImageVal = "";
                 console.log("backgroundImg: ", canvas.backgroundImage)
                if (canvas.backgroundImage !== null) {
                  backgroundimg = canvas.backgroundImage;
                  console.log("drawing_scripts: ", backgroundimg)
                  if (backgroundimg.src !== null ) {
                     backgroundImageVal = canvas.backgroundImage.src;
                     scope.$apply(function() {scope.backgroundText = "Remove Background";});
                  }
                }
                $('#backgroundButtonText').attr('background',backgroundImageVal);
                background = backgroundImageVal
                console.log("In link background val: ", el.attr('background'));
             });

             el.bind("click", function () {
                 console.log("background val: ", el.attr('background'))
                 if (el.attr('background') == '' || el.attr('background') == null) {
                         runBackground();
                         scope.openModal();
                         scope.$apply(function() {scope.backgroundText = "Remove Background";});

                         return false;
                 } else {
                         removeBackground();
                         scope.background = "";
                         scope.$apply(function() {scope.backgroundText = "Background";});
                         attrs.$set('background','');
                         return false;
                 }
             });

            }

        };
}]);
