angular.module('modules.game.edit', [])
  .controller('EditGameCtrl', EditGameCtrl);

EditGameCtrl.$injector = ['$rootScope', '$scope', '$uibModelInstance', '$game', '$platforms', 'Games', 'Errors', 'Utilities'];
function EditGameCtrl($rootScope, $scope, $uibModalInstance, $game, $platforms, Games, Errors, Utilities) {
  var vm = this;

  // variables
  vm.error = {};
  vm.game = null;
  vm.platform = null;
  vm.platforms = [];

  // methods
  vm.init = init;
  vm.save = save;
  vm.upload = upload;
  vm.close = close;
  vm.selectFile = selectFile;
  vm.openUploadFile = openUploadFile;

  // start
  vm.init();

  // fn initial
  function init() {
    vm.title = 'Edit game';
    vm.game = $game;

    vm.platforms = $platforms;
  }

  // fn edit user
  function save() {

    return Games.put($game.id, vm.game)
      .then(function (res) {
        
        $rootScope.$broadcast('game:updated');
        vm.close();

      }, function (error) {
        vm.error = {};
        Errors.game(error.errors, vm.error);
      });
  }

  // fn upload file to game
  function upload(file) {

    return Games.upload($game.id, file)
      .then(function (res) {
        // update game
        vm.game.src = res.src;

        $rootScope.$broadcast('game:uploaded');
      }, function (error) {
        console.log('error upload: ', error);
      });
  }

  // fn open file upload popup
  function openUploadFile() {
    $('#game-file').click();
  }

  // fn select file
  function selectFile(element) {
    var file = element.files[0];
    $('#game-file').val('');

    if (file) {

      Utilities.readFile(file, function (event) {
        $scope.$apply(function () {

          vm.upload(file);
        });
      });
    }
  }

  // fn close popup
  function close() {
    $uibModalInstance.dismiss('cancel');
  }
}
