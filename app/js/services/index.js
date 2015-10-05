'use strict';

var serv = require('angular').module('app').service;

serv('MainServ',require('./main'));
serv('AboutServ',require('./about'));

