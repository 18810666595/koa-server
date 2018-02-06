'use strict';

const mongoose = require('mongoose');
let User = mongoose.model('User');
const uuid = require('uuid');
const robot = require('../service/robot');

exports.signature = function* (next) {
  let body = this.request.body;
  let cloud = body.cloud; //客户端指定图床
  let key;
  let token;  //签名

  if (cloud === 'qiniu') {
    //使用七牛
    console.log(cloud);
    key = uuid.v4() + '.png';
    token = robot.getQiniuToken(key);
  } else {
    //使用 cloudinary
    token = robot.getCloudinaryToken(body);
  }
  console.log('key', key);
  console.log('token', token);
  this.body = {
    success: true,
    data: {
      token,
      key,
    },
  };
};

exports.hasBody = function* (next) {
  let body = this.request.body || {};
  if (Object.keys(body).length === 0) {
    this.body = {
      success: false,
      err: '是不是漏掉什么了',
    };
    return next;
  }
  yield next;
};

exports.hasToken = function* (next) {
  let accessToken = this.query.accessToken || this.request.body.accessToken;

  if (!accessToken) {
    this.body = {
      success: false,
      err: '钥匙丢了',
    };
    return next;
  }

  let user = yield User.findOne({
    accessToken,
  }).exec();

  if (!user) {
    this.body = {
      success: false,
      err: '用户未登录',
    };
    return next;
  }

  this.session = this.session || {};
  this.session.user = user;
  yield next;
};

