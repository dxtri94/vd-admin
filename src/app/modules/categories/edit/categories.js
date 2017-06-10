angular.module('modules.categories.edit', [])
  .controller('EditCategoriesCtrl', EditCategoriesCtrl);

EditCategoriesCtrl.$injector = ['$rootScope', '$scope', '$uibModelInstance', '$categories', 'Categories', 'Errors', 'Utilities'];
function EditCategoriesCtrl($rootScope, $scope, $uibModalInstance, $categories, Categories, Errors, Utilities) {
  var vm = this;

  // variables
  vm.error = null;
  vm.categories = null;

  // methods
  vm.init = init;
  vm.edit = edit;
  vm.close = close;
vm.edit = edit;
  // start
  vm.init();

  // fn initial
  function init() {
    vm.categories = {};
  }

  // fn edit user
  function edit() {

    return Categories.put($categories.id, vm.categories)
      .then(function (res) {
        vm.close();
        $rootScope.$broadcast('categories:updated');
      }, function (error) {
        vm.error = {};
        // Errors.categories(error.errors, vm.error);
        console.log(error);
      });
  }

  // fn close popup
  function close() {
    $uibModalInstance.dismiss('cancel');
  }
}
