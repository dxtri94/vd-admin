angular.module('modules.disputes', [
  'modules.dispute.result.review'
])
  .config(DisputesConfig)
  .controller('DisputesCtrl', DisputesCtrl);

// fn users config
DisputesConfig.$injector = ['$stateProvider'];
function DisputesConfig($stateProvider) {

  $stateProvider
    .state('loggedIn.modules.disputes', {
      url: '/disputes',
      data: {
        pageTitle: 'Dispute Manager',
        page: 'Disputes',
        breadcrumb: 'Disputes'
      },
      views: {
        'main-content': {
          templateUrl: 'modules/disputes/disputes.tpl.html',
          controller: 'DisputesCtrl',
          controllerAs: 'vm'
        }
      },
      resolve: {}
    });
}

// fn user controller
DisputesCtrl.$injector = ['$rootScope', '$scope', '$uibModal', '$templateCache', 'ngTableParams', 'Disputes', 'PAGE', 'Utilities', 'RESULT_STATUS', 'DISPUTE_STATUS'];
function DisputesCtrl($rootScope, $scope, $uibModal, $templateCache, NgTableParams, Disputes, PAGE, Utilities, RESULT_STATUS, DISPUTE_STATUS) {
  var vm = this;

  // variables
  vm.disputes = [];
  vm.disputesTable = null;
  vm.pagination = {};
  vm.params = {};
  vm.keyword = '';

  // methods
  vm.init = init;
  vm.tableInit = tableInit;
  vm.paginationInit = paginationInit;
  vm.getDispute = getDispute;
  vm.getDisputes = getDisputes;
  vm.reloadTable = reloadTable;
  vm.search = search;
  vm.cancelSearch = cancelSearch;
  vm.findResultStatus = findResultStatus;
  vm.bindDisputeStatus = bindDisputeStatus;
  vm.openReviewResult = openReviewResult;

  // watch data
  $scope.$on([
    'dispute:deleted',
    'dispute:uploaded',
    'dispute:created',
    'dispute:updated',
    'dispute:reset'
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

    vm.disputesTable = new NgTableParams({
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

        return vm.getDisputes(vm.params);
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
        vm.disputesTable.page(vm.pagination.page);
      }
    };
  }

  // fn get users
  function getDisputes(params) {

    return Disputes.all(params)
      .then(function (res) {
        vm.disputes = res.data;

        vm.pagination.total = res.total;
        vm.pagination.perPage = res.per_page;
        vm.pagination.page = res.current_page;

        return vm.disputes;
      }, function () {
        vm.disputes = [];

        vm.pagination.total = 0;
        vm.pagination.perPage = PAGE.PER_PAGE;
        vm.pagination.page = 1;

        return [];
      });
  }

  // get resolve user
  function getDispute(dispute) {

    return Disputes.get(dispute.id)
      .then(function (res) {

        return res;
      }, function () {

        return null;
      });
  }

  // fn reload table
  function reloadTable() {
    vm.disputesTable.reload();
  }

  // fn search users
  function search() {
    vm.disputesTable.page(1);
    vm.reloadTable();
  }

  // fn cancel search
  function cancelSearch() {
    vm.keyword = '';
    vm.usersTable.page(1);
    vm.reloadTable();
  }

  // fn find result status
  function findResultStatus(status) {
    switch (status) {
      case RESULT_STATUS.WON: {
        return 'Won';
      }
      case RESULT_STATUS.LOST: {
        return 'Lost';
      }
      case RESULT_STATUS.DNF: {
        return 'DNF';
      }
      default: {
        return 'Not Provided';
      }
    }
  }

  // fn bind dispute status
  function bindDisputeStatus() {
    switch (status) {
      case DISPUTE_STATUS.SOLVED: {
        return 'Solved';
      }
      default: {
        return 'New';
      }
    }
  }

  function openReviewResult(result, index) {
    return $uibModal.open({
      size: '',
      template: $templateCache.get('modules/disputes/review/result.tpl.html'),
      controller: 'ReviewResultCtrl',
      controllerAs: 'vm',
      resolve: {
        $index: function () {
          return index;
        },
        $result: function () {
          return angular.copy(result);
        }
      }
    });
  }
}