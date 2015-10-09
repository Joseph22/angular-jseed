exports.config = {

  chromeOnly: true,
  chromeDriver: './node_modules/protractor/selenium/chromedriver',

  capabilities: {
    'browserName': 'chrome'
  },

  specs: ['app/tests/e2e/**/*_spec.js'],

  rootElement: '.content',

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
