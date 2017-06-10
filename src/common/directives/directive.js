angular.module('directive', [
  'directive.cf-modal',
  'directive.search-box',
  'directive.bx-slider'
])

  .directive('pageTitle', pageTitle)
  .directive('sideNavigation', sideNavigation)
  .directive('iboxTools', iboxTools)
  .directive('minimalizeSidebar', minimalizeSidebar)
  .directive('vectorMap', vectorMap)
  .directive('sparkline', sparkline)
  .directive('icheck', icheck)
  .directive('ionRangeSlider', ionRangeSlider)
  .directive('dropZone', dropZone)
  .directive('responsiveVideo', responsiveVideo)
  .directive('autoResize', autoResize)
  .directive('fixHeight', fixHeight)
  .directive('uiToggleClass', uiToogleClass)
  .directive('uiNav', uiNav)
  .directive('uiScroll', uiScroll)
  .directive('uiScrollDown', uiScrollDown)
  .directive('uiScrollTo', uiScrollTo)
  .directive('uiButterbar', uiButterbar)
  .directive('validForm', validForm)
  .directive('scrollBarCustom', scrollBarCustom)
  .directive('validateEmail', validateEmail)
  .directive('passwordVerify', passwordVerify)
  .directive('landing', landing)
  .directive('validNumber', validNumber)
  .directive('validDate', validDate)
  .directive('ngEnter', ngEnter)
  .directive('disableKeypress', disableKeypress)
  .directive('autofocus', autofocus)
  .directive('countdown', countdown)
  .directive('minHeight', minHeight)
  .directive('ngBlurLocation', ngBlurLocation);

function uiToogleClass($timeout, $document) {
  return {
    restrict: 'AC',
    link: function (scope, el, attr) {
      el.on('click', function (e) {
        e.preventDefault();
        //var array = [];
        var classes = attr.uiToggleClass.split(','),
          targets = (attr.target && attr.target.split(',')) || new Array(el),
          key = 0;
        angular.forEach(classes, function (_class) {
          var target = targets[(targets.length && key)];
          if (( _class.indexOf('*') !== -1 ) && magic(_class, target)) {
          }
          $(target).toggleClass(_class);
          key++;
        });
        $(el).toggleClass('active');

        function magic(_class, target) {
          var patt = new RegExp('\\s' +
            _class.replace(/\*/g, '[A-Za-z0-9-_]+').split(' ').join('\\s|\\s') +
            '\\s', 'g');
          var cn = ' ' + $(target)[0].className + ' ';
          while (patt.test(cn)) {
            cn = cn.replace(patt, ' ');
          }
          $(target)[0].className = $.trim(cn);
        }
      });
    }
  };
}

function uiNav($timeout) {
  return {
    restrict: 'AC',
    link: function (scope, el, attr) {
      var _window = $(window),
        _mb = 768,
        wrap = $('.app-aside'),
        next,
        backdrop = '.dropdown-backdrop';
      // unfolded
      el.on('click', 'a', function (e) {
        var a = next && next.trigger('mouseleave.nav') ? true : false;
        var _this = $(this);
        _this.parent().siblings(".active").toggleClass('active');
        var b = _this.next().is('ul') && _this.parent().toggleClass('active') && e.preventDefault() ? true : false;
        // mobile
        var c = _this.next().is('ul') || ( ( _window.width() < _mb ) && $('.app-aside').removeClass('show off-screen') ) ? true : false;
      });

      // folded & fixed
      el.on('mouseenter', 'a', function (e) {
        var a = next && next.trigger('mouseleave.nav') ? true : false;
        $('> .nav', wrap).remove();
        if (!$('.app-aside-fixed.app-aside-folded').length || ( _window.width() < _mb ) || $('.app-aside-dock').length) {
          return;
        }
        var _this = $(e.target),
          top,
          w_h = $(window).height(),
          offset = 50,
          min = 150;

        var b = !_this.is('a') && (_this = _this.closest('a')) ? true : false;
        if (_this.next().is('ul')) {
          next = _this.next();
        } else {
          return;
        }

        _this.parent().addClass('active');
        top = _this.parent().position().top + offset;
        next.css('top', top);
        if (top + next.height() > w_h) {
          next.css('bottom', 0);
        }
        if (top + min > w_h) {
          next.css('bottom', w_h - top - offset).css('top', 'auto');
        }
        next.appendTo(wrap);

        next.on('mouseleave.nav', function (e) {
          $(backdrop).remove();
          next.appendTo(_this.parent());
          next.off('mouseleave.nav').css('top', 'auto').css('bottom', 'auto');
          _this.parent().removeClass('active');
        });

        var c = $('.smart').length && $('<div class="dropdown-backdrop"/>').insertAfter('.app-aside').on('click', function (next) {
          var a = next && next.trigger('mouseleave.nav') ? true : false;
        }) ? true : false;

      });

      wrap.on('mouseleave', function (e) {
        var a = next && next.trigger('mouseleave.nav') ? true : false;
        $('> .nav', wrap).remove();
      });
    }
  };
}

