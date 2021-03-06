angular.module('modules.categories', [
  'modules.categories.add',
  'modules.categories.edit'
  ])
  .config(CategoriesConfig)
  .controller('CategoriesCtrl', CategoriesCtrl);

// fn transaction config
CategoriesConfig.$injector = ['$stateProvider'];
function CategoriesConfig($stateProvider) {

  $stateProvider
    .state('loggedIn.modules.categories', {
      url: '/categories',
      data: {
        pageTitle: 'Categories Manager',
        page: 'Categories',
        breadcrumb: 'Categories'
      },
      views: {
        'main-content': {
          templateUrl: 'modules/categories/categories.tpl.html',
          controller: 'CategoriesCtrl',
          controllerAs: 'vm'
        }
      },
      resolve: {}
    });
}

// fn transaction controller
CategoriesCtrl.$injector = ['$rootScope', '$scope', '$uibModal', '$templateCache', 'ngTableParams', 'Categories', 'PAGE', 'Utilities'];
function CategoriesCtrl($rootScope, $scope, $uibModal, $templateCache, NgTableParams, Categories, PAGE, Utilities) {
  var vm = this;

  // variables
  vm.categories = [];
  vm.categoriesTable = null;
  vm.pagination = {};
  vm.params = {};
  vm.keyword = '';

  // methods
  vm.init = init;
  vm.tableInit = tableInit;
  vm.paginationInit = paginationInit;
  vm.getCategories = getCategories;
  vm.getCategories = getCategories;
  vm.reloadTable = reloadTable;
  vm.search = search;
  vm.cancelSearch = cancelSearch;
  vm.openAdd = openAdd;
  vm.openEdit = openEdit;
  // watch data
  $scope.$on([
    'categories:deleted',
    'categories:uploaded',
    'categories:created',
    'categories:updated',
    'categories:reset'
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

    vm.categoriesTable = new NgTableParams({
      page: vm.pagination.page || 1,
      sorting: {created_at: 'asc'}
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

        return vm.getCategories(vm.params);
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
        vm.categoriesTable.page(vm.pagination.page);
      }
    };
  }

  // fn get users
  function getCategories(params) {

    return Categories.all(params)
      .then(function (res) {
        vm.categories = res.data;

        vm.pagination.total = res.total;
        vm.pagination.perPage = res.per_page;
        vm.pagination.page = res.current_page;

        return vm.categories;
      }, function () {
        vm.categories = [];

        vm.pagination.total = 0;
        vm.pagination.perPage = PAGE.PER_PAGE;
        vm.pagination.page = 1;

        return [];
      });
  }

  // fn open reset password to user popup
  function openAdd(categories) {
    return $uibModal.open({
      size: 'md',
      template: $templateCache.get('modules/categories/add/categories.tpl.html'),
      controller: 'AddCategoriesCtrl',
      controllerAs: 'vm',
      resolve: {
        // $platforms: function () {
        //   return Platforms.all()
        //     .then(function (res) {
        //       return res;
        //     }, function () {
        //       return [];
        //     });
        // }
      }
    });
  }

  // fn open reset password to user popup
  function openEdit(categories) {
    return $uibModal.open({
      size: 'md',
      template: $templateCache.get('modules/categories/edit/categories.tpl.html'),
      controller: 'EditCategoriesCtrl',
      controllerAs: 'vm',
      resolve: {
          $categories: function(){
            return categories;
          }
      }
    });
  }

  // // get resolve user
  // function getCategories(dispute) {

  //   return Categories.get(dispute.id)
  //     .then(function (res) {

  //       return res;
  //     }, function () {

  //       return null;
  //     });
  // }

  // fn reload table
  function reloadTable() {
    vm.categoriesTable.reload();
  }

  // fn search users
  function search() {
    vm.categoriesTable.page(1);
    vm.reloadTable();
  }

  // fn cancel search
  function cancelSearch() {
    vm.keyword = '';
    vm.usersTable.page(1);
    vm.reloadTable();
  }
}