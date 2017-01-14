'use strict'
var mongoose = require('mongoose');
var Config = require('../Config/Config');
var uri = 'mongodb://'+Config.DBName+':'+Config.DBSecret+'@ds111549.mlab.com:11549/aspire';
//var uri = "mongodb://localhost:27017/aspire";
var db = mongoose.connect(uri);

module.exports = db;
