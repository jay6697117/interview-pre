const fs = require('fs');
const path = require('path');
const https = require('https');
const puppeteer = require('puppeteer');

function sleep(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

async function getWelfareImage(url) {
  // 返回解析为Promise的浏览器
  const browser = await puppeteer.launch();
  // 返回新的页面对象
  const page = await browser.newPage();
  // 页面对象访问对应的url地址
  await page.goto(url, {
    waitUntil: 'networkidle2'
  });
  // 等待3000ms，等待浏览器的加载
  await sleep(3000);
  // 可以在page.evaluate的回调函数中访问浏览器对象，可以进行DOM操作
  const urls = await page.evaluate(() => {
    let imgs = document.querySelectorAll('img.swp__img');
    let url = [];
    url.push(imgs[0].getAttribute('src'));
    for (let index = 1; index < imgs.length; index++) {
      url.push(imgs[index].getAttribute('data-src'));
    }
    // 返回所有图片url地址数组
    return url;
  });
  console.log('urls :>> ', urls);
  // for (let index = 0; index < urls.length; index++) {
  //   const url = urls[index];
  //   const req = https.request(url, res => {
  //     res.pipe(fs.createWriteStream(path.basename(url)));
  //   });
  //   req.end();
  // }
  // 关闭无头浏览器
  await browser.close();
}

getWelfareImage(
  'https://shop43191641.m.youzan.com/wscgoods/detail/3nj59m5b2siox?banner_id=t.131837997~goods.1~2~R1pNn3gG&alg_id=0&slg=0&reft=1616140834473_1616143936190&spm=fake.0_f.90201357_t.131837997&oid=58929946'
);
