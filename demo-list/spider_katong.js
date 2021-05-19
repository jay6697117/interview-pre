const fs = require('fs');
const path = require('path');
const https = require('https');
const puppeteer = require('puppeteer');

function sleep(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

const url = 'https://www.woyaogexing.com/touxiang/katong/index_3.html';

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
    await page.waitForSelector('body > div.pageNum.wp > div > a:nth-child(9)'); //异步的，等待元素加载之后，否则获取不到异步加载的元素
    for (let i = 0; i < 100; i++) {
      await sleep(3000);
      await page.click('body > div.pageNum.wp > div > a:nth-child(9)'); //点击按钮一次
    }
    //evaluate 方法中注册回调函数，并分析dom结构，从下图可以进行详细分析，并通过document.querySelectorAll('ol li a')拿到文章的所有链接
    const result = await page.evaluate(() => {
      var items = document.querySelectorAll('.list-main .txList img');
      var links = [];
      //判断这里是否列表有数值
      if (items.length >= 1) {
        items.forEach(element => {
          console.log('element :>> ', element);
          let imgUrl = element.getAttribute('src');
          links.push({
            imgUrl: 'http:' + imgUrl
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
