angular.module('resources.roles', [])

  .factory('Roles', RolesService);

RolesService.$injector = ['apiService', '$q'];

function RolesService(apiService, $q) {
  var resource = 'roles';

  var service = {
    all: all
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
}