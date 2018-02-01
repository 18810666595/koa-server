'use strict';

const mongoose = require('mongoose');
let User = mongoose.model('User');

exports.signature = function* (next) {
  this.body = {
    success: true,
  };
};

exports.hasBody = function* (next) {
  console.log('hasBody');
  let body = this.request.body || {};
  if (!body || Object.keys(body).length === 0) {
    this.body = {
      success: false,
      err: '是不是漏掉什么了',
    };
    return next;
  }
  yield next
};

exports.hasToken = function* (next) {
  console.log('hasToken');

  console.log('query', this.query);
  console.log('body', this.request.body);

  let accessToken = this.query.accessToken || this.request.body.accessToken;
  console.log(accessToken);

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

