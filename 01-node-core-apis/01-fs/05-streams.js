// Kompaktes Beispiel für Dateistreams (ESM Version)
import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { createGzip } from "zlib";
import { join } from "path";
import { writeFile } from "fs/promises";

// Pfade definieren
const __dirname = new URL(".", import.meta.url).pathname;
const sourceFile = join(__dirname, "quelldatei.txt");
const targetFile = join(__dirname, "zieldatei.txt");
const compressedFile = join(__dirname, "komprimiert.gz");

// Beispieldatei erstellen
await writeFile(
  sourceFile,
  "Dies ist ein Beispieltext für Stream-Operationen.\n".repeat(5)
);
console.log(`Quelldatei erstellt: ${sourceFile}`);

try {
  const readStream = createReadStream(sourceFile);
  const writeStream = createWriteStream(targetFile);

  readStream.pipe(writeStream);
  await new Promise((resolve) => writeStream.on("finish", resolve));
  console.log(`Datei kopiert nach: ${targetFile}`);

  // 2. Datei komprimieren mit pipeline()
  await pipeline(
    createReadStream(sourceFile),
    createGzip(),
    createWriteStream(compressedFile)
  );
  console.log(`Datei komprimiert nach: ${compressedFile}`);
} catch (error) {
  console.error("Fehler:", error);
}
