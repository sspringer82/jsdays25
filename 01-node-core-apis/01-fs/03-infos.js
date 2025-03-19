// Kompaktes Beispiel für Dateiinformationen mit fs/promises (ESM Version)
import { stat, writeFile } from 'fs/promises';
import { join } from 'path';

// ESM __dirname Äquivalent
const __dirname = new URL('.', import.meta.url).pathname;

// Hauptfunktion für asynchrone Operationen
async function getFileInfo(testFile) {
  try {
    const stats = await stat(testFile);
    
    console.log(`
Dateiinformationen mit fs/promises:
- Größe: ${stats.size} Bytes
- Erstellt: ${stats.birthtime}
- Zuletzt geändert: ${stats.mtime}
- Ist Datei: ${stats.isFile()}
- Ist Verzeichnis: ${stats.isDirectory()}
- Zugriffsrechte: ${stats.mode.toString(8).slice(-3)}
- Dateibesitzer: ${stats.uid}
- Gruppe: ${stats.gid}
- Zuletzt zugegriffen: ${stats.atime}
    `);
    
  } catch (error) {
    console.error('Fehler:', error);
  }
}

// Funktion ausführen
const testFile = join(__dirname, 'testdatei.txt');

await writeFile(testFile, 'Dies ist ein Test zum Auslesen von Dateiinformationen.');
console.log(`Testdatei erstellt: ${testFile}`);

getFileInfo(testFile);