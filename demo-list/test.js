async function getData() {
  return Promise.resolve('data 001');
}

async function getMoreData(data) {
  return Promise.resolve(`${data} + more data 002`);
}

async function getAll() {
  const data = await getData();
  const moreData = await getMoreData(data);
  return `All the data: ${data} || ${moreData}`;
}

getAll().then(res => {
  console.log('打印res :>> ', res);
});

////////////////////////////////////////////////////////////////
// CommonJS 的require()命令不能加载 ES6 模块，会报错，只能使用import()这个方法加载
// 下面的代码可以在 CommonJS 模块中运行
(async () => {
  await import('./test-demo.js');
  console.log('hello world 001');
})();
