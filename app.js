'use strict';

const koa_1 = require('koa');
const logger = require('koa-logger');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');

const PORT = 1234;
const app = new koa_1();

app.keys = ['chengong'];
app.use(logger());
app.use(session(app));
app.use(bodyParser());

const router = require('./config/routes')();

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(PORT);
console.log(`listen at port ${PORT}`);


