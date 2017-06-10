angular.module('security.forgot', [])

  .config(ForgotConfig)
  .controller('ForgotCtrl', ForgotCtrl);

ForgotConfig.$injector = ['$stateProvider'];
function ForgotConfig($stateProvider) {
  $stateProvider
    .state('forgotForm', {
      parent: 'blank',
      url: '/forgot',
      views: {
        '': {
          templateUrl: 'security/forgot/forgot.tpl.html',
          controller: 'ForgotCtrl',
          controllerAs: 'vm'
        }
      }
    });
}

ForgotCtrl.$injector = ['$state', 'security', 'Errors'];
function ForgotCtrl($state, security, Errors) {
  var vm = this;

  // variables
  vm.errors = {};
  vm.user = {
    email: ''
  };

  // methods
  vm.init = init;
  vm.request = request;
  vm.openSuccessPopup = openSuccessPopup;

  vm.init();

  // fn initial
  function init() {

  }

  // fn send request forgot password
  function request() {
    return security.forgot(vm.user)
      .then(function (res) {
        vm.openSuccessPopup();
      }, function (error) {
        vm.errors = {};
        Errors.forgot(error.errors, vm.errors);
      });
  }

  // fn open success popup
  function openSuccessPopup() {
    return cfModal.open({
      title: 'A reset password link has been sent.',
      content: 'Please check your email (or junk email).',
      form: 'style2',
      labels: {
        confirm: 'Done'
      },
      confirm: function (uibModalInstance) {
        $state.go('loginForm');
        uibModalInstance.dismiss('cancel');
      }
    });
  }
}
