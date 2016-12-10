angular.module('app')
.controller('VersionsController',['$scope',
   function ($scope) {
      var vc = this;

      vc.toggle_versions_pane = function()
      {
         var effect = 'slide';
         // Set the options for the effect type chosen
         var options = { direction: 'right' };
         // Set the duration (default: 400 milliseconds)
         var duration = 500;
         $('#versionspanel').toggle(effect, options, duration);
      }


}]);
