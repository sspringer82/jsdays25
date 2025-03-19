import { createReadStream, createWriteStream } from 'fs';
import { Transform } from 'stream';

const readableStream = createReadStream('input.txt', { encoding: 'utf8' });
const writableStream = createWriteStream('output.txt');

const transformStream = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase()); // Wandelt Text in Großbuchstaben um
  },
});

readableStream.pipe(transformStream).pipe(writableStream);


// import { createReadStream, createWriteStream } from 'fs';
// import { Transform } from 'stream';

const readable = createReadStream('input.txt');
const writable = createWriteStream('output.txt');

const transform1 = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().replace(/foo/g, 'bar')); // Ersetzt "foo" mit "bar"
  },
});

const transform2 = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase()); // Wandelt Text in Großbuchstaben um
  },
});

readable.pipe(transform1).pipe(transform2).pipe(writable);

import { pipeline } from 'stream/promises';
// import { createReadStream, createWriteStream } from 'fs';
// import { Transform } from 'stream';

const readable2 = createReadStream('input.txt');
const writable2 = createWriteStream('output.txt');

const transformA = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().replace(/foo/g, 'bar')); // Ersetzt "foo" mit "bar"
  },
});

const transformB = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase()); // Wandelt Text in Großbuchstaben um
  },
});

async function runPipeline() {
  try {
    await pipeline(readable2, transformA, transformB, writable2);
    console.log('Pipeline completed successfully.');
  } catch (err) {
    console.error('Pipeline failed:', err);
  }
}

runPipeline();