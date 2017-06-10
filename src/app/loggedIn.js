angular.module('app.loggedIn', ['security'])

  .config(function ($stateProvider, securityAuthorizationProvider) {

    $stateProvider
      .state('loggedIn', {
        abstract: true,
        views: {
          'root': {
            templateUrl: 'layouts/layout-navigation-content.tpl.html'
          }
        },
        resolve: {
          authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
        }
      });
  });
