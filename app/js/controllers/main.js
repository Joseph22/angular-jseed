'use strict';

// @ngInject
module.exports = function($scope, MainServ) {
   $scope.demo = 'seed controller & ' + MainServ.demo;
}
