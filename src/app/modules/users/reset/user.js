angular.module('modules.user.reset', [])
  .controller('ResetUserCtrl', ResetUserCtrl);

ResetUserCtrl.$injector = ['$rootScope', '$uibModalInstance', '$user', 'Users', 'Errors'];
function ResetUserCtrl($rootScope, $uibModalInstance, $user, Users, Errors) {
  var vm = this;

  // variables
  vm.reset = null;

  // methods
  vm.init = init;
  vm.resetPassword = resetPassword;
  vm.close = close;

  // start
  vm.init();

  // fn initial
  function init() {
    vm.user = $user;
    vm.reset = {
      password: '',
      confirm_password: ''
    };
  }

  // fn reset password
  function resetPassword() {
    return Users.reset($user.id, vm.user)
      .then(function (res) {

        $rootScope.$broadcast('user:reset');
        vm.close();

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
