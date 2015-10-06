'use strict';

// @ngInject
module.exports = function($interval, $filter){
  
   //https://docs.angularjs.org/guide/directive
   function link(scope, element, attrs) {
    var format,
        timeoutId;

     
    function updateTime() {
      //element.text(dateFilter(new Date(), format));
      element.text($filter('date')(new Date(),format));
    }

    scope.$watch(attrs.myCurrentTime, function(value) {
      format = value;
      updateTime();
    });

    element.on('$destroy', function() {
      $interval.cancel(timeoutId);
    });

    // start the UI update process; save the timeoutId for canceling
    timeoutId = $interval(function() {
      updateTime(); // update DOM
    }, 1000);
  }

  return {
    link: link
  };
  
};