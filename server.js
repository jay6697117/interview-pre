//引入express框架
const express = require('express'); //引入express
const { createProxyMiddleware } = require('http-proxy-middleware'); //引入跨域中间件
const app = express();
//这里要注意"^/" 是匹配的路由,它会将匹配的路由进行转发，没匹配到的就不会转发。

//这段程序的作用是将我们的前端项目设置成静态资源
app.use(express.static('./crossOrigin'));
app.use(
  '/times',
  createProxyMiddleware({
    //目标后端服务地址
    target: 'http://8.129.64.205:12345',
    changeOrigin: true,
    // pathRewrite: {
    //   '^/times': '/times'
    // }
  })
);

app.listen(8081, () => {
  console.log('server is run 8081, please open: http://localhost:8081/');
});

// http://8.129.64.205:12345/times/member-center/integrated/api/v1/user
