'use strict';

const https = require('https');
const querystring = require('querystring');
const Promise = require('bluebird');
const speakeasy = require('speakeasy');

exports.getCode = function () {
  return speakeasy.totp({
    secret: 'chengong',
    digits: 4,
  });
};

exports.send = function (phoneNumber, msg) {
  return new Promise((resolve, reject) => {
    if (!phoneNumber) {
      reject(new Error('手机号为空'));
    }

    let postData = {
      mobile: phoneNumber,
      message: msg + '【铁壳测试】',
    };

    let content = querystring.stringify(postData);

    let options = {
      host: 'sms-api.luosimao.com',
      path: '/v1/send.json',
      method: 'POST',
      auth: 'api:key-a8099d351d6e053f3e257f0739f62481',
      agent: false,
      rejectUnauthorized: false,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': content.length
      }
    };

    let dataStr = '';
    let req = https.request(options, function (res) {
      if (res.statusCode === 404) {
        reject(new Error('短信服务器没有响应'));
      }
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        dataStr += chunk;
      });
      res.on('end', function () {
        let data;
        try {
          data = JSON.parse(dataStr);
        } catch (e) {
          reject(e);
        }

        if (data.error === 0) {
          resolve(data);
        } else {
          let errorMap = {
            '-10': '验证信息，检查api key是否和各种中心内的一致，调用传入是否正确',
            '-11': '用户接口，滥发违规内容，验证码被刷等，请联系客服解除',
            '-20': '短信余额，进入个人中心购买充值',
            '-30': '短信内容，检查调用传入参数：message',
            '-31': '短信内容，接口会同时返回  hit 属性提供敏感词说明，请修改短信内容，更换词语',
            '-32': '短信内容，短信内容末尾增加签名信息eg.【公司名称】',
            '-33': '短信过长，超过300字（含签名）	调整短信内容或拆分为多条进行发送',
            '-34': '签名不可，在后台 短信->签名管理下进行添加签名',
            '-40': '错误的手，检查手机号是否正确',
            '-41': '号码在黑，号码因频繁发送或其他原因暂停发送，请联系客服确认',
            '-42': '验证码类，前台增加60秒获取限制',
            '-50': '请求发送，查看触发短信IP白名单的设置',
          };
          reject(new Error(errorMap[data.error]));
        }
      });
    });

    req.write(content);
    req.end();
  });
};


