'use strict';

var chai = require('chai'),
    expect = chai.expect;

var MainCtrlModule = require('../../../js/controllers/main.js');

describe('The MainCtrl', function() {

  var $scope;

  beforeEach(function() {

    $scope = {};

    var MainService = {
      demo: 'test demo'
    };

    MainCtrlModule($scope, MainService);
  });

  it('should demo contains <<test demo>>', function() {
    expect($scope.demo.indexOf('test demo')).to.be.at.least(0);
  });

});
