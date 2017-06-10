angular.module('modules.product', [
  
])
  .config(ProductConfig)
  .controller('ProductCtrl', ProductCtrl);

// fn users config
ProductConfig.$injector = ['$stateProvider'];
function ProductConfig($stateProvider) {

  $stateProvider
    .state('loggedIn.modules.product', {
      url: '/products',
      data: {
        pageTitle: 'Product Manager',
        page: 'Product',
        breadcrumb: 'Product'
      },
      views: {
        'main-content': {
          templateUrl: 'modules/products/products.tpl.html',
          controller: 'ProductCtrl',
          controllerAs: 'vm'
        }
      },
      resolve: {}
    });
}

// fn user controller
ProductCtrl.$injector = ['$rootScope', '$scope', '$uibModal', '$templateCache', 'ngTableParams', 'Product', 'PAGE', 'Utilities', 'RESULT_STATUS', 'DISPUTE_STATUS'];
function ProductCtrl($rootScope, $scope, $uibModal, $templateCache, NgTableParams, Product, PAGE, Utilities, RESULT_STATUS, DISPUTE_STATUS) {
  var vm = this;

  // variables
  vm.product = [];
  vm.productTable = null;
  vm.pagination = {};
  vm.params = {};
  vm.keyword = '';

  // methods
  vm.init = init;
  vm.tableInit = tableInit;
  vm.paginationInit = paginationInit;
  vm.getProducts = getProducts;
  vm.reloadTable = reloadTable;
  vm.search = search;
  vm.cancelSearch = cancelSearch;

  // watch data
  $scope.$on([
    'product:deleted',
    'product:uploaded',
    'product:created',
    'product:updated',
    'product:reset'
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

    vm.productTable = new NgTableParams({
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

        return vm.getProducts(vm.params);
      }
    });
  }

  // fn pagination initial
  function paginationInit() {
    vm.pagination = {
      page: 1,
      maxSize: 5,
      total: 0,
      perPage: PAGE.PER_PAGE,
      change: function () {
        vm.productTable.page(vm.pagination.page);
      }
    };
  }

  // fn get users
  function getProducts(params) {

    return Product.all(params)
      .then(function (res) {
        vm.product = res.data;

        vm.pagination.total = res.total;
        vm.pagination.perPage = res.per_page;
        vm.pagination.page = res.current_page;

        return vm.product;
      }, function () {
        vm.product = [];

        vm.pagination.total = 0;
        vm.pagination.perPage = PAGE.PER_PAGE;
        vm.pagination.page = 1;

        return [];
      });
  }

  // fn reload table
  function reloadTable() {
    vm.productTable.reload();
  }

  // fn search users
  function search() {
    vm.productTable.page(1);
    vm.reloadTable();
  }

  // fn cancel search
  function cancelSearch() {
    vm.keyword = '';
    vm.usersTable.page(1);
    vm.reloadTable();
  }
}