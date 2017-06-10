angular.module('resources.abstracts', [])
  .factory('Abstracts', AbstractsService);

AbstractsService.$injector = ['apiService', '$q'];
function AbstractsService(apiService, $q) {
  var resource = 'abstracts';

  var service = {
    stat: stat
  };

  return service;

  // fn get statistic
  function stat(params) {
    var deferred = $q.defer();

    apiService.all('stat', params)
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