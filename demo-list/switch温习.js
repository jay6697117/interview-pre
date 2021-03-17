let str = '';
const condition = 0;

switch (condition) {
  case 1:
    str = '我是整数1';
    break;
  case 2:
  case 3:
  case 4:
  case 5:
    str = '我是大于等于2，小于等于5整数';
    break;
  default:
    str = '我是默认值，不等于1到5整数';
    break;
}

console.log('condition :>> ', condition);
console.log('str :>> ', str);
