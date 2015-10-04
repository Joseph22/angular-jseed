'use strict';

// @ngInject
module.exports = function($scope, MainServ) {
   $scope.demo = 'seed controller & ' + MainServ.demo;
   $scope.format = 'M/d/yy h:mm:ss a';
   $scope.data = "Hello World";
}
