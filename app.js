'use strict';

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const db = `mongodb://localhost/dog`;

mongoose.Promise = require('bluebird');
mongoose.connect(db);

const models_path = path.join(__dirname, 'app/models');

/*定义一个遍历加载的方法*/
const walk = function (modelPath) {
  fs.readdirSync(modelPath)
    .forEach(file => {
      let filePath = path.join(modelPath, '/' + file);
      let stat = fs.statSync(filePath);
      /*如果是文件*/
      if (stat.isFile()) {
        /*如果是 js 或 coffee 文件*/
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(filePath);
        }
      } else if(stat.isDirectory()) {
        /*如果是文件夹，则进行深度遍历*/
        walk(filePath);
      }
    });
};

/*初始化加载 MVC 中的 M 数据*/
walk(models_path);

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


