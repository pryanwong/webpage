angular.module('app')
.controller('ModalController',['$uibModal','$log','$document','$scope',
   function ($uibModal, $log, $document,$scope) {

     $scope.fileNameChanged = function() {
      alert($scope.file.name);
     }

     $scope.file = "";

      var mc = this;
      mc.open = open;

      mc.animationsEnabled = true;

      mc.init = function(company_id, user_id, drawing_id)
        {
          //This function is sort of private constructor for controller
          mc.company_id = company_id;
          mc.user_id = user_id;
          mc.drawing_id = drawing_id;
          //Based on passed argument you can make a call to resource
          //and initialize more objects
          //$resource.getMeBond(007)
        };

      mc.actionLink = function() {
        val = '/companies/' + mc.company_id +'/users/' + mc.user_id + '/drawings/' + mc.drawing_id + '/updateBackground';
        return val;
      };

      mc.closeModal = function() {
        $('backgroundButtonText').html('Background');
        mc.cancel();
      }

      function open(size, parentSelector) {
        var parentElem = parentSelector ?
           angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        console.log(parentElem);
        console.log("In open")
        var modalInstance = $uibModal.open({
          animation: mc.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'fileUploadContent.html',
          controller: 'ModalInstanceCtrl',
          controllerAs: 'mc',
          size: size,
          appendTo: parentElem
      });

      modalInstance.result.then(function () {
        }, function () {
           $log.info('Modal dismissed at: ' + new Date());
        });
      };

      mc.openComponentModal = function () {
          var modalInstance = $uibModal.open({
            animation: mc.animationsEnabled,
            component: 'modalComponent',
          });

          modalInstance.result.then(function (selectedItem) {
            mc.selected = selectedItem;
          }, function () {
            //$log.info('modal-component dismissed at: ' + new Date());
          });
        };

        mc.toggleAnimation = function () {
          mc.animationsEnabled = !mc.animationsEnabled;
        };
}]);

      // Please note that $uibModalInstance represents a modal window (instance) dependency.
      // It is not the same as the $uibModal service used above.

angular.module('app').controller('ModalInstanceCtrl', ['$scope','$uibModalInstance', function ($scope, $uibModalInstance) {
        var mc = this;
        mc.file = "";

        add = function() {

        }
        mc.load = function() {
          $(function() {
             $('.directUpload').find("input:file").each(function(i, elem) {
               console.log("URL directUpload")
               log.debug(form)
               var fileInput    = $(elem);
               log.debug("fileInput")
               log.trace(fileInput)
               var form         = $(fileInput.parents('form:first'));
               var URL_dest = form.data('url') + "/" + form.data('form-data').key
               var submitButton = $('#submitButton');
               var progressBar  = $("#bar");
               progressBar.css('display','none');
               progressBar.css('display','inline');
               fileInput.fileupload({
               add: function(e, data) {
                       var uploadErrors = [];
                       var acceptFileTypes = /^image\/(gif|jpe?g|png)$/i;
                       if(data.files[0]['type'].length && !acceptFileTypes.test(data.files[0]['type'])) {
                           uploadErrors.push('Not an accepted file type');
                       }
                       if(data.files[0]['size'].length && data.files[0]['size'] > 1000000) {
                           uploadErrors.push('Filesize is too big');
                       }
                       if(uploadErrors.length > 0) {
                           alert(uploadErrors.join("\n"));
                       } else {
                           data.submit();
                       }
               },
               fileInput:       fileInput,
               url:             form.data('url'),
               type:            'POST',
               autoUpload:       true,
               formData:         form.data('form-data'),
               paramName:        'file', // S3 does not like nested name fields i.e. name="user[avatar_url]"
               dataType:         'XML',  // S3 returns XML if success_action_status is set to 201
               replaceFileInput: false,
               progressall: function (e, data) {
                  var progress = parseInt(data.loaded / data.total * 100, 10);
                  //progressBar.css('width', progress + '%')
                  $('#progress').show();
                  progressBar.text(progress + '%');
                  progressBar.attr('value',progress);
                  //console.log("Progress: ", progress);
               },
               start: function (e) {
                  //submitButton.attr('disabled', 'disabled');
                  progressBar.addClass('progress-success');
                  log.trace(form);
               },
               done: function(e, data) {
                  $("#saveMessage").text('Changes Made, Save Pending...');
                  submitButton.prop('disabled', false);
                  //progressBar.text("Uploading done");
                  $('#upload_button').removeAttr('disabled');
                  // extract key and generate URL from response
                  var key   = $(data.jqXHR.responseXML).find("Key").text();
                  var url   = '//' + form.data('host') + '/' + key;
                  log.debug("done:key,url")
                  log.debug(key)
                  log.debug(url)
                  // create hidden field
                  var input = $("<input />", { type:'hidden', name: fileInput.attr('name'), value: url })
                  form.append(input);
                  imageURL = "https:" + url;
                  log.debug("imageURL");
                  log.debug(imageURL);
                  canvas.setBackgroundImage(imageURL,
                       canvas.renderAll.bind(canvas), {
                          backgroundImageOpacity: 0.5,
                          backgroundImageStretch: false,
                          scaleX:1,
                          scaleY:1,
                          top: center.top,
                          left: center.left,
                          originX: 'center',
                          originY: 'center',
                          crossOrigin: 'anonymous'
                       }
                  );
                  $('#progress').hide();
                  //submitButton.removeAttr('disabled');
                  //resetFormElement($('#backgroundfile'));
                  //$("#backgroundfile").val("");
                  mc.cancelWithBackground();
                  //backgroundButton(true);
                  onSave();
                },
                fail: function(e, data) {
                  submitButton.prop('disabled', false);
                  progressBar.removeClass('progress-success').addClass('progress-danger');
                }
              });
            });
          });
        }
        mc.ok = function () {
          $uibModalInstance.close(mc.selected.item);
        };

        mc.cancelWithBackground = function() {
          $('#backgroundButtonText').html('Remove Background');
          $('#backgroundButtonText').attr( 'background', mc.file.name )
          $uibModalInstance.dismiss('cancel');
        };
        mc.cancel = function () {
          $('#backgroundButtonText').html('Background');
          $('#backgroundButtonText').attr( 'background', "" )
          $uibModalInstance.dismiss('cancel');
        };

}]).directive('fileChange', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        fileChange: '&'
      },
      link: function link(scope, element, attrs, ctrl) {
            element.on('change', onChange);

            scope.$on('destroy', function () {
              element.off('change', onChange);
            });

            function onChange() {
              attrs.multiple ? ctrl.$setViewValue(element[0].files) : ctrl.$setViewValue(element[0].files[0]);
              scope.$apply(function () {
                 scope.fileChange();
              });
            }
          }
       };
     });
      // Please note that the close and dismiss bindings are from $uibModalInstance.

angular.module('app').component('modalComponent', {
        templateUrl: 'fileUploadContent.html',
        bindings: {
          resolve: '<',
          close: '&',
          dismiss: '&'
        },
        controller: function () {
          var mc = this;

          mc.$onInit = function () {
          };

          mc.ok = function () {
          };

          mc.cancel = function () {
            mc.dismiss({$value: 'cancel'});
          };
        }
});
