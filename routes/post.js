var Router = require('express').Router();
var Functions = require('../functions/post');
var Auth = require('../functions/auth');
var Upload = require('../functions/upload');

Router.get('/update/:post', Auth.auth , Functions.update);
Router.post('/update', Auth.auth,Functions.update);
Router.get('/read/:post', Functions.read);
Router.get('/recent/:count/:skip?', Functions.recent);
Router.get('/delete/:post/:confirm?', Auth.auth , Functions.delete);

module.exports = Router;
