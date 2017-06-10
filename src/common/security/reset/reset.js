angular.module('security.reset', [])

  .config(ResetConfig)
  .controller('ResetCtrl', ResetCtrl);

// reset password config
ResetConfig.$rejector = ['$stateProvider'];
function ResetConfig($stateProvider) {
  $stateProvider
    .state('resetForm', {
      parent: 'blank',
      url: '/reset/{token}',
      views: {
        '': {
          templateUrl: 'security/reset/reset.tpl.html',
          controller: 'ResetCtrl',
          controllerAs: 'vm'
        }
      },
      resolve: {
        $isToken: checkToken
      }
    });


  checkToken.$injector = ['$state', '$stateParams', 'security', 'Utilities', 'Errors'];
  function checkToken($state, $stateParams, security, Utilities, Errors) {
    return security.confirmToken({token: $stateParams.token})
      .then(function (res) {
        return true;
      }, function (error) {

        var message = '';
        var errorCode = false;
        angular.forEach(error.errors, function (error) {
          errorCode = error.errorCode;
          switch (error.errorCode) {
            case 2001: {
              message = 'Your reset password request cannot found.';
              break;
            }
            case 2005: {
              message = 'Your reset password request is expired. Please try again.';
              break;
            }
          }
        });

        cfModal.open({
          form: 'style2',
          content: message
        }).result.then(function () {
          $state.go('forgotForm');
        }, function (reason) {
          Utilities.detectFails(reason, ['backdrop', 'cancel', 'escape'], function () {
            $state.go('loginForm');
          });
        });

        return false;
      });
  }
}

// reset password controller
ResetCtrl.$injector = ['$state', '$stateParams', 'security', 'Errors'];
function ResetCtrl($state, $stateParams, security, Errors) {
  var vm = this;

  // variables
  vm.error = {};
  vm.user = {
    token: $stateParams.token,
    password: '',
    confirm_password: ''
  };

  // methods
  vm.init = init;
  vm.reset = reset;
  vm.openSuccessPopup = openSuccessPopup;

  vm.init();

  // fn initial
  function init() {

  }

  // fn reset password (for forgotten)
  function reset() {
    return security.reset(vm.user)
      .then(function success(res) {

        vm.openSuccessPopup();

      }, function (error) {
        vm.error = {};
        Errors.reset(error.errors, vm.error);
      });
  }

  // fn open success popup
  function openSuccessPopup() {
    return cfModal.open({
      form: 'style2',
      content: 'Your password has been updated.',
      callback: function () {
        $state.go('loginForm');
      },
      confirm: function (uibModalInstance) {
        uibModalInstance.dismiss('cancel');
      }
    });
  }
}