//Scroll
function uiScroll($location, $anchorScroll) {
  return {
    restrict: 'AC',
    link: function (scope, el, attr) {
      el.on('click', function (e) {
        $location.hash(attr.uiScroll);
        $anchorScroll();
      });
    }
  };
}

function uiScrollDown($window, $timeout) {
  return {
    restrict: 'AC',
    link: function ($scope, $element, $attr) {

      function init() {
        if ($('body').scrollTop() >= 70) {
          $(".landing .navbar").addClass("navbar-scroll");
        }

        $(window).scroll(function () {
          var scroll = $(window).scrollTop();

          if (scroll >= 70) {
            $(".landing .navbar").addClass("navbar-scroll");
          } else {
            $(".landing .navbar").removeClass("navbar-scroll");
          }
        });
      }

      $timeout(init);
    }
  };
}

function uiButterbar($rootScope, $anchorScroll) {
  return {
    restrict: 'AC',
    template: '<span class="bar"></span>',
    link: function (scope, el, attrs) {
      el.addClass('butterbar hide');

      function start(event) {
        $anchorScroll();
        el.removeClass('hide').addClass('active');
      }

      function end(event) {
        event.targetScope.$watch('$viewContentLoaded', function () {
          el.addClass('hide').removeClass('active');
        });
      }

      scope.$on('butterBar:start', start);

      scope.$on('butterBar:end', end);
    }
  };
}

function validForm() {
  return {
    require: '^form',
    restrict: 'A',
    link: function ($scope, $ele, $attrs, $controller) {

      var currentForm = getCurrentForm($scope);
      if (!currentForm || !currentForm.$name) {
        console.log('cannot found');
      }

      $scope.$watch($controller.$name + ".$valid", function (isValid, lastValue) {
        if (isValid !== undefined) {
          $scope.$emit($controller.$name + ':changed', {
            isValid: isValid,
            element: $ele,
            expression: this.exp,
            scope: $scope,
            ctrl: $controller
          });
        }
      });

      function getCurrentForm(scope) {
        var form = null;
        var requiredFormProps = ["$error", "$name", "$dirty", "$pristine", "$valid", "$invalid", "$addControl", "$removeControl", "$setValidity", "$setDirty"];

        for (var p in scope) {
          if (_.isObject(scope[p]) && !_.isFunction(scope[p]) && !_.isArray(scope[p]) && p.substr(0, 1) !== "$") {
            var props = _.keys(scope[p]);
            if (props.length < requiredFormProps.length) {
              continue;
            }

            var bool = false;
            for (var key in requiredFormProps) {
              bool = _.contains(props, requiredFormProps[key]);
            }

            if (bool) {
              form = scope[p];
              break;
            }
          }
        }
        return form;
      }
    }
  };
}

// fn page title
function pageTitle($rootScope, $timeout) {
  return {
    link: function (scope, element) {
      var listener = function (event, toState, toParams, fromState, fromParams) {

        // Default title - load on Dashboard
        var title = 'Play Or Go | Admin Panel';

        // Create your own title pattern
        if (toState.data && toState.data.pageTitle) {
          title = 'Play Or Go | ' + toState.data.pageTitle;
        }

        $timeout(function () {
          element.text(title);
        });
      };
      $rootScope.$on('$stateChangeStart', listener);
    }
  };
}

/**
 * sideNavigation - Directive for run metsiMenu on sidebar navigation
 */
function sideNavigation($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element) {
      // Call the metsiMenu plugin and plug it to sidebar navigation
      $timeout(function () {
        element.metisMenu();

      });
    }
  };
}

/**
 * responsibleVideo - Directive for responsive video
 */
function responsiveVideo() {
  return {
    restrict: 'A',
    link: function (scope, element) {
      var figure = element;
      var video = element.children();
      video
        .attr('data-aspectRatio', video.height() / video.width())
        .removeAttr('height')
        .removeAttr('width');

      //We can use $watch on $window.innerWidth also.
      $(window).resize(function () {
        var newWidth = figure.width();
        video
          .width(newWidth)
          .height(newWidth * video.attr('data-aspectRatio'));
      }).resize();
    }
  };
}

