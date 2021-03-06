angular.module('modules.categories.add', [])
  .controller('AddproductCtrl', AddproductCtrl);

AddproductCtrl.$injector = ['$rootScope', '$scope', '$uibModalInstance', 'Product', '$categories', '$collections', 'Errors', 'Utilities'];
function AddproductCtrl($rootScope, $scope, $uibModalInstance, Product, $categories, $collections, Errors, Utilities) {
  var vm = this;

  // variables
  vm.source = null;
  vm.product = null;
  vm.categories = null;
  vm.collections = null;

  // methods
  vm.init = init;
  vm.save = save;
  vm.close = close;

  $scope.$watch('vm.source', function () {
    console.log(vm.source);
  });

  // start
  vm.init();

  // fn initial
  function init() {
    vm.product = {};
    vm.categories = $categories.data;
    vm.collections = $collections.data;
  }

  // fn reset password
  function save() {

    return Product.post(vm.product)
      .then(function (res) {

        $rootScope.$broadcast('product:created');

        if (vm.source) {
          vm.upload(res.id);
        } else {
          vm.close();
        }

      }, function (error) {
        vm.errors = {};
        Errors.user(error.errors, vm.error);
      });
  }

  // fn close popup
  function close() {
    $uibModalInstance.dismiss('cancel');
  }
}
