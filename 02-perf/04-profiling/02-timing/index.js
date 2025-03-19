console.time('xxx');

console.log(performance.now());

setTimeout(() => {
  console.timeEnd('xxx');
}, 1_000);
console.log(performance.now());