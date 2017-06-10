# Play Or Go v1.0 Admin Panel (AngularJS)
================================================

## Quick Start

Install Node.js and then:

```sh
$ git clone https://bss-toanle@bitbucket.org/beesightsoft/monsterapps.abakus.dashboard.git <app-folder>
$ cd <app-folder>
$ sudo npm -g install grunt-cli bower
$ npm install
$ bower install
$ grunt watch
```

Finally, open `http://url/to/app/build/` in your browser.

app-folder/
  |- src/
  |  |- app/
  |  |  |- <app logic>
  |  |  |- common/
  |  |  |  |- <reusable code>
  |  |- assets/
  |  |  |- <static files>
  |  |- less/
  |  |  |- main.less
  |- vendor/
  |  |- angular-bootstrap/
  |  |- bootstrap/
  |  |- placeholders/
  |- .bowerrc
  |- bower.json
  |- build.config.js
  |- Gruntfile.js
  |- module.prefix
  |- module.suffix
  |- package.json


1. grunt compile to min js
