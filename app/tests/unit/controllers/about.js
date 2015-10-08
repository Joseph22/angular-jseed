'use strict';

var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    expect = chai.expect;

chai.use(sinonChai);

var AboutCtrlModule = require('../../../js/controllers/about.js');

describe('The AboutCtrl', function() {

  var $scope,
      AboutService;

  beforeEach(function() {

    $scope = {};

    AboutService = {
      //getText: sinon.stub().returns('Test')
      getText: sinon.spy()
    };

    AboutCtrlModule($scope, AboutService);
  });

  // it('should demo contains <<Test>>', function() {
  //     expect($scope.text.indexOf('Test')).to.be.equal(0);
  // });

  it('should have text', function(){
    expect(AboutService.getText).to.have.been.calledOnce;
  });

});
