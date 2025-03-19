import { Readable } from 'stream';

const readable = Readable.from(['Chunk 1', 'Chunk 2', 'Chunk 3']);

readable.on('data', (chunk) => {
  console.log('Received:', chunk.toString());
});

// Ausgabe:
// Received: Chunk 1
// Received: Chunk 2
// Received: Chunk 3


const readable2 = Readable.from(['Chunk A', 'Chunk B', 'Chunk C']);

readable2.on('readable', () => {
  let chunk;
  while ((chunk = readable2.read()) !== null) {
    console.log('Manually read:', chunk.toString());
  }
});

// Ausgabe (nur wenn `read()` aufgerufen wird):
// Manually read: Chunk A
// Manually read: Chunk B
// Manually read: Chunk C


const readable3 = Readable.from(['Data 1', 'Data 2', 'Data 3']);

readable3.on('data', (chunk) => {
  console.log('Flowing mode:', chunk.toString());
  readable3.pause(); // Stoppt den Flowing Mode
  setTimeout(() => readable3.resume(), 1000); // Nach 1s wieder starten
});