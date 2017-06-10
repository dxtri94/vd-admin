/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
  /**
   * The `build_dir` folder is where our projects are compiled during
   * development and the `compile_dir` folder is where our app resides once it's
   * completely built.
   */
  build_dir: 'build',
  compile_dir: 'bin',

  /**
   * This is a collection of file patterns that refer to our app code (the
   * stuff in `src/`). These file paths are used in the configuration of
   * build tasks. `js` is all project javascript, less tests. `ctpl` contains
   * our reusable components' (`src/common`) template HTML files, while
   * `atpl` contains the same, but for our app's code. `html` is just our
   * main HTML file, `less` is our main stylesheet, and `unit` contains our
   * app's unit tests.
   */
  app_files: {
    js: ['src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js'],
    jsunit: ['src/**/*.spec.js'],

    atpl: ['src/app/**/*.tpl.html'],
    ctpl: ['src/common/**/*.tpl.html'],

    html: ['src/index.html'],
    less: 'src/less/main.less'
  },

  /**
   * This is a collection of files used during testing only.
   */
  test_files: {
    js: [
      'vendor/angular-mocks/angular-mocks.js'
    ]
  },

  /**
   * This is the same as `app_files`, except it contains patterns that
   * reference vendor code (`vendor/`) that we need to place into the build
   * process somewhere. While the `app_files` property ensures all
   * standardized files are collected for compilation, it is the user's job
   * to ensure non-standardized (i.e. vendor-related) files are handled
   * appropriately in `vendor_files.js`.
   *
   * The `vendor_files.js` property holds files to be automatically
   * concatenated and minified with our project source files.
   *
   * The `vendor_files.css` property holds any CSS files to be automatically
   * included in our app.
   *
   * The `vendor_files.assets` property holds any assets to be copied along
   * with our app's assets. This structure is flattened, so it is not
   * recommended that you use wildcards.
   */
  vendor_files: {
    js: [
      'bower_components/jquery/dist/jquery.js',
      'bower_components/underscore/underscore.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-ui-utils/ui-utils.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-filter/dist/angular-filter.min.js',
      'bower_components/restangular/dist/restangular.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/moment/moment.js',
      'bower_components/angular-moment/angular-moment.js',
      'bower_components/angularjs-toaster/toaster.js',
      'bower_components/spin.js/spin.js',
      'bower_components/angular-spinner/angular-spinner.js',
      'bower_components/ng-table/dist/ng-table.js',
      'bower_components/metisMenu/dist/metisMenu.js',
      'bower_components/summernote/dist/summernote.js',
      'bower_components/angular-summernote/dist/angular-summernote.js',
      'bower_components/croppie/croppie.js',
      'bower_components/ngCroppie/ng-croppie.js',
      'bower_components/bxslider-4/dist/jquery.bxslider.js'
    ],
    css: [
      'bower_components/iCheck/skins/square/all.css',
      'bower_components/animate.css/animate.css',
      'bower_components/ngCroppie/ng-croppie.css',
      'bower_components/bxslider-4/dist/jquery.bxslider.css'
    ],
    assets: [
      'bower_components/bootstrap/dist/fonts/*',
      'bower_components/font-awesome/fonts/*',
      'bower_components/simple-line-icons/fonts/*',
      'bower_components/summernote/dist/font/*'
    ]
  }
};
