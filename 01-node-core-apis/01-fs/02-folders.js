// Einfaches Beispiel für Verzeichnisoperationen mit Node.js fs-API (ESM Version)
import { mkdir, readdir, rm, writeFile } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";

// __dirname Äquivalent in ESM erstellen
const __filename = fileURLToPath(import.meta.url);
const __dirname = new URL(".", import.meta.url).pathname;

// Testverzeichnis definieren
const testDir = join(__dirname, "meinVerzeichnis");

// 1. Verzeichnis erstellen
console.log("Erstelle Verzeichnis...");
try {
  await mkdir(testDir, { recursive: true });
  console.log(`Verzeichnis ${testDir} erstellt`);
} catch (err) {
  console.error("Fehler beim Erstellen des Verzeichnisses:", err);
}

// Eine Datei im Verzeichnis erstellen
try {
  await writeFile(join(testDir, "test.txt"), "Hallo Welt");
} catch (err) {
  console.error("Fehler beim Erstellen der Datei:", err);
}

// 2. Verzeichnis lesen
console.log("\nLese Verzeichnis...");
try {
  const dateien = await readdir(testDir);
  console.log("Verzeichnisinhalt:", dateien);
} catch (err) {
  console.error("Fehler beim Lesen des Verzeichnisses:", err);
}

// 3. Verzeichnis löschen
console.log("\nLösche Verzeichnis...");
try {
  await rm(testDir, { recursive: true });
  console.log(`Verzeichnis ${testDir} gelöscht`);
} catch (err) {
  console.error("Fehler beim Löschen des Verzeichnisses:", err);
}
