angular.module('app.constant', [])

  .constant('CONFIGS', {
    baseURL: function () {

      var host = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');


      if (host.indexOf('localhost') !== -1) {
        return 'http://localhost:8080/vondom_be/public/api';
      } else if (host.indexOf('demo.com') !== -1) {
        return 'http://localhost:8080/vondom_be/public/api';
      }

      return 'http://localhost:8080/vondom_be/public/api';
    }

  })

  .constant('RESULT_STATUS', {
    WON: 1,
    LOST: 2,
    DNF: 3,
    NOT_PROVIDED: 4,
  })

  .constant('DISPUTE_STATUS', {
    NEW: 1,
    SOLVED: 2
  })

  .constant('GOOGLE_PLACE_OPTIONS', {
    componentRestrictions: {country: 'au'},
    types: ['(regions)']
  })

  .constant('PAGE', {
    PER_PAGE: 20
  })

  .constant('ROLES', {
    SUP_ADMIN: 1,
    ADMIN: 2,
    USER: 3
  });
