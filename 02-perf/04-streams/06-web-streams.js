const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
const reader = response.body?.getReader();

if (reader) {
  let { done, value } = await reader.read();
  while (!done) {
    console.log('📥 Chunk empfangen:', new TextDecoder().decode(value));
    ({ done, value } = await reader.read());
  }
}

// read, transform, write
import { ReadableStream, WritableStream, TransformStream } from 'node:stream/web';
import { pipeline } from 'node:stream/promises';
import { readFile, writeFile } from 'node:fs/promises';

async function processFile() {
    try {
        // ✅ 1. Dateiinhalt lesen
        const fileContent = await readFile('input.txt', { encoding: 'utf8' });
        
        // ✅ 2. ReadableStream erstellen
        const readableStream = new ReadableStream({
            start(controller) {
                controller.enqueue(fileContent);
                controller.close();
            },
        });
        
        // ✅ 3. TransformStream für Großbuchstaben
        const transformStream = new TransformStream({
            transform(chunk, controller) {
                controller.enqueue(chunk.toUpperCase());
            },
        });
        
        // ✅ 4. WritableStream für die Ausgabedatei
        const writableStream = new WritableStream({
            async write(chunk) {
                // Überschreiben statt Anhängen, um Duplikate zu vermeiden
                await writeFile('output.txt', chunk);
            },
        });
        
        // ✅ 5. Streams verbinden
        await pipeline(
            readableStream,
            transformStream,
            writableStream
        );
        
        console.log('✅ Datei erfolgreich transformiert!');
    } catch (error) {
        console.error('❌ Fehler beim Verarbeiten der Datei:', error);
    }
}

// Funktion aufrufen
processFile();

// backpressure

const writableStream2 = new WritableStream({
    write(chunk) {
      console.log('📥 Schreiben:', chunk);
      return new Promise((resolve) => setTimeout(resolve, 1000)); // Simuliert langsames Schreiben
    },
  });
  
  const writer = writableStream2.getWriter();
  
  async function writeData() {
    for (let i = 0; i < 10; i++) {
      console.log('📝 Schreibe:', i);
      await writer.write(`Chunk ${i}`);
    }
    await writer.close();
  }
  
  writeData();