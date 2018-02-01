'use strict';

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  phoneNumber: {
    unique: true,
    type: String,
  },
  areaCode: String,
  verifyCode: String,
  verified: {
    type: Boolean,
    default: false,
  },
  accessToken: String,
  nickname: String,
  gender: String,
  breed: String,
  age: String,
  avatar: String,
  meta: {
    createAt: {
      type: Date,
      default: Date.now(),
    },
    updateAt: {
      type: Date,
      default: Date.now(),
    },
  }
});

UserSchema.pre('save', function (next) {
  // console.log(this);
  //如果数据不是新的，就更新日期
  if (!this.isNew) {
    this.meta.updateAt = Date.now();
  }
  next()
});

module.exports = mongoose.model('User', UserSchema);