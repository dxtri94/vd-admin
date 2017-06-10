angular.module('security.interceptor', ['security.retryQueue'])

  .factory('securityInterceptor', function ($rootScope, $q, $injector, securityRetryQueue) {
    return {

      // optional method
      'request': function (config) {

        // do something on success
        return config || $q.when(config);
      },

      // optional method
      'requestError': function (rejection) {

        // do something on error
        return $q.reject(rejection);
      },

      // optional method
      'response': function (response) {

        // do something on success
        return response || $q.when(response);
      },

      // optional method
      'responseError': function (rejection) {

        console.log(rejection.config);

        var promise;

        if (rejection.status === 0) {
          $rootScope.$broadcast('response:timeout', rejection);
        }

        if (rejection.status === 400) {  // Bad Request
          $rootScope.$broadcast('API:error:400', rejection);
        }

        if (rejection.status === 401) { // Unauthorized
          $rootScope.$broadcast('API:loading:ended');

          promise = securityRetryQueue.pushRetryFn('unauthorized-server', function retryRequest() {
            return $injector.get('$http')(rejection.config);
          });

          $rootScope.$broadcast('response:authorized:error', rejection);

          //return promise;

        }
        if (rejection.status === 403) { // Fobbiden
        }

        if (rejection.status === 404) { // Not Found
          /*$rootScope.$broadcast('API:loading:ended');

          promise = securityRetryQueue.pushRetryFn('unauthorized-server', function retryRequest() {
            return $injector.get('$http')(rejection.config);
          });

          return promise;*/
        }

        if (rejection.status === 500) { // server error
        }

        return $q.reject(rejection);
      }
    };
  })

  // Push the security interceptor onto the interceptors array
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('securityInterceptor');
  });
