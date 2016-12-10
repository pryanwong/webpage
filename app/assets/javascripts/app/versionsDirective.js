angular.module('app').directive('versionsDirective', function () {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
              companyId:'@companyId',
              userId:'@userId',
              drawingId:'@drawingId',
              details:'=versionsDirective'
            },
            template: '<tr style="height: 14px;""> <td> <a href="#" ng-click="loadversion(\'' + '{{drawinglink}}' + '\');">{{details[1]}}</a></td> </tr>',
            link: function (scope, el, attrs, ctrl) {
              console.log(scope.details)
              scope.drawinglink = '/companies/' + scope.companyId + '/users/' + scope.userId + '/drawings/' + scope.drawingId + '/changeversion?version=' + scope.details[0];
              console.log(scope.drawinglink)
            }

        };
});
