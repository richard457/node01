'use strict'
var mongoose = require('mongoose');
var Config = require('../Config/Config');
//var uri = 'mongodb://'+Config.DBName+':'+Config.DBSecret+'@ds113938.mlab.com:13938/wasac';
var uri = "mongodb://localhost:27017/aspire";
var db = mongoose.connect(uri);

module.exports = db;
