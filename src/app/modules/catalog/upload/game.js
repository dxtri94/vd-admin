angular.module('modules.game.upload', [])
  .controller('UploadGameCtrl', UploadGameCtrl);

UploadGameCtrl.$injector = ['$rootScope', '$scope', '$uibModalInstance', '$game', 'Games', 'Errors', 'Utilities'];
function UploadGameCtrl($rootScope, $scope, $uibModalInstance, $game, Games, Errors, Utilities) {
  var vm = this;

  // variables
  vm.source = null;
  vm.file = null;

  // methods
  vm.init = init;
  vm.upload = upload;
  vm.close = close;
  vm.openUploadFile = openUploadFile;
  vm.selectFile = selectFile;

  // start
  vm.init();

  // fn initial
  function init() {
    vm.game = $game;
  }

  // fn upload file to game
  function upload(id) {
    return Games.uploadBase64(id, {
      base64_image: vm.source
    })
      .then(function (res) {

        $rootScope.$broadcast('game:uploaded');
        vm.close();

      }, function (error) {
        console.log(error.error);
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
          vm.file = event.target.result;
        });
      });
    }
  }

  // fn close popup
  function close() {
    $uibModalInstance.dismiss('cancel');
  }
}
