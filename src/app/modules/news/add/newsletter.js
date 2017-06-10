angular.module('modules.newsletter.add', [])
  .controller('AddNewsletterCtrl', AddNewsletterCtrl);

AddNewsletterCtrl.$injector = ['$rootScope', '$uibModalInstance', 'Newsletters', 'Errors', 'Utilities'];
function AddNewsletterCtrl($rootScope, $uibModalInstance, Newsletters, Errors, Utilities) {
  var vm = this;

  // variables
  vm.source = null;
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
    vm.title = 'Create New Newsletter';

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

  // fn reset password
  function save() {

    return Newsletters.post(vm.newsletter)
      .then(function (res) {

        $rootScope.$broadcast('newsletter:created');
        vm.close();

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
