// ------------------------------ Readable Stream ------------------------------

import { createReadStream } from 'fs';

const readableStream = createReadStream('file.txt', { encoding: 'utf8'});

readableStream.on('data', (chunk) => {
  console.log('Received chunk:', chunk);
});
readableStream.on('end', () => {
  console.log('Finished reading file.');
});


// ------------------------------ Writable Stream ------------------------------
import { createWriteStream } from 'fs';

const writableStream = createWriteStream('output.txt');

writableStream.write('Hello, ');
writableStream.write('Streams in Node.js!\n');
writableStream.end(); // Beendet den Stream


// ------------------------------ Custom Readable Stream ------------------------------
import { Readable } from 'stream';

class CustomReadable extends Readable {
  constructor() {
    super();
    this.data = ['Hello', 'World', 'Streams'];
  }

  _read() {
    if (this.data.length === 0) {
      this.push(null); // Ende des Streams
    } else {
      this.push(this.data.shift() + '\n');
    }
  }
}

const readable = new CustomReadable();
readable.pipe(process.stdout);

// ------------------------------ Custom Writable Stream ------------------------------

import { Writable } from 'stream';

class CustomWritable extends Writable {
    _write(chunk, encoding, callback) {
        console.log('Received:', chunk.toString());
        callback(); // Signalisiert, dass das Schreiben abgeschlossen ist
    }
}

const writable = new CustomWritable();
writable.write('Hello, ');
writable.write('Custom Writable Stream!\n');

// ------------------------------ Transform ------------------------------

import { Transform } from 'stream';

class UpperCaseTransform extends Transform {
  _transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
}

const transformStream = new UpperCaseTransform();
const readableStream2 = createReadStream('file2.txt', { encoding: 'utf8' });
const writableStream2 = createWriteStream('output2.txt');

readableStream2.pipe(transformStream).pipe(writableStream2);