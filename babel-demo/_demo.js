'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
// console.log('exports 000:>> ', exports);
exports['default'] = exports.obj1 = void 0;
var obj = {
  a: 1
};
var obj1 = Object.assign({}, obj);
// exports.obj1 = obj1;

var obj2 = {
  b: 2
};
var _default = obj2;
// exports['default'] = _default;

module.exports.obj1 = obj1;
module.exports['default'] = _default;
exports = module.exports;

// console.log('exports 001:>> ', exports);
// console.log('module.exports :>> ', module.exports);
// console.log('exports.__esModule :>> ', exports.__esModule);
// console.log('module.exports.__esModule :>> ', module.exports.__esModule);

console.log('module :>> ', module);
console.log('module.exports :>> ', module.exports);
console.log('exports :>> ', exports);

// export default || module.exports  一个
// export || exports  多个
