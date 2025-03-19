import { readFile } from 'node:fs';
import {setTimeout} from 'node:timers/promises';
import util from 'node:util';

console.log('xxx');
await setTimeout(2_000);
console.log('xxx');

const p = Promise.resolve('Auto').then(data => console.log(data));
p.then(() => console.log('yyy'));

readFile('./index.txt', 'utf-8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});

const promisedVersion = util.promisify(readFile);
const data = await promisedVersion('./index.txt', 'utf-8');

console.log('promisedVersion ', data);