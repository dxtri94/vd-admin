angular.module('resources.collections', [])
  .factory('Collections', CollectionsService);

CollectionsService.$injector = ['apiService', '$q'];
function CollectionsService(apiService, $q) {
  var resource = 'collections';

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