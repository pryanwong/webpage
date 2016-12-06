angular.module('app').directive('iconDirective', ['$compile', function ($compile) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                data: '=iconDirective'
            },
            template: '<tr>' +
                         '<td>' +
                            '<img ng-src="{{data[0].image_tag}}" img_val="{{data[0].img_val}}" data-config="{{data[0].data_config}}"'+
                                    'data-loc="{{data[0].data_loc}}" data-model="{{data[0].data_model}}" draggable="{{data[0].draggable}}"'+
                                    'width={{data[0].width}} height ={{data[0].height}}/>'+
                            '<figcaption>{{data[0].caption}}</figcaption>' +
                         '</td>' +
                         '<td ng-if="data.length==2">' +
                            '<img ng-src="{{data[1].image_tag}}" img_val="{{data[1].img_val}}" data-config="{{data[1].data_config}}"'+
                                    'data-loc="{{data[1].data_loc}}" data-model="{{data[1].data_model}}" draggable="{{data[1].draggable}}"'+
                                    'width={{data[1].width}} height ={{data[1].height}}/>'+
                            '<figcaption>{{data[1].caption}}</figcaption>' +
                         '</td>' +
                      '</tr>',
            link: function (scope, el, attrs, ctrl) {
              scope.$evalAsync(function() {

                  var imagetags1 = angular.element(el.find('img')[0]);
                  var list = [];
                  if (data.length == 2) {
                     var imagetags2 = angular.element(el.find('img')[1]);
                     list = [imagetags1, imagetags2]
                  } else {
                     list = [imagetags1]
                  }
                  for (var i = 0; i < list.length; i++) {
                     list[i].bind("dragstart", function () {
                        log.info( "Entering handleDragStart");
                        this.classList.remove('img_dragging');
                        this.classList.add('img_dragging');
                        log.info( "Leaving handleDragStart");
                     });

                    list[i].bind("dragend", function() {
                       log.info( "Entering handleDragEnd");
                       this.classList.remove('img_dragging');
                       log.info( "Leaving handleDragEnd");
                     });
                  }
              });

            }
        };
    }]);