/**
 * iboxTools - Directive for iBox tools elements in right corner of ibox
 */
function iboxTools($timeout) {
  return {
    restrict: 'A',
    scope: true,
    templateUrl: 'views/common/ibox_tools.html',
    controller: function ($scope, $element) {
      // Function for collapse ibox
      $scope.showhide = function () {
        var ibox = $element.closest('div.ibox');
        var icon = $element.find('i:first');
        var content = ibox.find('div.ibox-content');
        content.slideToggle(200);
        // Toggle icon from up to down
        icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        ibox.toggleClass('').toggleClass('border-bottom');
        $timeout(function () {
          ibox.resize();
          ibox.find('[id^=map-]').resize();
        }, 50);
      };
      // Function for close ibox
      $scope.closebox = function () {
        var ibox = $element.closest('div.ibox');
        ibox.remove();
      };
    }
  };
}

/**
 * minimalizaSidebar - Directive for minimalize sidebar
 */
function minimalizeSidebar($timeout) {
  return {
    restrict: 'A',
    template: '<a class="navbar-minimalize minimalize-style-2 btn btn-main b-r-none" ng-click="vm.minimalize()"><i class="icon-remove-corner"></i></a>',
    controller: function ($scope, $element) {

      var vm = this;

      vm.minimalize = minimalize;

      function minimalize() {
        $("body").toggleClass("mini-navbar");
        if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
          // Hide menu in order to smoothly turn on when maximize menu
          $('#side-menu').hide();
          // For smoothly turn on menu
          setTimeout(
            function () {
              $('#side-menu').fadeIn(500);
            }, 100);
        } else if ($('body').hasClass('fixed-sidebar')) {
          $('#side-menu').hide();
          setTimeout(
            function () {
              $('#side-menu').fadeIn(500);
            }, 300);
        } else {
          // Remove all inline style from jquery fadeIn function to reset menu state
          $('#side-menu').removeAttr('style');
        }
      }
    },
    controllerAs: 'vm'
  };
}

/**
 * vectorMap - Directive for Vector map plugin
 */
function vectorMap() {
  return {
    restrict: 'A',
    scope: {
      myMapData: '='
    },
    link: function (scope, element, attrs) {
      element.vectorMap({
        map: 'world_mill_en',
        backgroundColor: "transparent",
        regionStyle: {
          initial: {
            fill: '#e4e4e4',
            "fill-opacity": 0.9,
            stroke: 'none',
            "stroke-width": 0,
            "stroke-opacity": 0
          }
        },
        series: {
          regions: [
            {
              values: scope.myMapData,
              scale: ["#1ab394", "#22d6b1"],
              normalizeFunction: 'polynomial'
            }
          ]
        }
      });
    }
  };
}


/**
 * sparkline - Directive for Sparkline chart
 */
function sparkline() {
  return {
    restrict: 'A',
    scope: {
      sparkData: '=',
      sparkOptions: '='
    },
    link: function (scope, element, attrs) {
      scope.$watch(scope.sparkData, function () {
        render();
      });
      scope.$watch(scope.sparkOptions, function () {
        render();
      });
      var render = function () {
        $(element).sparkline(scope.sparkData, scope.sparkOptions);
      };
    }
  };
}

/**
 * icheck - Directive for custom checkbox icheck
 */
function icheck($timeout) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function ($scope, element, $attrs, ngModel) {
      return $timeout(function () {
        var value;
        value = $attrs['value'];

        $scope.$watch($attrs['ngModel'], function (newValue) {
          $(element).iCheck('update');
        });

        $scope.theme = $attrs.icheck ? $attrs.icheck : 'blue';

        return $(element).iCheck({
          checkboxClass: 'icheckbox_square-' + $scope.theme,
          radioClass: 'iradio_square-' + $scope.theme
        }).on('ifChanged', function (event) {
          if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
            $scope.$apply(function () {
              return ngModel.$setViewValue(event.target.checked);
            });
          }
          if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
            return $scope.$apply(function () {
              return ngModel.$setViewValue(value);
            });
          }
        });
      });
    }
  };
}

/**
 * ionRangeSlider - Directive for Ion Range Slider
 */
function ionRangeSlider() {
  return {
    restrict: 'A',
    scope: {
      rangeOptions: '='
    },
    link: function (scope, elem, attrs) {
      elem.ionRangeSlider(scope.rangeOptions);
    }
  };
}

