angular.module('directive.cf-modal', [])

  .factory('cfModal', cfModalService)
  .directive('cfModal', cfModalDirective)
  .directive('modalCenter', modalCenterDirective);

// fn confirm popup service
function cfModalService($uibModal, Utilities, $timeout, $templateCache) {

  var service = {
    options: {
      size: 'sm',
      title: 'Title',
      content: 'Content',
      labels: {
        confirm: 'Confirm',
        cancel: 'Cancel'
      },
      buttons: [
        {
          label: 'Confirm',
          event: null
        }
      ],
      callback: null,
      close: null,
      ok: null
    },

    // handle option
    handleOptions: function (options) {

      if (options.buttons && $.isArray(options.buttons)) {
        service.options.buttons = options.buttons;
      }
    },

    // open popup
    open: function (options) {

      service.handleOptions(options);

      var $uibModalInstance = $uibModal.open({
        size: options.size || 'xs',
        keyboard: options.size || true,
        backdrop: options.backdrop || 'static',
        template: function () {

          switch (options.template) {
            case 'error-box': {
              return $templateCache.get('directives/cf-modal/error.tpl.html');
            }
          }

          return $templateCache.get('directives/cf-modal/cf-modal.tpl.html');
        },
        controller: function ($scope, $uibModalInstance) {

          $scope.content = options.content || 'Message';
          $scope.title = options.title || false;
          $scope.isClose = !!options.close;

          // buttons
          if (options.buttons && $.isArray(options.buttons)) {
            $scope.buttons = options.buttons;
          }

          // events
          if (options.cancel) {
            $scope.isCancel = true;
          }

          // labels
          $scope.labelConfirm = 'Confirm';
          $scope.labelCancel = 'Cancel';
          if (options.labels) {
            $scope.labelConfirm = options.labels.confirm || 'Confirm';
            $scope.labelCancel = options.labels.cancel || 'Cancel';
          }

          // classes
          if (options.classes) {
            $scope.classes = options.classes;
          }

          // actions
          $scope.actions = {
            // callback popup
            cancel: function () {
              if (options.cancel || typeof(options.cancel) === 'function') {
                options.cancel($uibModalInstance);
              } else {
                $uibModalInstance.dismiss('cancel');
              }
            },

            // callback confirm popup
            confirm: function () {
              if (options.confirm && typeof(options.confirm === 'function')) {
                options.confirm($uibModalInstance);
              } else {
                $uibModalInstance.dismiss('cancel');
              }
            },

            // fn close popup
            close: function () {
              $uibModalInstance.dismiss('cancel');
            }
          };
        }
      });

      // opened callback
      $uibModalInstance.opened.then(function () {
        if (options.callback && typeof(options.callback) === 'function') {
          options.callback();
        }
      });

      // result callback
      $uibModalInstance.result.then(function () {
        // success
      }, function (reason) {
        // reason close popup
        Utilities.detectFails(reason, ['backdrop', 'cancel', 'escape'], function () {
          if (options.close && typeof(options.close) === 'function') {
            options.close(this);
          }
        });
      });

      return $uibModalInstance;
    }
  };

  return service;
}

// fn confirm popup directive
function modalCenterDirective($timeout) {

  return {
    restrict: 'A',
    link: function ($scope, $element, $attrs) {

      $scope.setPosition = function () {
        var $popup = $($element[0]).parents('.modal-dialog');
        var $window = $(window);

        var top = ($window.height() - $popup.height()) / 2;

        if (top < 10) {
          top = 10;
        }

        $popup.css('margin-top', top);
      };

      $timeout($scope.setPosition);
      $(window).bind('resize', $scope.setPosition);
    }
  };
}

// fn popup to center screen directive
function cfModalDirective($uibModal, Utilities, $timeout) {
  return {
    restrict: 'A',
    scope: {
      item: '=',
      title: '@',
      content: '@',
      accept: '&',
      cancel: '&',
      active: '='
    },
    link: function ($scope, $element, $attrs, $ctrl) {

      $element.bind('click', function () {
        var modalInstance = $uibModal.open({
          size: $attrs.size || 'md',
          backdrop: true,
          templateUrl: 'directives/cf-modal/cf-modal.tpl.html',
          resolve: {
            title: function () {
              return $attrs.title || 'Confirm';
            },
            content: function () {
              return $attrs.content || 'Please confirm you actions. Thanks';
            },
            $item: function () {
              return $scope.item;
            },
            $accept: function () {
              return $scope.accept;
            },
            $cancel: function () {
              return $scope.cancel;
            }
          },
          controller: function ($scope, $uibModalInstance, $item, $accept, $cancel, title, content) {
            $scope.title = title;
            $scope.content = content;

            $scope.error = false;

            $scope.actions = {
              accept: function () {
                $accept($item, $uibModalInstance);
                $scope.actions.cancel();
              },
              cancel: function () {
                $uibModalInstance.dismiss('cancel');
              }
            };
          }
        });

        modalInstance.opened.then(function () {
          $scope.active = true;
        });

        modalInstance.result.then(function () {
          $scope.active = false;
        }, function (reason) {
          Utilities.detectFails(reason, ['backdrop', 'cancel', 'escape'], function () {
            $scope.active = false;
          });
        });
      });
    }
  };
}