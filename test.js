// 1.0 画饼论promise
/*
const bing = new Promise((resolve, reject) => {
  // 祝各位的饼都能圆满成功
  const num = Math.floor(Math.random() * 10);
  console.log('num :>> ', num);
  if (num >= 5) {
    return resolve('大家happy');
  } else {
    return reject('有难同当');
  }
});

bing
  .then(res => {
    console.log('res :>> ', res);
    return res + '1';
  })
  .then(res1 => {
    console.log('res1 :>> ', res1);
  })
  .catch(err => {
    console.log('err :>> ', err);
  });
*/

//2.0
/**
 * 判断传入的值类型是不是对象
 * @param {*} value 传入的值
 * @returns 返回布尔值
 */
function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function serialize(params) {
  let result = '';
  if (isObject(params)) {
    Object.keys(params).forEach(key => {
      let val = encodeURIComponent(params[key]);
      result += `${key}=${val}&`;
    });
  }
  return result.substr(0, result.length - 1);
}

// console.log('serialize({a:1,b:2}) :>> ', serialize({ a: 1, b: 2 }));

const defaultHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

// ajax简单封装
function request(options) {
  return new Promise((resolve, reject) => {
    const { method, url, params, headers } = options;
    const xhr = new XMLHttpRequest();
    if (method === 'GET' || method === 'DELETE') {
      // GET和DELETE一般用querystring传参
      const requestURL = url + '?' + serialize(params);
      xhr.open(method, requestURL, true);
    } else {
      xhr.open(method, url, true);
    }
    // 设置请求头
    const mergedHeaders = Object.assign({}, defaultHeaders, headers);
    Object.keys(mergedHeaders).forEach(key => {
      xhr.setRequestHeader(key, mergedHeaders[key]);
    });
    // 状态监听
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(xhr.status);
        }
      }
    };
    xhr.onerror = function (e) {
      reject(e);
    };
    // 处理body数据，发送请求
    const data = method === 'POST' || method === 'PUT' ? serialize(params) : null;
    xhr.send(data);
  });
}

const options = {
  method: 'GET',
  // url: '/user/page',
  url: 'https://api.github.com/users/jay6697117',
  params: {
    pageNo: 1,
    pageSize: 10
  }
};

// 通过Promise的形式调用接口
request(options).then(
  res => {
    // 请求成功
    console.log('res :>> ', res);
  },
  err => {
    // 请求失败
    console.log('err :>> ', err);
  }
);