/**
 * dropZone - Directive for Drag and drop zone file upload plugin
 */
function dropZone() {
  return function (scope, element, attrs) {
    element.dropzone({
      url: "/upload",
      maxFilesize: 100,
      paramName: "uploadfile",
      maxThumbnailFilesize: 5,
      init: function () {
        scope.files.push({file: 'added'});
        this.on('success', function (file, json) {
        });
        this.on('addedfile', function (file) {
          scope.$apply(function () {
            alert(file);
            scope.files.push({file: 'added'});
          });
        });
        this.on('drop', function (file) {
          alert('file');
        });
      }
    });
  };
}

// auto resize
function autoResize($timeout) {
  return {
    restrict: 'A',
    link: function ($scope, $element, $attrs) {

      $scope.minimalize = function () {
        // Minimalize menu when screen is less than 768px
        if ($(this).width() < 769) {
          $('body').addClass('body-small');
        } else {
          $('body').removeClass('body-small');
        }
      };

      $timeout($scope.minimalize);

      $(window).bind('load resize', $scope.minimalize);
    }
  };
}

// fix height
function fixHeight($timeout) {
  return {
    restrict: 'A',
    link: function ($scope, $element, $attrs) {
      // Full height of sidebar
      function fix_height() {
        var heightWithoutNavbar = $("body > #wrapper").height() - 61;
        $(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");
      }

      $(window).bind("load resize click scroll", function () {
        if (!$("body").hasClass('body-small')) {
          fix_height();
        }
      });

      fix_height();
    }
  };
}

function scrollBarCustom($timeout) {
  return {
    restrict: 'A',
    link: function ($scope, $element, $attrs) {

      $timeout(function () {
        $($element[0]).perfectScrollbar();
      });

    }
  };
}

function validateEmail($timeout) {
  var EMAIL_REGEXP = /^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-z0-9-]+)*(\.[a-zA-Z]{2,5})$/;

  return {
    require: '^ngModel',
    restrict: 'A',
    link: function (scope, elm, attrs, ctrl) {

      scope.$watch(function () {
        return ctrl.$viewValue;
      }, function (value) {
        if (value) {
          var isMatchRegex = EMAIL_REGEXP.test(value);
          if (isMatchRegex) {
            ctrl.$setValidity("ngEmail", true);
          } else {
            ctrl.$setValidity("ngEmail", false);
          }
          return value;
        }
      });
    }
  };
}

function passwordVerify() {
  return {
    require: "ngModel",
    scope: {
      passwordVerify: '='
    },
    link: function (scope, element, attrs, ctrl) {
      scope.$watch(function () {
        var combined;

        if (scope.passwordVerify || ctrl.$viewValue) {
          combined = scope.passwordVerify + '_' + ctrl.$viewValue;
        }
        return combined;
      }, function (value) {
        if (value) {
          ctrl.$parsers.unshift(function (viewValue) {
            var origin = scope.passwordVerify;
            if (origin !== viewValue) {
              ctrl.$setValidity("passwordVerify", false);
              return undefined;
            } else {
              ctrl.$setValidity("passwordVerify", true);
              return viewValue;
            }
          });
        }
      });
    }
  };
}

function uiScrollTo($timeout, $parse) {
  return {
    subtract: 'AE',
    link: function ($scope, $element, $attrs) {
      function init() {

        var $target = $($attrs.uiScrollTo),
          $interval = $parse($attrs.interval)($scope) || 500;

        $element.on('click', function () {
          $('html, body').animate({
            scrollTop: $target.offset().top
          }, $interval);
        });
      }

      $timeout(init);
    }
  };
}

function landing($state, $rootScope, $timeout) {
  return {
    subtract: 'AE',
    link: function ($scope, $element, $attrs) {
      function handleBody() {
        $('body').addClass('landing');
      }

      $timeout(handleBody);

      $scope.$on([
        '$stateChangeSuccess'
      ], function () {
        $('body.landing').removeClass('landing');
      });
    }
  };
}

