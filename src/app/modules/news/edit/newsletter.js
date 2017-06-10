angular.module('modules.newsletter.edit', [])
  .controller('EditNewsletterCtrl', EditNewsletterCtrl);

EditNewsletterCtrl.$injector = ['$rootScope', '$scope', '$uibModelInstance', '$newsletter', 'Newsletters', 'Errors', 'Utilities'];
function EditNewsletterCtrl($rootScope, $scope, $uibModalInstance, $newsletter, Newsletters, Errors, Utilities) {
  var vm = this;

  // variables
  vm.error = {};
  vm.newsletter = null;
  vm.editorOptions = null;

  // methods
  vm.init = init;
  vm.save = save;
  vm.close = close;

  // start
  vm.init();

  // fn initial
  function init() {
    vm.title = 'Edit Newsletter';
    vm.newsletter = $newsletter;

    vm.editorOptions = {
      height: 450,
      toolbar: [
        ['edit', ['undo', 'redo']],
        ['headline', ['style']],
        ['style', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough', 'clear']],
        ['fontface', ['fontname']],
        ['textsize', ['fontsize']],
        ['fontclr', ['color']],
        ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
        ['height', ['height']],
        ['table', ['table']],
        ['insert', ['link', 'picture', 'video', 'hr']],
        ['view', ['fullscreen', 'codeview']],
        ['help', ['help']]
      ]
    };
  }

  // fn edit user
  function save() {

    return Newsletters.put($newsletter.id, vm.newsletter)
      .then(function (res) {

        $rootScope.$broadcast('newsletter:updated');
        vm.close();

      }, function (error) {
        vm.error = {};
        Errors.game(error.errors, vm.error);
      });
  }

  // fn close popup
  function close() {
    $uibModalInstance.dismiss('cancel');
  }
}
