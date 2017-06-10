angular.module('modules.user.edit', [])
  .controller('EditUserCtrl', EditUserCtrl);

EditUserCtrl.$injector = ['$rootScope', '$scope', '$uibModelInstance', '$user', '$roles', '$locations', 'Users', 'Errors', 'Utilities'];
function EditUserCtrl($rootScope, $scope, $uibModalInstance, $user, $roles, $locations, Users, Errors, Utilities) {
  var vm = this;

  // variables
  vm.error = {};
  vm.user = null;
  vm.role = null;
  vm.roles = [];
  vm.location = null;
  vm.locations = [];

  // methods
  vm.init = init;
  vm.edit = edit;
  vm.selectRole = selectRole;
  vm.close = close;
  vm.selectFile = selectFile;
  vm.openUploadFile = openUploadFile;

  // start
  vm.init();

  // fn initial
  function init() {
    vm.user = $user;

    vm.roles = $roles;
    vm.role = $user.role;

    vm.locations = $locations;

    $scope.noProfileImage = 'assets/images/profile-user.png';
  }

  // fn edit user
  function edit() {

    return Users.put($user.id, vm.user)
      .then(function (res) {
        vm.close();
        $rootScope.$broadcast('user:updated');
      }, function (error) {
        vm.error = {};
        Errors.user(error.errors, vm.error);
      });
  }

  // fn select role to user account
  function selectRole(role) {
    vm.role = role;
    vm.user.role_id = role.id;
  }

  // fn open file upload popup
  function openUploadFile() {
    $('#profile-file').click();
  }

  // fn select file
  function selectFile(element) {
    var file = element.files[0];
    $('#profile-file').val('');

    if (file) {

      Utilities.readFile(file, function (event) {
        $scope.$apply(function () {

          // apply upload
          Users.upload($user.id, file)
            .then(function (res) {
              // update user
              vm.user.avatar_src = res.src;
              vm.user.avatar_thumbnail = res.thumbnail;

              $rootScope.$broadcast('user:uploaded');
            }, function (error) {
              console.log('error upload: ', error);
            });
        });
      });
    }
  }

  // fn close popup
  function close() {
    $uibModalInstance.dismiss('cancel');
  }
}
