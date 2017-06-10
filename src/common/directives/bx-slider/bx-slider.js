angular.module('directive.bx-slider', [])
  .directive('bxSlider', bxSliderDirective)
  .directive('bxSliderItem', bxSliderItemDirective)
  .directive('reviewResultSlider', reviewResultSliderDirective);

bxSliderDirective.$injector = [];
function bxSliderDirective() {

  var BX_SLIDER_OPTIONS = {
    minSlides: 1,
    maxSlides: 3,
    slideMargin: 0,
    nextText: '',
    prevText: '',
    infiniteLoop: false,
    pager: false,
    hideControlOnEnd: true,
    mouseDrag: true
  };

  return {
    restrict: 'A',
    require: 'bxSlider',
    priority: 0,
    controller: function () {
    },
    link: function (scope, element, attrs, ctrl) {

      var slider;

      ctrl.update = function () {

        if (slider) {
          slider.destroySlider();
        }

        slider = element.bxSlider(BX_SLIDER_OPTIONS);
      };
    }
  };
}

bxSliderItemDirective.$injector = ['$timeout'];
function bxSliderItemDirective($timeout) {
  return {
    require: '^bxSlider',
    link: function (scope, elm, attr, bxSliderCtrl) {
      if (scope.$last) {
        $timeout(bxSliderCtrl.update, 1);
      }
    }
  };
}

reviewResultSliderDirective.$injector = ['$timeout'];
function reviewResultSliderDirective($timeout) {

  return {
    restrict: 'AE',
    priority: 500,
    replace: false,
    templateUrl: function () {
      return 'directives/bx-slider/review-result.tpl.html';
    },
    scope: {
      callback: '&',
      noImage: '@',
      list: '='
    },
    controller: ['$scope', '$filter', function ($scope, $filter) {

      var args = [];

      angular.forEach($scope.list, function (value, index) {
        args.push(value);
      });

      $scope.list = args;
    }],
    link: function ($scope, $element, $attrs) {

      $scope.onClick = function (src) {
        $scope.callback({src: src});
      };

      if (!$attrs.noImage) {
        $scope.noImage = 'images/no-image.png';
      }
    }
  };
}