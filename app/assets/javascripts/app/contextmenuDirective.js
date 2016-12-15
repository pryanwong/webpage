angular.module('app').directive('contextmenu', function ($compile) {
        return {
            restrict: 'E',
            scope: {
              items: '=',
              x: '@',
              y: '@',
              deleteobj: '&',
              configureobj: '&',
              textmenu: '@'
            },
            template: '<div id="contextmenudiv" style="display:block;left:{{x}}px;top:{{y}}px">' +
                         '<ul class="dropdown-menu" role="menu" style="display:block;position:static;" >' +
                             '<li ng-repeat="x in items" id="li_{{x}}"> <a tabindex="-1" id="{{x}}">{{x}}</a> </li>',
            link: function (scope, el, attrs, ctrl) {
              console.log("scope:",scope)
              el.css({'left': scope.x, 'top': scope.y});
              if (textmenu == "true") {
                //var lastitem = document.getElementById("li_Bring To Front");
                var children = el.children();
                //var wrappedTextResult = angular.element(lastitem);
                var html = "";
                html+= '<li role="separator" class="divider"></li>'
                html+='<li class="dropdown dropdown-submenu"><a href="#" class="dropdown-toggle" data-toggle="dropdown">Font Size</a>'
                html+='   <ul class="dropdown-menu sub-menu">'
                html+='     <li><a id="Large" tabindex="-1">Large</a></li>'
                html+='     <li><a id="Medium" tabindex="-1">Medium</a></li>'
                html+='     <li><a id="Small" tabindex="-1">Small</a></li>'
                html+="   </ul>"
                html+="</li>"
                html+='<li class="dropdown dropdown-submenu"><a href="#" class="dropdown-toggle" data-toggle="dropdown">Font Family</a>'
                html+='   <ul class="dropdown-menu sub-menu">'
                html+='     <li><a id="Arial" tabindex="-1">Arial</a></li>'
                html+='     <li><a id="Sans-Serif" tabindex="-1">Sans-Serif</a></li>'
                html+='     <li><a id="Rockwell" tabindex="-1">Rockwell</a></li>'
                html+="   </ul>"
                html+="</li>"
                var addelement = angular.element(html);
                el.children(":first").children(":first").append($compile(addelement)(scope))
                console.log("Elements: ", el)
                console.log("Vals: ", el.children(":first").children(":first"))
                //$compile(addelement)(scope);
              }

              var watch = scope.$watch(function() {
                  return el.find('a').length;
                }, function() {
                   // Wait for templates to render
                   scope.$evalAsync(function() {
                    // Finally, directives are evaluated
                    // and templates are renderer here
                      var children = el.find('a');
                      console.log("child: ", children);

                      var result = document.getElementById("Send Backward");
                      var wrappedResult = angular.element(result);
                      wrappedResult.bind('click', (function() {sendBackward();}) );
                      var result2 = document.getElementById("Send To Back");
                      var wrappedResult2 = angular.element(result2);
                      wrappedResult2.bind('click', (function() {sendToBack();}) );
                      var result3 = document.getElementById("Bring To Front");
                      var wrappedResult3 = angular.element(result3);
                      wrappedResult3.bind('click', (function() {bringToFront();}) );
                      var result4 = document.getElementById("Bring Forward");
                      var wrappedResult4 = angular.element(result4);
                      wrappedResult4.bind('click', (function() {bringToFront();}) );

                      var result5 = document.getElementById("Change Color");
                      if (result5 !== null) {
                        var wrappedResult5 = angular.element(result5);
                        wrappedResult5.bind('click', (function() {activateColorPicker("");
                                                                          $('#contextMenu').remove();
                                                                          contextmenuon = false;
                                                                          activeObject = false;}) );
                      }

                      var result6 = document.getElementById("Delete");
                      var wrappedResult6 = angular.element(result6);
                      wrappedResult6.bind('click', (function() {console.log("Delete clicked");scope.deleteobj();}) );

                      var result7 = document.getElementById("Configure");
                      if (result7 !== null) {
                        var wrappedResult7 = angular.element(result7);
                        wrappedResult7.bind('click', (function() {console.log("Configure clicked");scope.configureobj();}) );
                      }
                      if (scope.textmenu == "true") {
                         var result8 = document.getElementById("Large");
                         var wrappedResult8 = angular.element(result8);
                         wrappedResult8.bind('click', (function() {changeFontSize(24);}) );

                         var result9 = document.getElementById("Medium");
                         var wrappedResult9 = angular.element(result9);
                         wrappedResult9.bind('click', (function() {changeFontSize(12);}) );

                         var result10 = document.getElementById("Small");
                         var wrappedResult10 = angular.element(result10);
                         wrappedResult10.bind('click', (function() {changeFontSize(6);}) );

                         var result11 = document.getElementById("Arial");
                         var wrappedResult11 = angular.element(result11);
                         wrappedResult11.bind('click', (function() {changeFontFamily('arial black');}) );

                         var result12 = document.getElementById("Sans-Serif");
                         var wrappedResult12 = angular.element(result12);
                         wrappedResult12.bind('click', (function() {changeFontFamily('sans-serif');}) );

                         var result13 = document.getElementById("Rockwell");
                         var wrappedResult13 = angular.element(result13);
                         wrappedResult13.bind('click', (function() {changeFontFamily('rockwell');}) );

                      }
                   });
              });
            }

        };
});
