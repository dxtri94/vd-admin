angular.module('app.navigation', [])

  .controller('NavigatorCtrl', NavigatorCtrl);

NavigatorCtrl.$injector = ['$scope', 'security', '$interval'];
function NavigatorCtrl($scope, security, $interval) {
  var vm = this;

  // variables
  vm.menu = [];

  // methods
  vm.init = init;

  vm.init();

  // change counter
  $scope.$on('counter:changed', function () {

  });

  // fn initial
  function init() {
    vm.menu = [
      {label: 'Products', sref: 'loggedIn.modules.product', classes: ''},
      {label: 'Categories', sref: 'loggedIn.modules.categories', classes: ''},
      {label: 'Catalogs', sref: 'loggedIn.modules.catalog', classes: '', counter: 0},
      {label: 'UserContact', sref: 'loggedIn.modules.usercontact', classes: ''},
      {label: 'News', sref: 'loggedIn.modules.news', classes: '', counter: 0}
    ];
  }
}
