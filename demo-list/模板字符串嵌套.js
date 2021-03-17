const one = '你好';
const two = '朋友';

console.log('encodeURI :>> ', encodeURI);

const res = encodeURI(`${one}`) + `, ${two}`;
const res1 = `${encodeURI(`${one}`)}, ${two}`;

console.log('res :>> ', res);
console.log('res1 :>> ', res1);
