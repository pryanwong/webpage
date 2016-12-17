 angular.module('app')
.controller('ModalProductConfigController',['$uibModal','$compile', '$log','$document','$scope',
   function ($uibModal, $compile, $log, $document,$scope) {
      var mpc = this;
      mpc.open = open;
      mpc.company_id = "";
      mpc.product_id = "";
      mpc.jsondata = "";
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

      mpc.selectedOption = function(code, index, splitVals, selectChoices)
      {
        var returnVal = "";
        if (selectChoices) {
          if (code == splitVals[index +1]) {
            returnVal = "selected";
          }
        }
        return returnVal
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

      function open(company_id, product_id, selectChoices, splitVals, searchId, canvas, size, parentSelector) {
        var parentElem = parentSelector ? angular.element($document[0].querySelector('.product-config-modal' + parentSelector)) : undefined;
        console.log(parentElem);
        console.log("In open");
        mpc.product_id = product_id;
        mpc.company_id = company_id;
        mpc.selectChoices = selectChoices;
        mpc.splitVals = splitVals;
        mpc.searchId = searchId;
        mpc.canvas = canvas;
        console.log("In open-: ", company_id, ":",product_id);
        console.log("company, product: ",company_id,":",product_id);
        console.log("$scope: ", $scope)
        var modalInstance = $uibModal.open({
          animation: mpc.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'productConfigTmpl.html',
          controller: 'ModalProductConfigInstanceCtrl',
          controllerAs: 'mpc',
          scope: $scope,
          size: size,
          appendTo: parentElem,
          resolve: {
             jsondata: function () {
               return mpc.jsondata;
             }
          }
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
            resolve: {
              jsondata: function () {
                return mpc.jsondata;
              }
            }
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

angular.module('app').controller('ModalProductConfigInstanceCtrl', ['$window','$scope','$uibModalInstance','productConfigHub', function ($window,$scope, $uibModalInstance,productConfigHub) {
        var mpc = this;
        mpc.jsondata = "test2";
        mpc.jsonObjerror = "false";
        mpc.company_id = $scope.$parent.mpc.company_id;
        mpc.product_id = $scope.$parent.mpc.product_id;
        mpc.selectChoices = $scope.$parent.mpc.selectChoices;
        mpc.splitVals = $scope.$parent.mpc.splitVals;
        mpc.searchId = $scope.$parent.mpc.searchId;
        mpc.canvas = $scope.$parent.mpc.canvas;
        mpc.version = "";
        mpc.selection = {
          value: null
        };
        mpc.jsondata = productConfigHub.getProductConfig({ company_id: mpc.company_id, id: mpc.product_id});
        mpc.jsondata.$promise. then(function(result) {
             mpc.jsondata  = result;
             console.log(result)
             mpc.jsondataprice = JSON.parse(mpc.jsondata.price);
             var alength = mpc.jsondataprice.product.options.length;
             mpc.version = JSON.parse(mpc.jsondata.version);
             mpc.jsondataprice.product.price = parseFloat(mpc.jsondataprice.product.basePrice);
             console.log("Base Price: ", mpc.jsondataprice.product.price)
             for (var i=0; i < alength; i++) {
               var slength = mpc.jsondataprice.product.options[i].selections.length;
               mpc.jsondataprice.product.options[i].value = mpc.jsondataprice.product.options[i].selections[0].value
               mpc.jsondataprice.product.options[i].selectedValue = {};
               mpc.jsondataprice.product.options[i].selectedValue.code = mpc.jsondataprice.product.options[i].selections[0].code;
               mpc.jsondataprice.product.options[i].selectedValue.price = mpc.jsondataprice.product.options[i].selections[0].price;
               mpc.jsondataprice.product.options[i].selectedValue.description = mpc.jsondataprice.product.options[i].selections[0].description;
               mpc.jsondataprice.product.price += parseFloat(mpc.jsondataprice.product.options[i].selections[0].price);
               console.log("List Price Outside: ", mpc.jsondataprice.product.options[i].selectedValue.code, "-", mpc.jsondataprice.product.price)
               for (var j=0; j < slength; j++) {
                   console.log("selectChoices", mpc.selectChoices)
                   if (mpc.selectChoices) {
                     console.log("Splitvals: ", mpc.splitVals[i+1])
                     console.log("Code: ", mpc.jsondataprice.product.options[i].selections[j].code)
                     if (mpc.jsondataprice.product.options[i].selections[j].code == mpc.splitVals[i+1]) {
                        mpc.jsondataprice.product.options[i].selectedValue.code = mpc.jsondataprice.product.options[i].selections[j].code;
                        mpc.jsondataprice.product.options[i].selectedValue.price = mpc.jsondataprice.product.options[i].selections[j].price;
                        mpc.jsondataprice.product.options[i].selectedValue.description = mpc.jsondataprice.product.options[i].selections[j].description;
                        if (j!=0) {
                           mpc.jsondataprice.product.price -= parseFloat(mpc.jsondataprice.product.options[i].selections[0].price);
                           mpc.jsondataprice.product.price += parseFloat(mpc.jsondataprice.product.options[i].selections[j].price) ;
                           console.log("List Price SelectedChoices: ", mpc.jsondataprice.product.options[i].selectedValue.code, "-", mpc.jsondataprice.product.price)
                        }
                    }
                   }
               }
             }
             console.log(mpc.jsondataprice)
             mpc.jsonObjerror = false;
         }, function (result) {
             mpc.jsonObjerror = true;
             console.log("Error")
         });

        mpc.change = function(newValue, oldValue) {
          console.log("New Value: ", newValue);
          console.log("Old Value: ", oldValue);
          mpc.jsondataprice.product.price -= parseFloat(oldValue.price);
          mpc.jsondataprice.product.price += parseFloat(newValue.price) ;
        }

        mpc.load = function() {
          console.log("Running load inside ModalProductConfigInstanceCtrl")

        }
        mpc.ok = function () {
          var configString =mpc.jsondataprice.product.name;
          var alength = mpc.jsondataprice.product.options.length;
          //mpc.jsondataprice.product.price = parseFloat(mpc.jsondataprice.product.basePrice);
          console.log(configString)
          for (var i=0; i < alength; i++) {
            configString += '-' + mpc.jsondataprice.product.options[i].selectedValue.code
            console.log(configString)
          }
          console.log("Canvas:", mpc.canvas);
          console.log("Search Id:", mpc.searchId);
          console.log("Item:", canvas.item(mpc.searchId))
          mpc.canvas.item(mpc.searchId).price = mpc.jsondataprice.product.price
          mpc.canvas.item(mpc.searchId).priceversion = mpc.version;
          mpc.canvas.item(mpc.searchId).setConfig(configString);
          console.log("Object Price Change: ", mpc.canvas.item(mpc.searchId))
          canvas.renderAll();
          $uibModalInstance.dismiss('cancel');
        };

        mpc.cancel = function () {
          $uibModalInstance.dismiss('cancel');
        };

        mpc.reset = function () {
          mpc.canvas.item(mpc.searchId).price = "";
          mpc.canvas.item(mpc.searchId).setConfig("undefined");
          mpc.canvas.renderAll();
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
             mpc.jsondata= mpc.resolve.jsondata;
          };

          mpc.ok = function () {
          };

          mpc.cancel = function () {
            mpc.dismiss({$value: 'cancel'});
          };
        }
});
      //$(&quot;#backgroundfile&quot;).val($(this).val());$(&quot;#backgroundButtonText&quot;).attr(&quot;background&quot;,$(this).val());"
