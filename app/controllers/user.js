'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');
const xss = require('xss');

exports.signup = function* (next) {
  // let phoneNumber = this.request.body.phoneNumber;
  let phoneNumber = this.query.phoneNumber;
  let user = yield User.findOne({
    phoneNumber,
  }).exec();  // 调用 exec 变成 promise

  //如果用户的 phoneNumber 没有注册过，就重新生成一个 user 注册
  if (!user) {
    user = new User({
      phoneNumber: xss(phoneNumber)
    });
  } else {
    //如果 phoneNumber 注册过了，就生成 verifyCode 验证码
    user.verifyCode = '1212';
  }

  try {
    yield user.save();
  }
  catch (e) {
    this.body = {
      success: false,
    };
    return;
  }

  this.body = {
    success: true,
  };
};

exports.verify = function* (next) {
  this.body = {
    success: true,
  };
};

exports.update = function* (next) {
  this.body = {
    success: true,
  };
};

