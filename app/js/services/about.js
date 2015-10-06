'use strict';

// @ngInject
module.exports = function() {
  
  var text = 'Template App of Angularjs with browserify ' +
              'and tools for development and remember ' +
              'WITHOUT WARRANTY OF ANY KIND ' +
              'by Joseph Perez & ' +
              'based in the todoApp of Bastian Krol';
  
  this.getText = function() {
    return text;
  };
};