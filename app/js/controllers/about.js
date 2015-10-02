'use strict';

// @ngInject
module.exports = function($scope,AboutService) {
  $scope.text = ImprintService.getText();
}