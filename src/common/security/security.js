angular.module('security.service', [
  'security.retryQueue',
  'security.login',
  'security.register',
  'security.forgot',
  'security.reset',
  'services.api',
  'ngCookies'
])

  .factory('security', securityService);


function securityService($rootScope, $cookieStore, $q, securityRetryQueue, apiService, Utilities) {

  // Redirect to the given url (defaults to '/')
  function redirect(url) {
    url = url || '#/';
    window.location.href = url;
  }

  // Register handler for when an item is added to the retry queue
  securityRetryQueue.onItemAddedCallbacks.push(function (retryItem) {
    if (securityRetryQueue.hasMore()) {
      redirect('#/login');
    }
  });

  // Require authorized
  $rootScope.$on('response:authorized:error', function (event, rejection) {
    if (service.currentUser) {
      service.currentUser = undefined;
    }
  });

  var ROLES = {
    ADMIN: 1,
    USER: 2
  };

  var service = {
    currentUser: null,
    role: null,

    login: login,
    logout: logout,
    put: put,
    changePassword: changePassword,
    upload: upload,
    forgot: forgot,
    confirmToken: confirmToken,
    resetPassword: resetPassword,
    isAuthenticated: isAuthenticated,
    requestCurrentUser: requestCurrentUser,

    // Get the first reason for needing a login
    getLoginReason: function () {
      return securityRetryQueue.retryReason();
    },

    // Give up trying to login and clear the retry queue
    cancelLogin: function () {
      redirect();
    },

    // is system role
    isRole: function (role) {
      return !!service.isAuthenticated() && service.role === role;
    },

    // is admin in system
    isAdmin: function (role) {
      return ((!!role && role === ROLES.ADMIN) || service.isRole(ROLES.ADMIN));
    },

    // Check roles
    isPermission: function (roles) {
      if (service.isAuthenticated() || service.isCompanyAuthenticated()) {
        for (var i = 0; i < roles.length; i++) {
          if (service.role === roles[i]) {
            return true;
          }
        }
      }
      return false;
    }
  };

  return service;

  // fn login as normally account
  function login(username, password, isRemember) {
    var deferred = $q.defer();

    // request login
    apiService.post('admin/login', {
      username: username,
      password: password
    })
      .then(function (res) {
        if (res.data !== null) {
          var response = res.data;

          if (!response.error) {

            var authToken = response.data.token;

            // set token
            $cookieStore.put('authToken', authToken);

            // set header token
            apiService.setAuthTokenHeader(authToken);

            service.currentUser = response.data.user;
            service.role = service.currentUser.role.id;
            $rootScope.$broadcast('profile:updated');

            deferred.resolve(service.currentUser);
          } else {
            deferred.resolve(false);
          }
        } else {
          deferred.resolve(false);
        }
      }, function error(error) {
        deferred.reject(error.data);
      });

    return deferred.promise;
  }

  // fn change password current users
  function changePassword(params) {
    var deferred = $q.defer();

    // request change password
    apiService.post('admin/change-password', params)
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

  // update
  function put(params) {
    var deferred = $q.defer();

    // request update
    apiService.customPUT('admin/me', null, params)
      .then(function (res) {
        var response = res.data;

        if (!response.error) {
          service.currentUser = response.data;

          $rootScope.$broadcast('profile:updated');

          deferred.resolve(service.currentUser);
        }
      }, function (error) {
        deferred.reject(error.data);
      });

    return deferred.promise;
  }

  // fn upload avatar
  function upload(file) {
    var deferred = $q.defer();

    var fd = new FormData();
    fd.append('file', file);

    // request change password
    apiService.upload('admin/upload', fd)
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

  // request forgot password
  function forgot(params) {
    var deferred = $q.defer();

    apiService.post('admin/forgot', params)
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

  // request confirm token to reset password
  function confirmToken(params) {
    var deferred = $q.defer();

    // request api
    apiService.post('admin/confirm-token', params)
      .then(function (res) {
        var response = res.data;
        if (!response.error) {
          deferred.resolve(response);
        }
      }, function (error) {
        deferred.reject(error.data);
      });

    return deferred.promise;
  }

  // fn reset password
  function resetPassword() {
    return true;
  }

  // reset password
  function reset(param) {
    var deferred = $q.defer();

    apiService.post('admin/reset', param)
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

  // fn logout current user
  function logout(redirectTo) {

    var deferred = $q.defer();

    if (arguments.length === 0) {
      redirectTo = '#/login';
    } else {
      if (redirectTo.indexOf('#') === -1) {
        redirectTo = ('#' + redirectTo);
      }
    }

    apiService.post('logout')
      .then(function success(res) {
        var response = res.data;
        if (!response.error) {

          $cookieStore.remove('authToken');
          service.currentUser = null;
          if (service.currentCompany) {
            service.currentCompany = null;
          }

          redirect(redirectTo);

          deferred.resolve(true);
        }

      }, function error(error) {
        deferred.reject(error);
      });

    return deferred.promise;
  }

  // request current user as
  function requestCurrentUser() {

    var deferred = $q.defer(),
      authToken = $cookieStore.get('authToken');

    if (authToken !== undefined) {
      apiService.setAuthTokenHeader(authToken);

      if (!service.isAuthenticated()) {

        apiService.find('admin/me')
          .get()
          .then(function (res) {

            var response = res.data;
            if (!response.error) {

              service.currentUser = response.data;
              service.role = service.currentUser.role;

              deferred.resolve(service.currentUser);
            }
          }, function (error) {
            deferred.reject(error.data);
          });
      } else {
        deferred.resolve(service.currentUser);
      }
    } else {
      deferred.resolve(false);
    }
    return deferred.promise;
  }

  // fn register new account
  function register(params) {

  }

  // fn check authenticated
  function isAuthenticated() {
    return !!service.currentUser;
  }
}