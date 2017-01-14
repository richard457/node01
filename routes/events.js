var Router = require('express').Router();
var Functions = require('../functions/events');
var Auth = require('../functions/auth');


Router.get('/update/:event', Auth.auth , Functions.update);
Router.post('/update', Auth.auth, Functions.update);
Router.get('/upcomming/:count', Functions.upcomming);
Router.get('/read/:event', Functions.read);
Router.get('/recent/:count/:skip?', Functions.recent);
Router.get('/delete/:event/:confirm?', Auth.auth , Functions.delete);

module.exports = Router;
