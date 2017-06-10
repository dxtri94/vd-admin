angular.module('resources.errors', [])

  .factory('Errors', ErrorsService);

ErrorsService.$injector = ['apiService', '$q'];
function ErrorsService(apiService, $q) {

  var service = {
    openErrorMessages: openErrorMessages,
    login: login,
    forgot: forgot,
    reset: reset,
    user: user,
    confirmToken: confirmToken
  };

  return service;

  // fn open error message popup
  function openErrorMessages(errorMessages) {

  }

  // fn initial setup
  function init(errors, target) {
    if (!target) {
      target = {};
    }
    if (!errors.length) {
      return target;
    }
  }

  // fn handle errors of sign in
  function login(errors, target) {
    init(errors, target);

    var errorMessages = [];
    angular.forEach(errors, function (error) {
      errorMessages.push(error.errorMessage);

      switch (error.errorCode) {
        case 9802:
        case 2316:
        case 2317:
        case 2319: {
          target.email = error.errorMessage;
          break;
        }
        case 2320:
        case 2324: {
          target.password = error.errorMessage;
          break;
        }
      }
    });
  }

  // fn handle erros of forgot password
  function forgot(errors, target) {
    init(errors, target);

    var errorMessages = [];
    angular.forEach(errors, function (error) {
      errorMessages.push(error.errorMessage);

      switch (error.errorCode) {
        case 9802:
        case 2300:
        case 2316:
        case 2317: {
          target.email = error.errorMessage;
          break;
        }
      }
    });
  }

  // fn handle errors of user
  function user(errors, target) {
    init(errors, target);
    var errorMessages = [];
    angular.forEach(errors, function (error) {
      errorMessages.push(error.errorMessage);

      switch (error.errorCode) {
        case 3011:
        case 3012:
        case 3013:
        case 3037:
        case 3038: {
          target.username = error.errorMessage;
          break;
        }
        case 3027: {
          target.location_id = error.errorMessage;
          break;
        }
        case 3028: {
          target.date_of_birth = error.errorMessage;
          break;
        }
        case 2316:
        case 2317:
        case 2318:
        case 2319: {
          target.email = error.errorMessage;
          break;
        }
        case 3020:
        case 3021:
        case 3022:
        case 3023:
        case 3024: {
          target.password = error.errorMessage;
          break;
        }
        case 3025:
        case 3026: {
          target.confirm_password = error.errorMessage;
          break;
        }
        case 3032:
        case 3033: {
          target.current_password = error.errorMessage;
          break;
        }
        case 3034:
        case 3036:
        case 3042:
        case 3043:
        case 3044: {
          target.phone = error.errorMessage;
          break;
        }
        case 3047:
        case 3060:{
          target.first_name = error.errorMessage;
          break;
        }
        case 3048:
        case 3061:{
          target.surname = error.errorMessage;
          break;
        }
        case 3049: {
          target.province = error.errorMessage;
          break;
        }
        case 3050: {
          target.city = error.errorMessage;
          break;
        }
        case 3051:
        case 3052:
        case 3053: {
          target.postal_code = error.errorMessage;
          break;
        }
        case 3054: {
          target.address1 = error.errorMessage;
          break;
        }
        case 3055: {
          target.address2 = error.errorMessage;
          break;
        }
        case 3062:{
          target.role_id = error.errorMessage;
          break;
        }
      }
    });
  }

  // fn handle errors of token confirm reset password
  function confirmToken(errors, target) {
    init(errors, target);

    var errorMessages = [];
    angular.forEach(errors, function (error) {
      errorMessages.push(error.errorMessage);
      switch (error.errorCode) {
        case 2001:
        case 2005: {
          break;
        }
      }
    });

    if (errorMessages.length) {
      cfModal.open({
        content: errorMessages[0]
      });
    }
  }

  // fn handle errors of reset password
  function reset(errors, target) {
    init(errors, target);

    var errorMessages = [];
    angular.forEach(errors, function (error) {
      errorMessages.push(error.errorMessage);
      switch (error.errorCode) {
        case 2327: {
          target.token = error.errorMessage;
          break;
        }
        case 2320:
        case 2321:
        case 2322:
        case 2323: {
          target.password = error.errorMessage;
          break;
        }
        case 2325:
        case 2326: {
          target.confirm_password = error.errorMessage;
          break;
        }
      }
    });

    if (errorMessages.length) {
      cfModal.open({
        form: 'style2',
        title: '<span class="text-danger">Incorrect Password</span>',
        content: errorMessages[0],
        labels: {
          confirm: 'Ok'
        }
      });
    }
  }

  // fn handle errors of change password
  function changePassword(errors, target) {
    init(errors, target);

    var errorMessages = [];
    angular.forEach(errors, function (error) {
      errorMessages.push(error.errorMessage);
      switch (error.errorCode) {
        case 2327: {
          target.token = error.errorMessage;
          break;
        }
        case 2320:
        case 2321:
        case 2322:
        case 2323: {
          target.password = error.errorMessage;
          break;
        }
        case 2325:
        case 2326: {
          target.confirm_password = error.errorMessage;
          break;
        }
      }
    });

    if (errorMessages.length) {
      cfModal.open({
        form: 'style2',
        title: '<span class="text-danger">Incorrect Password</span>',
        content: errorMessages[0],
        labels: {
          confirm: 'Ok'
        }
      });
    }
  }

}