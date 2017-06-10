angular.module('app.printer', [])
  
  .factory('Printer',
    function ($rootScope, $compile, $http, $timeout, $q, $templateCache) {

      // fn print firefox html
      var printFirefoxHtml = function (html) {
        var deferred = $q.defer();
        var disp_setting = 'toolbar=no, status = no,resizable =no, location=no, directories=no, menubar=no, scrollbars=no, width=800, height=800';

        var win = window.open('', '', disp_setting);
        win.document.write(html);
        win.document.close();// new line
        win.focus();
        deferred.resolve();
        win.print();
        win.close();
        return deferred.promise;

      };

      var printIEHtml = function (html) {
        var deferred = $q.defer();
        var disp_setting = "toolbar=no, status = no,resizable =no, location=no, directories=no, menubar=no, scrollbars=no, width=800, height=800";
        var win = window.open('', '', disp_setting);
        win.document.write(html);
        win.document.close();
        win.focus();
        deferred.resolve();
        win.print();
        win.close();
        return deferred.promise;
      };

      // fn print chrome html
      var printChromeHtml = function (html) {
        var deferred = $q.defer();
        var hiddenFrame = $('<iframe style="display: none"></iframe>').appendTo('body')[0];
        hiddenFrame.contentWindow.printAndRemove = function () {
          hiddenFrame.contentWindow.print();
          $(hiddenFrame).remove();
        };
        var htmlContent = "<!doctype html>" +
          "<html>" +
          '<body onload="printAndRemove();">' +
          html +
          '</body>' +
          "</html>";
        var doc = hiddenFrame.contentWindow.document.open("text/html", "replace");
        doc.write(htmlContent);
        deferred.resolve();
        doc.close();
        return deferred.promise;
      };

      var printHtml = function (html) {
        if (navigator.userAgent.toLowerCase().search('firefox') !== -1) {
          printFirefoxHtml(html);
        } else if (navigator.userAgent.toLowerCase().search('chrome') !== -1) {
          printChromeHtml(html);
        } else if (navigator.userAgent.toLowerCase().search('ie') !== -1) {
          printIEHtml(html);
        }
      };

      var openNewWindow = function (html) {
        var newWindow = window.open("printTest.html");
        newWindow.addEventListener('load', function () {
          $(newWindow.document.body).html(html);
        }, false);
      };

      var print = function (templateUrl, data) {
        $http.get(templateUrl, {
          cache: $templateCache
        }).success(function (template) {

          var printScope = $rootScope.$new();
          angular.extend(printScope, data);
          var element = $compile($('<div>' + template + '</div>'))(printScope);
          var waitForRenderAndPrint = function () {
            if (printScope.$$phase || $http.pendingRequests.length) {
              $timeout(waitForRenderAndPrint);
            } else {
              // Replace printHtml with openNewWindow for debugging
              printHtml(element.html());
              printScope.$destroy();
            }
          };
          waitForRenderAndPrint();
        });
      };

      var printFromScope = function (templateUrl, scope) {
        $rootScope.isBeingPrinted = true;
        $http.get(templateUrl, {
          cache: $templateCache
        }).success(function (template) {
          var printScope = scope;
          var element = $compile($('<div>' + template + '</div>'))(printScope);
          var waitForRenderAndPrint = function () {
            if (printScope.$$phase || $http.pendingRequests.length) {
              $timeout(waitForRenderAndPrint);
            } else {
              printHtml(element.html()).then(function () {
                $rootScope.isBeingPrinted = false;
              });

            }
          };
          waitForRenderAndPrint();
        });
      };

      return {
        print: print,
        printFromScope: printFromScope
      };
    }
  );
