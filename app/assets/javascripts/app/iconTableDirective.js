angular.module('app').directive('iconTableDirective', function () {
        return {
            restrict: 'EA',
            replace: true,
            transclude: false,
            scope: {
                data: '=iconTableDirective'
            },
            template: '<div class="panel panel-default">'         +
                         '<div id="panel-heading">'               +
                            '<h4 id="panel-title">'               +
                               '<a data-parent="#accordiontools" data-toggle="collapse" class="" aria-expanded="true" href="#{{data.link}}">{{data.title}}</a>' +
                            '</h4>' +
                         '</div>'   +
                         '<div id="{{data.link}}" class="panel-collapse collapse {{data.in}}">' +
                            '<div id="images" class="panel-body">' +
                               '<table>' +
                                  '<tr "icon-directive"="vals" "ng-repeat"="vals in data.rows"></tr>' +
                               '</table>' +
                            '</div>' +
                         '</div>' +
                      '</div>'
            ,
            link: function ($scope, el, attrs) {

            }
        };
    });
