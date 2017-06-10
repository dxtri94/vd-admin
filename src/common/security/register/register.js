angular.module('security.register', [])

  .config(RegisterConfig)
  .controller('RegisterCtrl', RegisterCtrl);

RegisterConfig.$injector = [];
function RegisterConfig($stateProvider) {

  $stateProvider
    .state('registerForm', {
      parent: 'blank',
      url: '/register',
      views: {
        '': {
          templateUrl: 'security/register/register.tpl.html',
          controller: 'RegisterCtrl',
          controllerAs: 'register'
        }
      }
    });
}

RegisterCtrl.$injector = [];
function RegisterCtrl($scope, $rootScope, $uibModal, $uibModalInstance, $templateCache, security, Errors, utils, cfModal) {

  $scope.actions = {

    // initital
    init: function () {
      $scope.company = {
        name: '',
        contact: '',
        email: '',
        password: '',
        confirm_password: '',
        is_remember: false
      };
    },

    // validate fields
    validate: function (fields) {
      $scope.error = {};

      for (var index in fields) {
        var field = fields[index];

        switch (field) {
          case 'name':
          case 'contact':
          case 'email':
          case 'password':
          case 'confirm_password': {
            if (utils.isEmpty($scope.company[field])) {
              $scope.error[field] = true;
            }
            break;
          }
        }
      }
      return false;
    },

    // register new company
    register: function (form) {

      if (form) {
        $scope.actions.validate(['name', 'contact', 'email', 'password', 'confirm_password']);
        if (form.$invalid) {
          return;
        }
      }

      // send request
      security.registerAsCompany($scope.company)
        .then(function (res) {
          $uibModalInstance.close(res);
        }, function (error) {
          $scope.error = {};
          Errors.company(error.errors, $scope.error);
        });
    },

    // open cancel create account
    openCancelAccount: function () {
      cfModal.open({
        title: 'Cancel Account Creation',
        content: 'Cancel the creation of this Company Account?',
        size: 'x-md',
        keyboard: false,
        labels: {
          confirm: 'Yes',
          cancel: 'no'
        },
        style: 'landing-2',
        confirm: function (modalInstance) {
          modalInstance.dismiss('cancel');
          $uibModalInstance.dismiss('cancel');
        },
        cancel: function (modalInstance) {
          modalInstance.dismiss('cancel');
        }
      });
    },

    // close popup
    close: function () {
      $scope.actions.openCancelAccount();
    }
  };

  $scope.actions.init();
}