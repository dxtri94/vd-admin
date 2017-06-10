angular.module('app.header.change-password', [])
  .controller('ChangePasswordCtrl', ChangePasswordCtrl);

// fn change password controller
ChangePasswordCtrl.$injector = ['$rootScope', '$scope', '$uibModalInstance', 'security', '$account', 'Errors', 'Utilities'];
function ChangePasswordCtrl($rootScope, $scope, $uibModalInstance, security, $account, Errors, Utilities) {

  var vm = this;

  // variables
  vm.error = {};
  vm.account = null;

  // methods
  vm.init = init;
  vm.change = change;
  vm.close = close;

  // start
  vm.init();

  // fn initial
  function init() {

    vm.account = $account;
    
    vm.user = {
      current_password: '',
      password: '',
      confirm_password: ''
    };
  }

  // fn update admin profile
  function change() {

    return security.changePassword(vm.user)
      .then(function (res) {
        vm.close();
      }, function (error) {

        $scope.error = {};
        Errors.user(error.errors, $scope.error);
      });
  }

  // fn close popup
  function close() {
    $uibModalInstance.dismiss('cancel');
  }
}