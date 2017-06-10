angular.module('modules.games', [
  'modules.game.edit',
  'modules.game.add',
  'modules.game.upload'
])
  .config(GamesConfig)
  .controller('GamesCtrl', GamesCtrl);

// fn games config
GamesConfig.$injector = ['$stateProvider'];
function GamesConfig($stateProvider) {
  $stateProvider
    .state('loggedIn.modules.games', {
      url: '/games',
      data: {
        pageTitle: 'Game Manager',
        page: 'Games',
        breadcrumb: 'Games'
      },
      views: {
        'main-content': {
          templateUrl: 'modules/games/games.tpl.html',
          controller: 'GamesCtrl',
          controllerAs: 'vm'
        }
      },
      resolve: {}
    });
}

// fn user controller
GamesCtrl.$injector = ['$rootScope', '$scope', '$uibModal', '$templateCache', 'ngTableParams', 'Games', 'Platforms', 'cfModal', 'PAGE', 'Utilities'];
function GamesCtrl($rootScope, $scope, $uibModal, $templateCache, NgTableParams, Games, Platforms, cfModal, PAGE, Utilities) {
  var vm = this;

  // variables
  vm.games = [];
  vm.gamesTable = null;
  vm.pagination = {};
  vm.params = {};
  vm.keyword = '';

  // methods
  vm.init = init;
  vm.tableInit = tableInit;
  vm.paginationInit = paginationInit;
  vm.getGame = getGame;
  vm.getGames = getGames;
  vm.reloadTable = reloadTable;
  vm.search = search;
  vm.cancelSearch = cancelSearch;
  vm.openAdd = openAdd;
  vm.openEdit = openEdit;
  vm.openUpload = openUpload;
  vm.openDestroy = openDestroy;
  vm.detectPaging = detectPaging;

  // watch data
  $scope.$on([
    'game:deleted',
    'game:uploaded',
    'game:created',
    'game:updated',
    'game:reset'
  ], function () {
    vm.reloadTable();
  });

  // start
  vm.init();

  // initial
  function init() {
    vm.paginationInit();
    vm.tableInit();
  }

  // fn table initial
  function tableInit() {
    vm.gamesTable = new NgTableParams({
      page: vm.pagination.page || 1,
      sorting: {name: 'asc'}
    }, {
      counts: [],
      getData: function ($params) {

        vm.params = {
          keyword: vm.keyword,
          page: $params.page()
        };

        angular.forEach($params.sorting(), function (order, field) {
          vm.params.field = field;
          vm.params.order = order;
        });

        return vm.getGames(vm.params);
      }
    });
  }

  // fn pagination initial
  function paginationInit() {
    vm.pagination = {
      page: 1,
      maxSize: 20,
      total: 0,
      perPage: PAGE.PER_PAGE,
      change: function () {
        vm.gamesTable.page(vm.pagination.page);
      }
    };
  }

  // fn get games
  function getGames(params) {

    return Games.all(params)
      .then(function (res) {
        vm.games = res.data;

        vm.pagination.total = res.total;
        vm.pagination.perPage = res.per_page;
        vm.pagination.page = res.current_page;

        return vm.games;
      }, function () {
        vm.games = [];

        vm.pagination.total = 0;
        vm.pagination.perPage = PAGE.PER_PAGE;
        vm.pagination.page = 1;

        return [];
      });
  }

  // fn reload table
  function reloadTable() {
    vm.gamesTable.reload();
  }

  // fn search games
  function search() {
    vm.gamesTable.page(1);
    vm.reloadTable();
  }

  // fn cancel search
  function cancelSearch() {
    vm.keyword = '';
    vm.gamesTable.page(1);
    vm.reloadTable();
  }

  // get resolve user
  function getGame(user) {

    return Games.get(user.id)
      .then(function (res) {

        return res;
      }, function () {

        return null;
      });
  }

  // fn open edit user account
  function openEdit(game) {

    return $uibModal.open({
      template: $templateCache.get('modules/games/actions/game.tpl.html'),
      controller: 'EditGameCtrl',
      controllerAs: 'vm',
      resolve: {
        $game: function () {
          return angular.copy(game);
        },
        $platforms: function () {
          return Platforms.all()
            .then(function (res) {
              return res;
            }, function () {
              return [];
            });
        }
      }
    });
  }

  // fn open upload user account
  function openUpload(game) {

    return $uibModal.open({
      template: $templateCache.get('modules/games/upload/game.tpl.html'),
      controller: 'UploadGameCtrl',
      controllerAs: 'vm',
      resolve: {
        $game: function () {
          return angular.copy(game);
        }
      }
    });
  }

  // fn open reset password to user popup
  function openAdd(user) {
    return $uibModal.open({
      size: 'md',
      template: $templateCache.get('modules/games/actions/game.tpl.html'),
      controller: 'AddGameCtrl',
      controllerAs: 'vm',
      resolve: {
        $platforms: function () {
          return Platforms.all()
            .then(function (res) {
              return res;
            }, function () {
              return [];
            });
        }
      }
    });
  }

  // open confirm delete user
  function openDestroy(game) {

    return cfModal.open({
      size: 'sm',
      title: 'Delete Game?',
      content: 'Are you sure you want to delete <br /> this game?',
      cancel: function (uibModelInstance) {
        uibModelInstance.dismiss('cancel');
      },
      confirm: function (uibModelInstance) {
        Games.destroy(game.id)
          .then(function () {

            $rootScope.$broadcast('game:deleted');
            uibModelInstance.dismiss('cancel');

            vm.detectPaging(vm.games.length - 1);
          }, function (error) {
            console.log('delete game: ', error);
          });
      }
    });
  }

  // reset page when destroy all item in list
  function detectPaging(length) {
    if (length === 0 && vm.pagination.page > 1) {
      vm.pagination.page--;
      vm.gamesTable.page(vm.pagination.page);
    }

    vm.reloadTable();
  }
}