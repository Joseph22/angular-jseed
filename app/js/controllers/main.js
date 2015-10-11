'use strict';

// @ngInject
module.exports = function($scope, MainServ) {

   $scope.demo = 'seed controller & ' + MainServ.demo;
   $scope.format = 'M/d/yy h:mm:ss a';
   $scope.data = 'Hello World';

   //bootstrap datepicker
   $scope.status = {
      opened: false
   };

   $scope.disabled = function(date, mode) {
        return mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 );
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];

  $scope.open = function() {
    $scope.status.opened = true;
  };
  $scope.dt = new Date();

   $scope.minDate = $scope.minDate ? null : new Date();
   $scope.maxDate = new Date(2020, 5, 22);

   $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

};
