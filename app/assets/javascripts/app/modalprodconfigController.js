angular.module('app')
.controller('ModalProductConfigController',['$uibModal','$compile', '$log','$document','$scope',
   function ($uibModal, $compile, $log, $document,$scope) {
      var mpc = this;
      mpc.open = open;

      mpc.animationsEnabled = true;

      mpc.init = function(company_id, product_id)
        {
          //This function is sort of private constructor for controller
          mpc.company_id = company_id;
          mpc.product_id = product_id;

        };

      mpc.deleteAction = "";
      mpc.configureAction = "";
      mpc.menuFn = function(items_in, event) {
          mpc.menus(items_in, event, "false")
      }

      mpc.menus = function(items_in, event, textmenu_in) {
        textmenu = textmenu_in
        console.log('"' + items_in.join('","') + '"')
        console.log(event.pageX);
        console.log(event.pageY);
        //compile = angular.element($('mpc_holder')).injector().get('$compile')

        $('#mpc_holder').append($compile('<contextmenu id="contextMenu" textmenu="' + textmenu + '" configureobj="mpc.configureAction()" deleteobj="mpc.deleteAction()" style="display:block;left:'+ event.pageX +'px;top:'+ event.pageY +'px" items="['+ "'" + items_in.join("','") + "'" + ']" x="' + event.pageX +'" y="' + event.pageY  +'"></contextmenu>')($scope));
      }
      mpc.closeModal = function() {
        mpc.cancel();
      }

      function open(size, parentSelector) {
        var parentElem = parentSelector ?
           angular.element($document[0].querySelector('.product-config-modal' + parentSelector)) : undefined;
        console.log(parentElem);
        console.log("In open");
        var modalInstance = $uibModal.open({
          animation: mpc.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'productConfigTmpl.html',
          controller: 'ModalProductConfigInstanceCtrl',
          controllerAs: 'mpc',
          size: size,
          appendTo: parentElem
      });

      modalInstance.result.then(function () {
        }, function () {
           $log.info('Modal dismissed at: ' + new Date());
        });
      };

      mpc.openComponentModal = function () {
          var modalInstance = $uibModal.open({
            animation: mpc.animationsEnabled,
            component: 'modalProdcutConfigComponent',
          });

          modalInstance.result.then(function (selectedItem) {
            mpc.selected = selectedItem;
          }, function () {
            //$log.info('modal-component dismissed at: ' + new Date());
          });
        };

        mpc.toggleAnimation = function () {
          mpc.animationsEnabled = !mpc.animationsEnabled;
        };
}]);

      // Please note that $uibModalInstance represents a modal window (instance) dependency.
      // It is not the same as the $uibModal service used above.

angular.module('app').controller('ModalProductConfigInstanceCtrl', ['$scope','$uibModalInstance', function ($scope, $uibModalInstance) {
        var mpc = this;

        mpc.load = function() {
          console.log("Running load inside ModalProductConfigInstanceCtrl")

        }
        mpc.ok = function () {
          $uibModalInstance.close(mc.selected.item);
        };

        mpc.cancelWithBackground = function() {
          $uibModalInstance.dismiss('cancel');
        };
        mpc.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };

}]);

      // Please note that the close and dismiss bindings are from $uibModalInstance.

angular.module('app').component('modalProdcutConfigComponent', {
        templateUrl: 'productConfigTmpl.html',
        bindings: {
          resolve: '<',
          close: '&',
          dismiss: '&'
        },
        controller: function () {
          var mpc = this;

          mpc.$onInit = function () {
          };

          mpc.ok = function () {
          };

          mpc.cancel = function () {
            mpc.dismiss({$value: 'cancel'});
          };
        }
});
      //$(&quot;#backgroundfile&quot;).val($(this).val());$(&quot;#backgroundButtonText&quot;).attr(&quot;background&quot;,$(this).val());"
