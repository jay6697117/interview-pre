const fs = require('fs');
const path = require('path');
const https = require('https');
const puppeteer = require('puppeteer');

function sleep(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

const url = 'https://movie.douban.com/tv/#!type=tv&tag=%E7%83%AD%E9%97%A8&sort=recommend&page_limit=20&page_start=0';
// const url = `https://movie.douban.com/tag/#/?sort=T&range=0,10&tags=`;

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
    await page.goto(url, {
      waitUntil: 'networkidle2' //等待页面不动了，说明加载完毕了
    });
    await sleep(3000);
    await page.waitForSelector('.more'); //异步的，等待元素加载之后，否则获取不到异步加载的元素
    for (let i = 0; i < 10; i++) {
      await sleep(3000);
      await page.click('.more'); //点击按钮一次
    }
    //evaluate 方法中注册回调函数，并分析dom结构，从下图可以进行详细分析，并通过document.querySelectorAll('ol li a')拿到文章的所有链接
    const result = await page.evaluate(() => {
      //这里调用了了windows里的jQuary的方法
      var $ = window.$;
      var items = $('.list-wp a');
      var links = [];
      //判断这里是否列表有数值
      if (items.length >= 1) {
        items.each((index, item) => {
          let it = $(item);
          console.log('it :>> ', it);
          let doubanID = it.find('div').data('id');
          // jQuery >= 1.4.3，可以选择div中data-id属性的值
          // let title = it.find('.title').text();
          // let rate = Number(it.find('.rate').text());
          let imgUrl = it.find('img').attr('src');
          links.push({
            doubanID,
            // title,
            // rate,
            imgUrl
          });
        });
      }
      return links;
    });
    browser.close();
    console.log('result :>> ', result);
    // convert JSON object to string
    const dataStr = JSON.stringify(result, null, '  ');
    // write JSON string to a file
    fs.writeFile(__filename.replace(/\.js$/, '.json'), dataStr, err => {
      if (err) {
        throw err;
      }
      console.log('JSON data is saved.');
    });
  } catch (err) {
    console.log(err);
  }
})();
