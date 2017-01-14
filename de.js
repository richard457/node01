var moment = require('moment');

var d = "2016-12-30";
var t = "22:45:00";

var date = d+" "+t;
date = new Date(date);
console.log(moment(date).format());
