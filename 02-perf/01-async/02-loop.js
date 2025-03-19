console.log('1');
setTimeout(() => {
  console.log('2');
}, 1_000);
console.log('3');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

setImmediate(() => {
  console.log('setImmediate');
});

process.nextTick(() => {
  console.log('nextTick');
});

Promise.resolve().then(() => {
  console.log('promise');
})