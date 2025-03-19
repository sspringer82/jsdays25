// Kompaktes Beispiel für Dateibearbeitung mit Node.js fs-API (ESM Version)
import { appendFile, truncate, chmod, writeFile, readFile } from "fs/promises";
import { join } from "path";

// Pfad zur Testdatei
const __dirname = new URL(".", import.meta.url).pathname;
const testFile = join(__dirname, "bearbeitung.txt");

// Initiale Datei erstellen
await writeFile(testFile, "Dies ist der ursprüngliche Inhalt.\n");
console.log(`Datei erstellt: ${testFile}`);
console.log(`Initialinhalt: ${await readFile(testFile, "utf8")}`);

try {
  // 1. Text zur Datei hinzufügen (anhängen)
  await appendFile(testFile, "Dieser Text wurde angehängt.\n");
  console.log(`\nText angehängt. Neuer Inhalt:`);
  console.log(await readFile(testFile, "utf8"));

  // Weiteren Text anhängen
  await appendFile(testFile, "Noch mehr Text wurde angehängt.\n");
  console.log(`\nWeiterer Text angehängt. Neuer Inhalt:`);
  console.log(await readFile(testFile, "utf8"));

  // 2. Datei kürzen (truncate)
  await truncate(testFile, 30);
  console.log(`\nDatei auf 30 Bytes gekürzt. Neuer Inhalt:`);
  console.log(await readFile(testFile, "utf8"));

  // 3. Zugriffsrechte ändern (chmod)
  // 0o666 entspricht -rw-rw-rw-
  await chmod(testFile, 0o666);
  console.log(`\nZugriffsrechte auf 0o666 (rw-rw-rw-) geändert.`);
} catch (error) {
  console.error("Fehler bei der Dateibearbeitung:", error);
}
