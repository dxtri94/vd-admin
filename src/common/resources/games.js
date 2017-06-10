angular.module('resources.games', [])
  .factory('Games', GamesService);

GamesService.$injector = ['apiService', '$q'];
function GamesService(apiService, $q) {
  var resource = 'games';

  var service = {
    current: null,
    list: [],

    all: all,
    get: get,
    post: post,
    upload: upload,
    uploadBase64: uploadBase64,
    put: put,
    reset: reset,
    destroy: destroy
  };

  return service;

  // fn get all
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

  // fn upload file
  function upload(id, file) {
    var deferred = $q.defer();

    var fd = new FormData();
    fd.append('avatar', file);

    apiService.upload(resource + '/' + id + '/upload', fd)
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

  // upload base64
  function uploadBase64(id, params) {
    var deferred = $q.defer();

    apiService.post(resource + '/' + id + '/upload-base64', params)
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

  // fn reset password
  function reset(id, params) {
    var deferred = $q.defer();

    apiService.find(resource, id)
      .post('reset-password', params)
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

    apiService.remove(resource, id)
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