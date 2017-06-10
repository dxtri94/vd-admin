angular.module('resources.product', [])

  .factory('Product', DispiteService);

DispiteService.$injector = ['apiService', '$q'];

function DispiteService(apiService, $q) {
  var resource = 'products';

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

  // fn get all
  function all(params) {
    var deferred = $q.defer();

    apiService.all(resource, params)
      .then(function (res) {

        var response = res.data.data;
        if (!response.error) {

          service.list = response.data;
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

  // fn approve listing image
  function approveImage(id, params) {
    var deferred = $q.defer();

    apiService.find(resourceAdmin, id)
      .post('images/approve', params)
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

  // function remove listing image
  function removeImage(id, params) {
    var deferred = $q.defer();

    apiService.find(resourceAdmin, id)
      .post('images/reject', params)
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

  // fn suggest edit listing
  function suggest(params) {
    var deferred = $q.defer();

    apiService.find(resourceAdmin, 'suggest')
      .post('', params)
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

  // fn approve listing
  function approve(id) {
    var deferred = $q.defer();

    apiService.find(resourceAdmin, id)
      .post('approve')
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

  // fn reject listing
  function reject(id) {
    var deferred = $q.defer();

    apiService.find(resourceAdmin, id)
      .post('reject')
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