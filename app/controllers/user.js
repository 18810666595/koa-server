'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');
const xss = require('xss');
const uuid = require('uuid');
const sms = require('../service/sms');

exports.signup = function* (next) {
  let phoneNumber = xss(this.request.body.phoneNumber.trim());
  console.log('phoneNumber: ' + phoneNumber);
  let user = yield User.findOne({
    phoneNumber,
  }).exec();  // 调用 exec 变成 promise

  let verifyCode = sms.getCode();

  //如果用户的 phoneNumber 没有注册过，就重新生成一个 user 注册
  if (!user) {
    let accessToken = uuid.v4();
    user = new User({
      nickname: '新用户',
      avatar: 'http://img2.zol.com.cn/up_pic/20120329/z1FS7I5aoqwXM.jpg',
      verifyCode,
      accessToken,
      phoneNumber: xss(phoneNumber),
    });
  } else {
    //如果 phoneNumber 注册过了，就生成 verifyCode 验证码
    user.verifyCode = verifyCode;
  }

  try {
    user = yield user.save();
  }
  catch (e) {
    console.log('1111\n' + e);
    this.body = {
      success: false,
    };
    return next;
  }

  let msg = '您的 APP 短信验证码是：' + verifyCode;

  try {
    sms.send(user.phoneNumber, msg);
  } catch (e) {
    console.log(e);
    this.body = {
      success: false,
      err: '短信服务异常',
    };
    return next;
  }

  this.body = {
    success: true,
  };
};

exports.verify = function* (next) {
  let {verifyCode, phoneNumber} = this.request.body;
  if (!verifyCode || !phoneNumber) {
    this.body = {
      success: false,
      err: '验证没通过'
    };
    return next;
  }

  //数据库根据 phoneNumber 和 verifyCode 查找用户
  let user = yield User.findOne({
    phoneNumber,
    verifyCode,
  }).exec();
  //如果用户存在，说明手机号和验证码正确，验证成功
  if (user) {
    user.verified = true;
    yield user.save();
    this.body = {
      success: true,
      data: {
        nickname: user.nickname,
        accessToken: user.accessToken,
        avatar: user.avatar,
        _id: user._id,
      },
    };

  } else {
    this.body = {
      success: false,
      err: '验证未通过',
    };

  }
};

exports.update = function* (next) {
  let body = this.request.body;
  let user = this.session.user;

  //用户更新
  let fields = 'avatar,gender,age,nickname'.split(',');
  fields.forEach((item) => {
    if (body[item]) {
      user[item] = xss(body[item].trim());
    }
  });

  yield user.save();

  this.body = {
    success: true,
    data: {
      accessToken: user.accessToken,
      nickname: user.nickname,
      avatar: user.avatar,
      age: user.age,
      gender: user.gender,
      _id: user._id,
    }
  };
};
