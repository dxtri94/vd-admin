angular.module('app.utils', [])

  .factory('Utilities', function ($filter, $window, $location, $q) {

    var service = {
      monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      requests: [],

      detectFails: function (reason, reasons, callback) { // array

        if (reason === undefined || typeof(reason) !== 'string') {
          reason = '';
        }

        if (reasons === undefined || !angular.isArray(reasons)) {
          reasons = [];
        }

        reasons.filter(function (item) {
          if (reason.indexOf(item) !== -1) {
            if (typeof(callback) === 'function') {
              callback();
            }
            return true;
          }
        });

        return false;
      },

      pushRequest: function (requests, object) {
        if (!requests) {
          requests = [];
        }
        requests.push(object);
      },

      pullRequest: function (requests, object) {
        for (var i = 0; i < requests.length; i++) {
          switch (requests[i].type.toLowerCase()) {
            case 'request': {
              if (requests[i].api === object.api) {
                requests.splice(i, 1);
                return;
              }
              break;
            }
            default: {
              if (requests[i].fromState === object.fromState && requests[i].toState === object.toState) {
                requests.splice(i, 1);
                return;
              }
              break;
            }
          }
        }
      },

      findDeviceLocation: function () {
        navigator.geolocation.getCurrentPosition(function (location) {
          console.log(location);
        });
      },

      sort: function (list, property, reverse) {
        if (reverse === undefined) {
          reverse = false;
        }

        if (!angular.isArray(list)) {
          return [];
        } else {
          var newList = $filter('orderBy')(list, property, reverse);
          return newList.filter(function (n) {
            return n !== undefined;
          });
        }
      },

      // file types and check type of file
      fileTypes: ['JPG', 'JPEG', 'PNG', 'GIF', 'TIF', 'PDF', 'DOC', 'DOCX', 'XLS', 'XLSX'],
      checkFileType: function (file) {
        var doc = ['pdf', 'doc', 'docs', 'xls', 'xlsx'],
          image = ['jpg', 'jpeg', 'png', 'gif', 'tif'];

        for (var i = 0; i < image.length; i++) {
          if (file.name.toLowerCase().indexOf(image[i].toLowerCase()) !== -1) {
            return 'picture';
          }
        }
        return 'doc';
      },

      isEmpty: function (input) {
        if (angular.isUndefined(input) || input === null || !input) {
          return true;
        }
        return false;
      },

      isDate: function (date) {
        if (service.isEmpty(date)) {
          return false;
        }

        var d = new Date(date);
        return !isNaN(d.getTime()) || d.getTime() === 0;
      },

      isZero: function (input) {
        if (service.isEmpty(input) || service.fixed(input) === 0) {
          return true;
        }
        return false;
      },

      storage: {
        set: function (key, data) {

          var value = data;
          if (typeof(data) === 'object') {
            value = angular.copy(JSON.stringify(data));
          }

          window.localStorage.setItem(key, value);
        },
        get: function (key) {
          return window.localStorage.getItem(key) || undefined;
        },
        clear: function () {
          window.localStorage.clear();
        },
        remove: function (key) {
          window.localStorage.removeItem(key);
        }
      },

      // date format
      dateFormat: function (datetime, formatStr) {
        if (!datetime) {
          datetime = new Date();
        }
        if (!formatStr) {
          formatStr = 'yyyy-MM-dd';
        }

        return $filter('date')(datetime, formatStr);
      },

      // read file
      readFile: function (file, callback) {
        var reader = new FileReader();
        reader.onload = function (event) {
          if (typeof(callback) == 'function') {
            callback(event);
          }
        };

        reader.readAsDataURL(file);
      },

      // file is existing
      fileExisting: function (url) {
        var http = new XMLHttpRequest();

        http.open('HEAD', url, false);
        http.send();

        return http.status != 404;
      },

      // calculate work time
      calculateWorkTime: function (resource) {
        if (!service.isEmpty(resource)) {
          var start = new Date(resource.start).getTime(),
            end = new Date(resource.end).getTime();

          var time = (end - start) / 1000;
          var minute = 60,
            hour = minute * 60,
            day = hour * 24;

          if (time > day) {

          } else if (time > hour) {
            return new Date(time).format('HH:mm');
          } else if (time > minute) {
            return new Date(time).format('mm');
          }

          return '00:' + Math.round(time, 0);
        }
        return '';
      },

      // detect date valid
      dateValid: function (date) {
        return !isNaN(new Date(date).getTime());
      },

      fixed: function (value, fixed) {
        if (!value) {
          return 0;
        }
        if (angular.isUndefined(fixed)) {
          fixed = 2;
        }
        value = parseFloat(value);
        if (isNaN(value)) {
          return 0;
        }
        return parseFloat(value.toFixed(fixed));
      },

      // mail to
      mailTo: function (email, subject, body) {

        if (!email) {
          return false;
        }

        if (!subject) {
          subject = 'Message Contact To';
        }

        if (!body) {
          body = '';
        }

        var link = "mailto:" + email + "?subject=" + subject + "&body=" + body;
        window.location.href = link;

        return true;
      },

      detectLocation: function (input, successCallback, errorCallback) {

        var isLocality = false;
        angular.forEach(input.address_components, function (item) {
          for (var index in item.types) {
            if (item.types[index] === 'locality') {
              isLocality = true;
              break;
            }
          }
        });

        if (!isLocality) {
          if (typeof(errorCallback) === 'function') {
            errorCallback();
          }
          return false;
        }

        if (typeof(successCallback) === 'function') {
          successCallback();
        }

        return true;
      },

      // detect location by address
      detectLocationAddress: function (address, successCallback, errorCallback) {
        var geo = new google.maps.Geocoder();

        return geo.geocode({
          address: address || '',
          region: 'AU',
          componentRestrictions: {
            country: 'AU',
          }
        }, function (res, status) {
          if (status === 'OK') {

            for (var index in res) {
              if (res[index].formatted_address === address) {
                break;
              }
            }

            var regions = ['route', 'street_number'];

            var isLocality = false;
            var isSurburb = true;
            for (var i in res[index].address_components) {
              for (var j in res[index].address_components[i].types) {
                var item = res[index].address_components[i].types[j];
                if (regions.indexOf(item) !== -1) {
                  isSurburb = false;
                  break;
                }
                if (item === 'locality') {
                  isLocality = true;
                }
              }

              if (!isSurburb) {
                isLocality = false;
                break;
              }
            }

            if (isLocality && isSurburb) {
              var hash = res[index].formatted_address.split(',');

              if (hash.length > 2) {
                isLocality = false;
              }
            }

            console.log(res[index].formatted_address);

            if (isLocality) {
              if (typeof successCallback === 'function') {
                successCallback();
              }
              return true;
            }

          }

          if (typeof errorCallback === 'function') {
            errorCallback();
          }

          return false;
        });
      }
    };

    return service;
  });
