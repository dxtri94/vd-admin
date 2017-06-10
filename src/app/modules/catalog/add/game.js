angular.module('modules.game.add', [])
  .controller('AddGameCtrl', AddGameCtrl);

AddGameCtrl.$injector = ['$rootScope', '$scope', '$uibModalInstance', '$platforms', 'Games', 'Errors', 'Utilities'];
function AddGameCtrl($rootScope, $scope, $uibModalInstance, $platforms, Games, Errors, Utilities) {
  var vm = this;

  // variables
  vm.source = null;
  vm.game = null;
  vm.file = null;

  // methods
  vm.init = init;
  vm.save = save;
  vm.close = close;

  $scope.$watch('vm.source', function () {
    console.log(vm.source);
  });

  // start
  vm.init();

  // fn initial
  function init() {
    vm.title = 'Create New Game';
    vm.platforms = $platforms;
    vm.game = {
      name: '',
      description: '',
      platform_id: null
    };
  }

  // fn reset password
  function save() {

    return Games.post(vm.game)
      .then(function (res) {

        $rootScope.$broadcast('game:created');

        if (vm.source) {
          vm.upload(res.id);
        } else {
          vm.close();
        }

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
