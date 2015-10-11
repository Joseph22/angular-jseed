'use strict';

require('es5-shim');
require('es5-sham');

//vendor modules
window.jQuery = window.$ = require('jquery');
var angular = require('angular');
require('angular-route');
require('angular-bootstrap');

var app = angular.module('app', [ 'ngRoute', 'ui.bootstrap' ]);

app.constant('VERSION', require('../../package.json').version);

//my modules
require('./services');
require('./controllers');
require('./directives');
require('./filters');

app.config(function($routeProvider) {

  //$locationProvider.html5Mode(true).hashPrefix('!');

  $routeProvider.when('/about', {
    templateUrl: 'views/about.html',
    controller: 'AboutCtrl',
  })
  .when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl',
  })
  .otherwise({
    redirectTo: '/',
  });
});
