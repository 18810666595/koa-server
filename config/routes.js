'use strict';

const Router = require('koa-router');
const User = require('../app/controllers/user');
const App = require('../app/controllers/app');

module.exports = function () {
  const router = new Router({
    prefix: '/api/1',
  });

  /*User*/
  router.get('/u/signup', User.signup);
  router.post('/u/verify', User.verify);
  router.post('/u/update', User.update);

  /*App*/
  router.post('/signature', App.signature);

  return router;
};