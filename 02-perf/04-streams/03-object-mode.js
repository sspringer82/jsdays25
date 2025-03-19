import { Readable } from 'stream';

const readable = Readable.from(['Hello', ' ', 'World'], { encoding: 'utf8' });

readable.on('data', (chunk) => console.log(chunk)); // Gibt Strings aus


const objectStream = Readable.from([{ id: 1 }, { id: 2 }], { objectMode: true });

objectStream.on('data', (chunk) => console.log(chunk)); 
// Gibt { id: 1 } und { id: 2 } aus (kein Buffer!)