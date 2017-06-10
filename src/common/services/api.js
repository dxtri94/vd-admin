angular.module('services.api', [
  'restangular',
  'services.i18nNotifications'
])

  .factory('apiService', function (Restangular, i18nNotifications, $cookieStore, $rootScope, CONFIGS) {

    var baseUrl = CONFIGS.baseURL();

    // Global configuration for Restangular API connection.
    Restangular.setBaseUrl(baseUrl);
    Restangular.setFullResponse(true);

    Restangular.addResponseInterceptor(function (response, operation, what, url) {
      $rootScope.$broadcast('API:loading:ended', what);

      if (operation === 'getList') {
        var responseArr = [];
        responseArr['data'] = response;
        return responseArr;
      }


      return response;
    });

    Restangular.addRequestInterceptor(function (element, operation, what, url) {
      $rootScope.$broadcast('API:loading:started', what);

      var data = {
        element: element,
        operation: operation,
        what: what,
        url: url
      };
    });

    Restangular.setErrorInterceptor(function (response, deferred, responseHandler) {
      $rootScope.$broadcast('API:loading:ended');

      console.log("Response received with HTTP error code: " + response.status);

      return true; // error not handled
    });

    var service = {
      all: function (resource, queryParams) {
        if (typeof queryParams === undefined) {
          return Restangular.all(resource).getList();
        }
        return Restangular.all(resource).getList(queryParams);
      },

      findAll: function (resource) {
        return Restangular.all(resource);
      },

      find: function (resource, id) {
        return Restangular.one(resource, id);
      },

      get: function (resource, id) {
        return Restangular.one(resource, id).get();
      },

      post: function (resource, data) {
        if (arguments.length === 1) {
          data = {};
        }
        return Restangular.all(resource).post(data);
      },

      customPOST: function (resource, path, data) {
        return service.find(resource).customPOST('', path, data);
      },

      customGET: function (resource, path, data) {
        return Restangular.all(resource).customGET(path, data);
      },

      customPUT: function (resource, id, data) {
        return service.find(resource, id).customPUT(data);
      },

      customPUTAdvance: function (resource, id, data, path) {
        return service.find(resource, id).one(path).customPUT(data);
      },

      upload: function (resource, fd) {
        return Restangular.all(resource)
          .withHttpConfig({transformRequest: angular.identity})
          .post(fd, undefined, {'Content-type': undefined});
      },

      put: function (resource, data) {
        return Restangular.all(resource).customPUT(data);
      },

      delete: function (resource, data) {
        return Restangular.one(resource).remove(data);
      },

      remove: function (resource, id) {
        return Restangular.one(resource, id).remove();
      },

      setAuthTokenHeader: function (authToken) {
        Restangular.setDefaultHeaders({Authorization: authToken});
      }
    };

    return service;
  });
