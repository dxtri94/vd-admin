angular.module('app.modules', [
  'modules.categories',
  'modules.games',
  'modules.disputes',
  'modules.newsletters'
])

  .config(function ($stateProvider) {
    $stateProvider
      .state('loggedIn.modules', {
        url: '',
        abstract: true,
        views: {
          'header': {
            templateUrl: 'header/header.tpl.html',
            controller: 'HeaderCtrl',
            controllerAs: 'vm'
          },
          'middle-container': {
            templateUrl: 'layouts/layout-middle-content.tpl.html'
          },
          'footer': {
            templateUrl: 'footer/footer.tpl.html'
          }
        },
        resolve: {}
      });
  });