function validNumber() {
  return {
    require: '?ngModel',
    link: function ($scope, $element, $attrs, $ngModel) {
      if (!$ngModel) {
        return;
      }

      $ngModel.$parsers.push(function (value) {
        if (angular.isUndefined(value)) {
          value = '';
        }
        var clean = value.replace(/[^0-9\.]/g, '');
        var decimalCheck = clean.split('.');

        if (!angular.isUndefined(decimalCheck[1])) {
          decimalCheck[1] = decimalCheck[1].slice(0, 2);
          clean = decimalCheck[0] + '.' + decimalCheck[1];
        }

        if (value !== clean) {
          $ngModel.$setViewValue(clean);
          $ngModel.$render();
        }
        return clean;
      });

      $element.bind('keypress', function (event) {
        if (event.keyCode === 32) {
          event.preventDefault();
        }
      });
    }
  };
}

function validDate(Utilities, $parse) {
  return {
    require: '?ngModel',
    link: function ($scope, $element, $attrs, $ngModel) {

      if (!$ngModel) {
        return false;
      }

      // validate value
      function validate(value) {

        if (!value) {
          $ngModel.$setValidity('dateFormat', true);
        }

        var date = new Date(value);
        var isDateFormat = !isNaN(date.getTime()) || date.getTime() === 0;
        $ngModel.$setValidity('dateFormat', isDateFormat);

        return value;
      }

      $element.bind('keypress', function () {
        event.preventDefault();
      });

      $ngModel.$parsers.unshift(validate);
      $ngModel.$formatters.push(validate);

      $scope.$watch(function () {
        return $ngModel;
      }, function () {
        validate($ngModel);
      });

      $element.bind('keypress', function (event) {
        if (event.keyCode === 32) {
          event.preventDefault();
        }
      });
    }
  };
}

function disableKeypress() {
  return {
    link: function ($scope, $element, $attrs, $ngModel) {
      $element.bind('keypress', function (event) {
        event.preventDefault();
      });
    }
  };
}

function ngEnter() {
  return {
    link: function ($scope, $element, $attrs, $ngModel) {

      $element.bind('keypress', function (event) {
        if (event.which === 13) {
          $scope.$apply(function () {
            $scope.$eval($attrs.ngEnter);
          });
        }
      });
    }
  };
}

function autofocus($timeout) {
  return {
    restrict: 'A',
    link: function ($scope, $element, $attrs) {
      $timeout(function () {
        if ($($element[0]).is('input')) {
          $element[0].focus();
        } else {
          $($element[0]).find('input[type=text], input[type=email], input[type=password]').first()[0].focus();
        }
      });
    }
  };
}

function countdown($timeout, $interval) {
  return {
    restrict: 'AE',
    scope: {
      date: '=',
      down: '@'
    },
    template: '<span>{{ value }}</span>',
    link: function ($scope, $element, $attrs) {
      var s = 1,
        m = 60,
        h = 60 * 60,
        d = 60 * 60 * 24;

      function handle(time) {
        var days, hours, minutes, seconds;
        days = Math.floor(time / d);

        time -= days * d;
        hours = Math.floor(time / h) % 24;

        time -= hours * 3600;
        minutes = Math.floor(time / m) % 60;

        time -= minutes * 60;
        seconds = time % 60;

        if (days > 0) {
          $scope.value = [days + 'd', hours + 'h', minutes + 'm', seconds + 's'].join(' ');
        } else if (hours > 0) {
          $scope.value = [hours + 'h', minutes + 'm', seconds + 's'].join(' ');
        } else {
          $scope.value = [minutes + 'm', seconds + 's'].join(' ');
        }
      }

      // countdown
      var life = $interval(function () {

        var now = new Date();
        var datetime = new Date($scope.date);

        var diff = Math.floor((datetime.getTime() - now.getTime()) / 1000);

        if (diff <= 0) {
          clearInterval(life);
          $scope.value = ['0m', '0s'].join(' ');
          return;
        }

        handle(diff);

      }, $attrs.counter ? parseInt($attrs.counter) : 1000);
    }
  };
}

function minHeight($timeout) {
  return {
    restrict: 'A',
    scope: {
      offset: '@'
    },
    link: function ($scope, $element, $attrs) {

      if (!$scope.offset && typeof parseInt($scope.offset) !== 'number' && isNaN(parseInt($scope.offset))) {
        $scope.offset = 0;
      } else {
        $scope.offset = parseInt($scope.offset);
      }

      function setHeight() {
        $($element[0]).css('min-height', $(window).height() - $scope.offset);
      }

      $(window).bind('load resize', setHeight);
      $timeout(setHeight);
    }
  };
}

function ngBlurLocation($timeout) {
  return {
    restrict: 'A',
    required: 'ngModel',
    scope: true,
    transclude: true,
    link: function ($scope, $ele, $attrs) {
      console.log($scope.ngBlurLocation);
    }
  };
}