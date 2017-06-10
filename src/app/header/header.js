angular.module('app.header', [
  'app.header.edit-account',
  'app.header.change-password'
])
  .controller('HeaderCtrl', HeaderCtrl);

HeaderCtrl.$injector = ['$scope', '$state', 'security', '$uibModal', '$templateCache'];
function HeaderCtrl($scope, $state, security, $uibModal, $templateCache) {

  var vm = this;

  // variables
  vm.account = null;

  // methods
  vm.init = init;
  vm.openEditAccount = openEditAccount;
  vm.openChangePassword = openChangePassword;
  vm.logout = logout;

  // start
  vm.init();

  $scope.$on([
    'profile:updated',
    'profile:uploaded'
  ], function (event, response) {
    security.currentUser.avatar_src = response.src;
    security.currentUser.avatar_thumbnail = response.thumbnail;
    security.currentUser.type_image = response.type_image;
  });

  // fn initial
  function init() {
    vm.account = security.currentUser;
    vm.settings = [
      {
        label: 'Change Password',
        event: vm.openChangePassword
      },
      {
        label: 'Logout',
        event: vm.logout
      }
    ];
  }

  // fn open edit account
  function openEditAccount() {

    return $uibModal.open({
      size: 'lg',
      template: $templateCache.get('header/detail/account.tpl.html'),
      controller: 'EditAccountCtrl',
      controllerAs: 'vm',
      resolve: {
        $account: function () {
          return angular.copy(security.currentUser);
        },
        $locations: function (Locations) {
          return Locations.all()
            .then(function (res) {
              return res;
            }, function () {
              return [];
            });
        }
      }
    });
  }

  // fn open change password
  function openChangePassword() {

    return $uibModal.open({
      size: 'sm',
      template: $templateCache.get('header/password/account.tpl.html'),
      controller: 'ChangePasswordCtrl',
      controllerAs: 'vm',
      resolve: {
        $account: function () {
          return angular.copy(security.currentUser);
        }
      }
    });
  }

  // fn logout
  function logout() {
    return security.logout()
      .then(function (res) {
        $state.go('loginForm');
      }, function (error) {
        $state.go('loginForm');
      });
  }
}
