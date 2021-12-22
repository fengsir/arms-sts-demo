# 项目启动说明

## 第一步
安装Nodejs
https://nodejs.org/en/


## 第二步
替换 path/stsDemo/routes/index.js文件中的配置
```js
const conf = {
  accessKeyId: 'xxx',
  accessKeySecret: 'xxx',
  RoleArn: 'acs:ram::xxx:role/xxx',
  RoleSessionName: 'default',
}
```
需要去（https://ram.console.aliyun.com/）获取相关配置

安装依赖并启动
```shell
cd path/stsDemo
npm install
npm run start
```

## 第三步
1. 打开 http://localhost:3000/
2. 输入 URL，如： https://g.console.aliyun.com/
3. 点击开始「开始免登授权」按钮

具体细节请参看代码，主要逻辑在
- stsDemo/routes/index.js
- stsDemo/views/index.ejs
