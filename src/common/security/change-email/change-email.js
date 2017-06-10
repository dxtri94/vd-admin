angular.module('security.change-email', [])

  .config(function ($stateProvider) {
    $stateProvider
      .state('changeEmailForm', {
        parent: 'blank',
        url: '/change-email/{token}',
        views: {
          '': {
            templateUrl: 'security/change-email/change-email.tpl.html',
            controller: 'ChangeEmailCtrl'
          }
        }
      });
  })

  .controller('ChangeEmailCtrl',
    function ($rootScope, $scope, $state, $stateParams, security, cfModal, utils) {
      $scope.error = false;
      $scope.message = '';

      $scope.actions = {
        init: function () {
          $scope.actions.confirmChangeEamil();
        },

        confirmChangeEamil: function() {
          security.confirmChangeEamil({token: $stateParams.token})
            .then(function success(res) {
              cfModal.open({
                content: 'Change email is successlly!'
              }).result.then(function () {
                $state.go('loginForm');
              }, function (reason) {
                utils.detectFails(reason, ['backdrop', 'cancel'], function () {
                  $state.go('loginForm');
                });
              });
            }, function error(error) {
              switch (error.code) {
                case 400:
                {
                  $scope.message = "Your request is invalid";
                  break;
                }
                case 404:
                {
                  $scope.message = "Cannot found your request. Please try again.";
                  break;
                }
              }

              $scope.error = true;

            });
        }
      };

      $scope.actions.init();
    });