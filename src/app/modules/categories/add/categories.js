angular.module('modules.categories.add', [])
  .controller('AddCategoriesCtrl', AddCategoriesCtrl);

AddCategoriesCtrl.$injector = ['$rootScope', '$scope', '$uibModalInstance', 'Categories', 'Errors', 'Utilities'];
function AddCategoriesCtrl($rootScope, $scope, $uibModalInstance, Categories, Errors, Utilities) {
  var vm = this;

  // variables
  vm.source = null;
  vm.categories = null;

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
    vm.categories = {};
  }

  // fn reset password
  function save() {

    return Categories.post(vm.categories)
      .then(function (res) {

        $rootScope.$broadcast('categories:created');

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
