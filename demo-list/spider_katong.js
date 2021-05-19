const fs = require('fs');
const path = require('path');
const https = require('https');
const puppeteer = require('puppeteer');
// const $ = require('jquery');
const express = require('express');
const app = express();
const mysql = require('mysql');

function sleep(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

const url = 'https://www.woyaogexing.com/touxiang/katong/index.html';

(async () => {
  try {
    console.log('start visit the target page');
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'], //不是沙箱模式
      dumpio: false,
      headless: false //是否运行在浏览器headless模式，true为不打开浏览器执行，默认为true
    });
    //args :传递给 chrome 实例的其他参数，比如你可以使用”–ash-host-window-bounds=1024x768” 来设置浏览器窗口大小。更多参数参数列表可以参考这里
    //dumpio 是否将浏览器进程stdout和stderr导入到process.stdout和process.stderr中。默认为false。
    const page = await browser.newPage();
    let finalResult = [];
    await page.goto(url, {
      waitUntil: 'networkidle2' //等待页面不动了，说明加载完毕了
    });
    await sleep(3000);
    await page.waitForSelector('.page a:nth-last-of-type(1)'); //异步的，等待元素加载之后，否则获取不到异步加载的元素
    for (let i = 0; i < 38; i++) {
      await sleep(3000);
      let result = await spider();
      finalResult.push(...result);
      await page.click('.page a:nth-last-of-type(1)'); //点击按钮一次
    }

    async function spider() {
      //evaluate 方法中注册回调函数，并分析dom结构，从下图可以进行详细分析，并通过document.querySelectorAll('ol li a')拿到文章的所有链接
      const result = await page.evaluate(links => {
        var items = document.querySelectorAll('.list-main .txList img');
        var links = [];
        //判断这里是否列表有数值
        if (items.length >= 1) {
          items.forEach((element, index) => {
            console.log('element :>> ', element);
            let imgUrl = element.getAttribute('src');
            links.push({
              imgUrl: 'http:' + imgUrl
            });
          });
        }
        return links;
      });
      return result;
    }

    browser.close();
    console.log('finalResult :>> ', finalResult);
    console.log('-------------------------');

    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: null,
      port: '3306',
      database: 'zjhdb'
    });

    connection.connect(err => {
      if (err) throw err;
      console.log('mysql 连接成功');
    });

    finalResult.forEach(element => {
      const imgUrl = element.imgUrl;
      const sql = 'insert into zjhTable (imgUrl) values ("' + imgUrl + '")'; //SQL语句
      connection.query(sql, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log('insert result :>> ', result); // 打印添加结果
      });
    });

    connection.query('SELECT * FROM zjhTable', function (error, results, fields) {
      if (error) throw error;
      console.log('query results :>> ', results); // 打印添加结果
    });

    app.listen(3000, () => {
      console.log('server is run 3000, please open: http://localhost:3000/');
    });

    // finalResult.forEach(element => {
    //   const sql = 'insert into zjhTable(imgUrl) values(element.imgUrl)'; //SQL语句
    //   connection.query(sql, (err, result) => {
    //     if (err) {
    //       console.log(err);
    //       return;
    //     }

    //     console.log(result); // 打印添加结果
    //   });
    // });
    // const sql = 'select * from zjhTable'; // 执行查询语句
    // connection.query(sql, (err, result) => {
    //   if (err) {
    //     console.log(err);
    //     return;
    //   }

    //   console.log(result); // 打印添加结果
    // });

    connection.end(); // 关闭连接

    // // convert JSON object to string
    // const dataStr = JSON.stringify(finalResult, null, '  ');
    // // write JSON string to a file
    // fs.writeFile(__filename.replace(/\.js$/, '.json'), dataStr, err => {
    //   if (err) {
    //     throw err;
    //   }
    //   console.log('JSON data is saved.');
    // });
  } catch (err) {
    console.log(err);
  }
})();
