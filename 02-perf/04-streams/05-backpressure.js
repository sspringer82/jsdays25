import { Writable } from 'stream';

const writable = new Writable({
    highWaterMark: 10, // Sehr kleiner Puffer, um das Problem schneller zu provozieren
    write(chunk, encoding, callback) {
        console.log('Schreiben:', chunk.toString());
        setTimeout(callback, 1000); // Simuliert langsames Schreiben
    },
});

let canWrite = true;
let i = 0;

function writeData() {
    while (canWrite && i < 20) {
        canWrite = writable.write(`Chunk ${i} `); // Irgendwann gibt write() false zurück
        console.log(`Versuch, Chunk ${i} zu schreiben: ${canWrite ? 'OK' : 'Back Pressure!'}`);
        i++;
    }
}

writable.on('drain', () => {
    console.log('drain-Event! Weiter geht’s...');
    canWrite = true;
    writeData(); // Wieder starten
});

writeData();