'use strict';

const Router = require('koa-router');
const User = require('../app/controllers/user');
const App = require('../app/controllers/app');

module.exports = function () {
  const router = new Router({
    prefix: '/api',
  });

  /*User*/
  router.post('/u/signup', App.hasBody, User.signup);
  router.post('/u/verify', App.hasBody, User.verify);
  router.post('/u/update', App.hasBody, App.hasToken, User.update);

  /*App*/
  router.post('/signature', App.hasBody, App.hasToken, App.signature);

  return router;
};