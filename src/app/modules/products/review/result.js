angular.module('modules.dispute.result.review', [])
  .controller('ReviewResultCtrl', ReviewResultCtrl);

ReviewResultCtrl.$injector = ['$rootScope', '$scope', '$uibModalInstance', '$result', '$index', 'Errors', 'Utilities'];
function ReviewResultCtrl($rootScope, $scope, $uibModalInstance, $result, $index, Errors, Utilities) {
  var vm = this;

  // variables
  vm.result = null;
  vm.linkPreview = null;
  vm.noImage = 'assets/images/empty.png';

  // methods
  vm.init = init;
  vm.selectImage = selectImage;
  vm.close = close;

  // start
  vm.init();

  // fn initial
  function init() {
    vm.result = $result;

    vm.imagePreview = vm.result.images[0] ? vm.result.images[0].src : null;
  }

  // fn select image
  function selectImage(src) {
    vm.imagePreview = src;
  }

  // fn close popup
  function close() {
    $uibModalInstance.dismiss('cancel');
  }
}
