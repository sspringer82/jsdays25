import fs from 'node:fs'

console.log('1. Synchronous code (Main Execution)');

setTimeout(() => {
  console.log('2. setTimeout (Timer Phase)');
}, 0);

setImmediate(() => {
  console.log('3. setImmediate (Check Phase)');
});

fs.readFile('./01-phases.js', () => {
  console.log('4. I/O Callback (Poll Phase)');

  process.nextTick(() => console.log('5. process.nextTick (Microtask inside I/O Callback)'));
  setTimeout(() => console.log('6. setTimeout inside I/O (Timer Phase)'), 0);
  setImmediate(() => console.log('7. setImmediate inside I/O (Check Phase)'));
});

process.nextTick(() => console.log('8. process.nextTick (Microtask Phase)'));

console.log('9. End of Synchronous code');