'use strict';

// @ngInject
module.exports = function($scope,AboutServ) {
  $scope.text = AboutServ.getText();
};