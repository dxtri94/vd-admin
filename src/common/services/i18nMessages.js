angular.module('services.i18nMessages', [])

// List of notification messages
.constant('i18nMessages', {

    // General
    'errors.route.changeError': "Something went wrong when changing route.",

    // Default CRUD-message used by the apiService
    'crud.default.error': "Unable to load {{resource}}.",

    // Login related
    'login.reason.notAuthorized': "You do not have enough permissions to do this. Please contact your administrator.",
    'login.reason.sessionExpired': "Your session has expired. Please login again.",
    'login.reason.userExpired': "You are not assigned to a company, please contact your company administrator.",
    'login.reason.notAuthenticated': "Access Denied. You must be logged in to access this part of the application.",
    'login.error.invalidCredentials': "The password are incorrect.",
    'login.error.serverError': "There was a problem with authenticating: {{exception}}.",
    'login.error.userCanceled': "This user is canceled. Please try other one. Thanks",
    'login.error.userExisting': "This email is not existing in system. Please register a new account",
    'login.error.userNotAdministrator' : "Your account access denied.",

    // register user
    'crud.register.error': "Email is already exists",
    'crud.users.notfound': "Your entry did not return a match in our system. Please try again.",
    'crud.users.notupdate': "User cannot update in this time",

    //edit admin user
    'admin-account.edit.error.emailAlreadyExists': "The email has already been taken.",
    'edit.error.menbersNotExist': "Members do not exist in the system.",

    //reset password admin user
    'reset.error.menbersNotExist': "Members do not exist in the system.",

    //delete admin user
    'delete.error.menbersNotExist': "Members do not exist in the system.",

    //medicare levy
    'edit.error.Integer': 'Medicare Levy is number',

    //message
    'message.error.serverError': 'There was a problem with authenticating: {{exception}}.',

    //reset password user
    'account.reset.error.emailAlreadyExists': 'This email is not existing in system.',

    // server error
    'crud.server.error': '500 - Internal Server Error'
});