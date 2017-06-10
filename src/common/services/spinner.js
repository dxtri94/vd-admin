angular.module('app.spinner', ['angularSpinner'])

  .config(function (usSpinnerConfigProvider) {

    usSpinnerConfigProvider.setDefaults({
      lines: 12,
      length: 10,
      width: 4,
      radius: 13,
      corners: 2,
      rotate: 0,
      direction: 1,
      color: '#ffffff',
      speed: 1,
      trail: 50,
      shadow: false,
      hwaccel: true,
      top: '50%',
      left: '50%'
    });
  })

  .factory('Spinner', function (usSpinnerService) {

    var service = {

      spinner: null,

      spin: function (key) {
        $('.spinner-background').show();
        if(!service.spinner) {
          service.spinner = usSpinnerService.spin(key);
        } else {
          service.spinner.spin(key);
        }
      },

      stop: function (key) {
        if(!service.spinner) {
          usSpinnerService.stop(key);
        } else {
          usSpinnerService.stop(key);
        }
        $('.spinner-background').hide();
      }

    };

    return service;
  });
