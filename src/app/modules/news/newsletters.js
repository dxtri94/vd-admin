angular.module('modules.newsletters', [
  'modules.newsletter.edit',
  'modules.newsletter.add'
])
  .config(NewslettersConfig)
  .controller('NewslettersCtrl', NewslettersCtrl);

// fn newsletter config
NewslettersConfig.$injector = ['$stateProvider'];
function NewslettersConfig($stateProvider) {
  $stateProvider
    .state('loggedIn.modules.newsletters', {
      url: '/newsletters',
      data: {
        pageTitle: 'Newsletter Manager',
        page: 'Newsletters',
        breadcrumb: 'Newsletters'
      },
      views: {
        'main-content': {
          templateUrl: 'modules/newsletters/newsletters.tpl.html',
          controller: 'NewslettersCtrl',
          controllerAs: 'vm'
        }
      },
      resolve: {
        init: function ($rootScope) {
          $rootScope.$broadcast('pageTitle', 'Newsletter Manager');
          $rootScope.$broadcast('breadcrumb', 'Newsletters');
        }
      }
    });
}

// fn Newsletters controller
NewslettersCtrl.$injector = ['$rootScope', '$scope', '$sce', '$uibModal', '$templateCache', 'ngTableParams', 'Newsletters', 'cfModal', 'PAGE', 'Utilities'];
function NewslettersCtrl($rootScope, $scope, $sce, $uibModal, $templateCache, NgTableParams, Newsletters, cfModal, PAGE, Utilities) {
  var vm = this;

  // variables
  vm.newsletters = [];
  vm.newslettersTable = null;
  vm.pagination = {};
  vm.params = {};
  vm.keyword = '';

  // methods
  vm.init = init;
  vm.tableInit = tableInit;
  vm.paginationInit = paginationInit;
  vm.getNewsletter = getNewsletter;
  vm.getNewsletters = getNewsletters;
  vm.reloadTable = reloadTable;
  vm.search = search;
  vm.cancelSearch = cancelSearch;
  vm.openAdd = openAdd;
  vm.openEdit = openEdit;
  vm.openDestroy = openDestroy;
  vm.detectPaging = detectPaging;
  vm.bindHtmlContent = bindHtmlContent;

  // watch data
  $scope.$on([
    'newsletter:deleted',
    'newsletter:uploaded',
    'newsletter:created',
    'newsletter:updated',
    'newsletter:reset'
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
    vm.newslettersTable = new NgTableParams({
      page: vm.pagination.page || 1,
      sorting: {title: 'asc'}
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

        return vm.getNewsletters(vm.params);
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
        vm.newslettersTable.page(vm.pagination.page);
      }
    };
  }

  // fn get newsletters
  function getNewsletters(params) {

    return Newsletters.all(params)
      .then(function (res) {
        vm.newsletters = res.data;

        vm.pagination.total = res.total;
        vm.pagination.perPage = res.per_page;
        vm.pagination.page = res.current_page;

        // bind content newsletter
        angular.forEach(vm.newsletters, function (item, index) {
          crawlHtmlScript(item);
        });

        return vm.newsletters;
      }, function () {
        vm.newsletters = [];

        vm.pagination.total = 0;
        vm.pagination.perPage = PAGE.PER_PAGE;
        vm.pagination.page = 1;

        return [];
      });
  }

  // fn reload table
  function reloadTable() {
    vm.newslettersTable.reload();
  }

  // fn search Newsletters
  function search() {
    vm.newslettersTable.page(1);
    vm.reloadTable();
  }

  // fn cancel search
  function cancelSearch() {
    vm.keyword = '';
    vm.newslettersTable.page(1);
    vm.reloadTable();
  }

  // get resolve user
  function getNewsletter(user) {

    return Newsletters.get(user.id)
      .then(function (res) {

        return res;
      }, function () {

        return null;
      });
  }

  // fn open edit user account
  function openEdit(newsletter) {

    return $uibModal.open({
      size: 'lg',
      template: $templateCache.get('modules/newsletters/actions/newsletter.tpl.html'),
      controller: 'EditNewsletterCtrl',
      controllerAs: 'vm',
      resolve: {
        $newsletter: function () {
          return angular.copy(newsletter);
        }
      }
    });
  }

  // fn open reset password to user popup
  function openAdd() {
    return $uibModal.open({
      size: 'lg',
      template: $templateCache.get('modules/newsletters/actions/newsletter.tpl.html'),
      controller: 'AddNewsletterCtrl',
      controllerAs: 'vm',
      resolve: {}
    });
  }

  // open confirm delete user
  function openDestroy(newsletter) {

    return cfModal.open({
      size: 'sm',
      title: 'Delete Newsletter?',
      content: 'Are you sure you want to delete <br /> this newsletter?',
      cancel: function (uibModelInstance) {
        uibModelInstance.dismiss('cancel');
      },
      confirm: function (uibModelInstance) {
        Newsletters.destroy(game.id)
          .then(function () {

            $rootScope.$broadcast('newsletter:deleted');
            uibModelInstance.dismiss('cancel');

            vm.detectPaging(vm.newsletters.length - 1);
          }, function (error) {
            console.log('delete newsletter: ', error);
          });
      }
    });
  }

  // reset page when destroy all item in list
  function detectPaging(length) {
    if (length === 0 && vm.pagination.page > 1) {
      vm.pagination.page--;
      vm.newslettersTable.page(vm.pagination.page);
    }

    vm.reloadTable();
  }

  // fn bind html content
  function bindHtmlContent(content) {

    return $sce.trustAsHtml(content);
  }

  // filter description
  function crawlHtmlScript(item) {

    var $selectors = $(item.content);

    var isImage = false,
      isHeading = false;
    $selectors.each(function (index, element) {

      if (!isHeading) {
        var heading = $(element).is('p');
        if (heading) {
          isHeading = true;
          item.heading = '<p>' + $(element).html() + '</p>';
        }
      }

      if (!isImage) {
        var image = $(element).find('img');
        if (image) {
          isImage = true;
          item.image = image;
        }
      }

    });
  }
}