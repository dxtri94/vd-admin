angular.module('app', [
  'ui.router',
  'ui.bootstrap',
  'ui.utils',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngAnimate',
  'ngTable',
  'angularMoment',
  'summernote',
  'ngCroppie',

  'directive',
  'services',
  'resources',
  'security',

  'templates-app',
  'templates-common',

  'app.constant',
  'app.spinner',
  'app.utils',
  'app.printer',
  'app.loggedIn',
  'app.modules',
  'app.navigation',
  'app.header',
  'app.footer',


])

  .config(AppConf)
  .run(AppRun)
  .controller('AppCtrl', AppCtrl);

// fn app conf
AppConf.$injector = ['$stateProvider', '$urlRouterProvider'];
function AppConf($stateProvider, $urlRouterProvider) {
  $urlRouterProvider
    .otherwise('/');

  $stateProvider

  // new blank
    .state('blank', {
      abstract: true,
      views: {
        'root': {
          templateUrl: 'layouts/blank.tpl.html'
        }
      }
    })

    // init
    .state('init', {
      url: '/',
      resolve: {
        init: function ($state, $cookieStore, security) {
          return security.requestCurrentUser()
            .then(function () {
              if (security.isAuthenticated()) {
                $state.go('loggedIn.modules.categories');
              } else {
                $cookieStore.remove('authToken');
                $state.go('loginForm');
              }
            });
        }
      }
    })

    // 404
    .state('404', {
      url: '/404',
      views: {
        'root': {
          templateUrl: 'modules/pages/404.tpl.html'
        }
      }
    });
}

// fn app run to start application
AppRun.$injector = ['$rootScope', '$state', '$stateParams'];
function AppRun($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
}

// fn app controller (root controller)
AppCtrl.$injector = ['$rootScope', '$scope', '$sce', 'security', 'Utilities', 'Spinner', '$timeout', '$interval'];
function AppCtrl($rootScope, $scope, $sce, security, Utilities, Spinner, $timeout, $interval) {
  var vm = this;

  // settings application
  $scope.pageTitle = 'Vondom';
  $scope.subPageTitle = 'Admin Panel';
  $scope.app = {
    name: 'Vondom',
    companyName: 'Vondom',
    year: new Date().getFullYear(),
    favicon: '',
    url: '',
    logo: '',
    imageUrl: '',
    description: "",
    version: '1.0',
    support: 'support@mail.com',
    settings: {
      themeID: 1,
      navbarHeaderColor: 'bg-black',
      navbarCollapseColor: 'bg-white-only',
      asideColor: 'bg-black',
      headerFixed: true,
      footerFixed: true,
      hasAside: false,
      asideFixed: false,
      asideFolded: false,
      asideDock: false,
      container: false
    }
  };

  $scope.noImage = 'assets/images/empty.png';
  $scope.noProfileImage = 'assets/images/profile-user.png';
  $scope.noImageLarge = 'assets/images/no-image-large.png';

  vm.init = init;

  vm.init();

  function init() {
    rebuildBroadcast();
    getBroadcast();
  }

  $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    //console.log('state to', toState);
  });

  $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.page) {
      $scope.page = toState.data.page;
    }
    
    if (toState.data && toState.data.breadcrumb) {
      $scope.breadcrumb = toState.data.breadcrumb;
    }

    console.log('state to:', toState);
  });

  $scope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    i18nNotifications.pushForCurrentRoute('errors.route.changeError', 'error', {}, {rejection: error});
  });

  $scope.requests = 0;

  $scope.$on('API:loading:started', function (event, args) {
    Spinner.spin('spinner');
  });

  $scope.$on('API:loading:ended', function (event, args) {
    Spinner.stop('spinner');
  });

  function rebuildBroadcast() {

    // re-setup rootscope $on
    var $onOrigin = $rootScope.$on;
    $rootScope.$on = function (names, listener) {
      var self = this;

      if (!angular.isArray(names)) {
        names = [names];
      }

      names.forEach(function (name) {
        $onOrigin.call(self, name, listener);
      });
    };
  }

  function getBroadcast() {
    /*$scope.$on('pageTitle', function (event, value) {
     $scope.subPageTitle = value;
     });

     $scope.$on('breadcrumb', function (event, value) {
     $scope.breadcrumb = value;
     });*/
  }
}