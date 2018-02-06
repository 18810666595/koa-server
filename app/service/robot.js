'use strict';

const qiniu = require('qiniu');
const sha1 = require('sha1');
const config = require('../../config/config');

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = config.qiniu.AK;
qiniu.conf.SECRET_KEY = config.qiniu.SK;

//要上传的空间
let bucket = 'gougouavatar';
//上传到七牛后保存的文件名
// const key = 'my-nodejs-logo.png';
//构建上传策略函数
function uptoken(bucket, key) {
  let putPolicy = new qiniu.rs.PutPolicy(bucket + ':' + key);
  // putPolicy.callbackUrl = 'http://your.domain.com/callback';
  // putPolicy.callbackBody = 'filename=$(fname)&filesize=$(fsize)';
  let token = putPolicy.token();
  return token;
}

//生成七牛 token
exports.getQiniuToken = function (key) {
  return uptoken(bucket, key);
};

//生成 cloudinary token
exports.getCloudinaryToken = function (body) {
  let {type, timestamp} = body;
  let folder;
  let tags;
  if (type === 'avatar') {
    folder = 'avatar';
    tags = 'app,avatar';
  } else if (type === 'video') {
    folder = 'video';
    tags = 'app,video';
  } else if (type === 'audio') {
    folder = 'audio';
    tags = 'app,audio';
  }

  // 签名
  let signatureStr = `folder=${folder}&tags=${tags}&timestamp=${timestamp}${config.cloudinary.api_secret}`;

  return sha1(signatureStr);
};