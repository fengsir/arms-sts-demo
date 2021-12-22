const express = require('express');
const router = express.Router();
const axios = require('axios');
const Core = require('@alicloud/pop-core');

//TODO：请替换下面4个参数
const conf = {
  accessKeyId: 'xxx',
  accessKeySecret: 'xxx',
  RoleArn: 'acs:ram::xxx:role/xxx',
  RoleSessionName: 'default',
}
const signinHost = 'https://signin.aliyun.com';
const loginUrl = 'https://account.aliyun.com'

const client = new Core({
  accessKeyId: conf.accessKeyId,
  accessKeySecret: conf.accessKeySecret,
  endpoint: 'https://sts.aliyuncs.com',
  apiVersion: '2015-04-01'
});

async function getUrl(destination) {
  /*
  * 第一步
  * */
  //设置参数，指定角色ARN，并设置Policy以进一步限制STS Token获取的权 // acs:ram::$accountID:role/$roleName
  //构建AssumeRole请求
  let stsToken;
  try {
    stsToken = await client.request('AssumeRole', {
      RoleArn: conf.RoleArn,
      RoleSessionName: conf.RoleSessionName,
    });
  } catch (e) {
    return undefined
  }
  const ops = stsToken.Credentials;

  /*
  * 第二步
  * 获取登录Token
  * */
  const loginToken = await axios.get(signinHost + '/federation', {
    params: {
      'Action': 'GetSigninToken',
      'AccessKeyId': ops.AccessKeyId,
      'AccessKeySecret': ops.AccessKeySecret,
      'SecurityToken': ops.SecurityToken,
      'TicketType': 'mini',
    }
  }).then(res => res.data);

  /*
  * 第三步
  * 获取免登地址
  * */
  try {
    const u = new URL(signinHost + '/federation');
    u.searchParams.set('Action', 'Login');
    u.searchParams.set('LoginUrl', loginUrl);
    u.searchParams.set('Destination', destination);
    u.searchParams.set('SigninToken', loginToken.SigninToken);
    console.log(u.href);
    return u.href
  } catch (e) {
    return undefined
  }
}

// 获取STS免登链接
router.get('/sts', function (req, res, next) {
  var _url = req.query.url;
  getUrl(_url).then(url => {
    res.send({ url })
  })
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Grafana STS Demo' });
});

module.exports = router;
