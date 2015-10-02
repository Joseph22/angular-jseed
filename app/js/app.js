'use strict';

require('es5-shim');
require('es5-sham');

//vendor modules
require('jquery');
var angular = require('angular');
require('angular-route');

var app = angular.module('app', [ 'ngRoute' ]);

app.constant('VERSION', require('../../package.json').version);

//my modules
require('./services');
require('./controllers');

app.config(function($routeProvider) {

  $routeProvider.when('/about', {
    templateUrl: 'views/about.html',
    controller: 'AboutCtrl',
  })
  .when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl',
  })
  .otherwise({
    redirectTo: '/main',
  });
});