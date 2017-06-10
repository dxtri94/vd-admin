angular.module('security.login', [])
  .config(LoginConfig)
  .controller('LoginCtrl', LoginCtrl);

LoginConfig.$injector = ['$stateProvider'];
function LoginConfig($stateProvider) {

  $stateProvider
    .state('loginForm', {
      parent: 'blank',
      url: '/login',
      views: {
        '': {
          templateUrl: 'security/login/login.tpl.html',
          controller: 'LoginCtrl',
          controllerAs: 'vm'
        }
      }
    });
}

LoginCtrl.$injector = ['$state', '$uibModal', 'security', 'Errors', 'Utilities'];
function LoginCtrl($state, $uibModal, security, Errors, Utilities) {

  var vm = this;

  // variables
  vm.errors = {};
  vm.user = {
    username: 'admin',
    password: '123456',
    remember: false
  };

  // methods
  vm.init = init;
  vm.login = login;

  vm.init();

  // fn initial
  function init() {

  }

  // fn login
  function login() {
    return security.login(vm.user.username, vm.user.password, vm.user.remember)
      .then(function (loggedIn) {
        if (loggedIn) {
          $state.go('init');
        }
      }, function (error) {
        vm.errors = {};
        console.log(error);
      });
  }
}

