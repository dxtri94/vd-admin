angular.module('resources.categories', [])
  .factory('Categories', CategoriesService);

CategoriesService.$injector = ['apiService', '$q'];
function CategoriesService(apiService, $q) {
  var resource = 'categories';

  var service = {
    current: null,
    list: [],

    all: all,
    get: get,
    post: post,
    put: put,
    destroy: destroy
  };

  return service;

  // fn get all item
  function all(params) {
    var deferred = $q.defer();

    apiService.all(resource, params)
      .then(function (res) {

        var response = res.data.data;
        if (!response.error) {

          service.users = response.data;
          deferred.resolve(response.data);
        }
      }, function (error) {
        deferred.reject(error.data);
      });

    return deferred.promise;
  }

  // fn get
  function get(id) {
    var deferred = $q.defer();

    apiService.get(resource, id)
      .then(function (res) {

        var response = res.data;
        if (!response.error) {
          deferred.resolve(response.data);
        }
      }, function (error) {
        deferred.reject(error.data);
      });

    return deferred.promise;
  }

  // fn store a new user
  function post(params) {
    var deferred = $q.defer();

    apiService.post(resource, params)
      .then(function success(res) {

        var response = res.data;
        if (!response.error) {
          deferred.resolve(response.data);
        }
      }, function (error) {
        deferred.reject(error.data);
      });

    return deferred.promise;
  }

  // fn update an item
  function put(id, params) {
    var deferred = $q.defer();

    apiService.customPUT(resource, id, params)
      .then(function success(res) {

        var response = res.data;
        if (!response.error) {
          deferred.resolve(response);
        }
      }, function error(error) {

        deferred.reject(error.data);
      });

    return deferred.promise;
  }

  // fn delete a user
  function destroy(id) {
    var deferred = $q.defer();

    apiService.remove(resourceAdmin, id)
      .then(function (res) {
        var response = res.data;

        if (!response.error) {
          deferred.resolve(response);
        }
      }, function error(error) {
        deferred.reject(error.data);
      });

    return deferred.promise;
  }

}