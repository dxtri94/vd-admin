angular.module('resources.locations', [])
  .factory('Locations', LocationsService);

LocationsService.$injector = ['apiService', '$q'];
function LocationsService(apiService, $q) {
  var resource = 'locations';

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
          deferred.resolve(response.data);
        }
      }, function (error) {
        deferred.reject(error.data);
      });

    return deferred.promise;
  }
}