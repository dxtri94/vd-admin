angular.module('modules.users', [
  'modules.user.edit',
  'modules.user.reset',
])
  .config(UsersConfig)
  .controller('UsersCtrl', UsersCtrl);

// fn users config
UsersConfig.$injector = ['$stateProvider'];
function UsersConfig($stateProvider) {
  $stateProvider
    .state('loggedIn.modules.users', {
      url: '/users',
      data: {
        pageTitle: 'User Manager',
        page: 'Users',
        breadcrumb: 'Users'
      },
      views: {
        'main-content': {
          templateUrl: 'modules/users/users.tpl.html',
          controller: 'UsersCtrl',
          controllerAs: 'vm'
        }
      },
      resolve: {}
    });
}

// fn user controller
UsersCtrl.$injector = ['$rootScope', '$scope', '$uibModal', '$templateCache', 'ngTableParams', 'Users', 'Roles', 'cfModal', 'PAGE', 'Utilities'];
function UsersCtrl($rootScope, $scope, $uibModal, $templateCache, NgTableParams, Users, Roles, cfModal, PAGE, Utilities) {
  var vm = this;

  // variables
  vm.users = [];
  vm.usersTable = null;
  vm.pagination = {};
  vm.params = {};
  vm.keyword = '';

  // methods
  vm.init = init;
  vm.tableInit = tableInit;
  vm.paginationInit = paginationInit;
  vm.getUser = getUser;
  vm.getUsers = getUsers;
  vm.reloadTable = reloadTable;
  vm.search = search;
  vm.cancelSearch = cancelSearch;
  vm.openEdit = openEdit;
  vm.openReset = openReset;
  vm.openDestroy = openDestroy;
  vm.detectPaging = detectPaging;

  // watch data
  $scope.$on([
    'user:deleted',
    'user:uploaded',
    'user:created',
    'user:updated',
    'user:reset'], function () {
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
    vm.usersTable = new NgTableParams({
      page: vm.pagination.page || 1,
      sorting: {username: 'asc'}
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

        return vm.getUsers(vm.params);
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
        vm.usersTable.page(vm.pagination.page);
      }
    };
  }

  // fn get users
  function getUsers(params) {

    return Users.all(params)
      .then(function (res) {
        vm.users = res.data;

        vm.pagination.total = res.total;
        vm.pagination.perPage = res.per_page;
        vm.pagination.page = res.current_page;

        return vm.users;
      }, function () {
        vm.users = [];

        vm.pagination.total = 0;
        vm.pagination.perPage = PAGE.PER_PAGE;
        vm.pagination.page = 1;

        return [];
      });
  }

  // fn reload table
  function reloadTable() {
    vm.usersTable.reload();
  }

  // fn search users
  function search() {
    vm.usersTable.page(1);
    vm.reloadTable();
  }

  // fn cancel search
  function cancelSearch() {
    vm.keyword = '';
    vm.usersTable.page(1);
    vm.reloadTable();
  }

  // get resolve user
  function getUser(user) {
    return Users.get(user.id)
      .then(function (res) {
        return res;
      }, function () {
        return null;
      });
  }

  // fn open edit user account
  function openEdit(user) {

    return $uibModal.open({
      size: 'lg',
      template: $templateCache.get('modules/users/edit/user.tpl.html'),
      controller: 'EditUserCtrl',
      controllerAs: 'vm',
      resolve: {
        $user: function () {
          return angular.copy(user);
        },
        $locations: function (Locations) {
          return Locations.all()
            .then(function (res) {
              return res;
            }, function () {
              return [];
            });
        },
        $roles: function (Roles) {
          return Roles.all()
            .then(function (res) {
              return res;
            }, function (error) {
              return [];
            });
        }
      }
    });
  }

  // fn open reset password to user popup
  function openReset(user) {
    return $uibModal.open({
      size: 'sm',
      template: $templateCache.get('modules/users/reset/user.tpl.html'),
      controller: 'ResetUserCtrl',
      controllerAs: 'vm',
      resolve: {
        $user: function () {
          return angular.copy(user);
        }
      }
    });
  }

  // open confirm delete user
  function openDestroy(user) {

    return cfModal.open({
      size: 'sm',
      title: 'Delete Account?',
      content: 'Are you sure you want to delete <br /> this user account?',
      cancel: function (uibModelInstance) {
        uibModelInstance.dismiss('cancel');
      },
      confirm: function (uibModelInstance) {
        Users.destroy(user.id)
          .then(function () {
            $rootScope.$broadcast('user:deleted');
            uibModelInstance.dismiss('cancel');

            vm.detectPaging(vm.users.length - 1);
          }, function (error) {
            console.log('delete user: ', error);
          });
      }
    });
  }

  // reset page when destroy all item in list
  function detectPaging(length) {
    if (length === 0 && vm.pagination.page > 1) {
      vm.pagination.page--;
      vm.usersTable.page(vm.pagination.page);
    }

    vm.reloadTable();
  }
}