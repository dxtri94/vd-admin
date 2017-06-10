angular.module('directive.search-box', [])
  .directive('searchBox', SearchBoxDirective);

SearchBoxDirective.$injector = ['$templateCache'];
function SearchBoxDirective($templateCache) {
  return {
    restrict: 'AE',
    scope: {
      search: '&',
      cancel: '&',
      keyword: '=ngModel'
    },
    template: $templateCache.get('directives/search-box/search-box.tpl.html'),
    replace: true,
    link: SearchBoxLink
  };

  // fn link to directive
  function SearchBoxLink($scope, $element, $attrs, $ngModel) {
    $scope.isCancel = false;
    $scope.isSearch = false;

    if ($attrs.search) {
      $scope.isSearch = true;
    }

    $scope.placeholder = $attrs.placeholder ? $attrs.placeholder : 'Search';

    $scope.actions = {
      // fn cancel
      cancel: function () {
        $scope.cancel();
      },

      // fn searching
      search: function () {
        $scope.search();
      },

      // fn event key press
      keyPress: function ($event) {
        var keyCode = $event.which || $event.keyCode;

        switch (keyCode) {
          case 13: // enter
          {
            if ($scope.keyword !== undefined) {
              $scope.actions.search();
            }
            break;
          }
        }
      }
    };

    $scope.$watch('keyword', function () {
      if ($attrs.cancel && $scope.keyword) {
        $scope.isCancel = true;
      } else {
        $scope.isCancel = false;
      }
    });
  }
}

