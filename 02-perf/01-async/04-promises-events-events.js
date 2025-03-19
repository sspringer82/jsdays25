import { EventEmitter } from 'node:events';
import { readFile } from 'node:fs';

const emitter = new EventEmitter();

emitter.on('customEvent', () => {
  console.log('1. EventEmitter callback (Executed immediately in Tick)');
});

readFile(new URL(import.meta.url), () => {
  console.log('2. I/O callback (Poll Phase)');
});

setImmediate(() => {
  console.log('3. setImmediate (Check Phase)');
});

setTimeout(() => {
  console.log('4. setTimeout (Timer Phase)');
}, 0);

process.nextTick(() => {
  console.log('5. process.nextTick (Microtask Phase)');
});

Promise.resolve().then(() => {
  console.log('6. Promise.resolve (Microtask Phase)');
});

emitter.emit('customEvent');

console.log('7. End of synchronous code');