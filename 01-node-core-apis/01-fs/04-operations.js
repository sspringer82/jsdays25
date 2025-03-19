// Beispiel für Datei- und Verzeichnisoperationen mit fs/promises (ESM Version)
import { rename, copyFile, unlink, rm, mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

// ESM __dirname Äquivalent
const __dirname = new URL(".", import.meta.url).pathname;

// Pfade definieren
const sourceDir = join(__dirname, "quellverzeichnis");
const targetDir = join(__dirname, "zielverzeichnis");
const sourceFile = join(sourceDir, "quelldatei.txt");
const renamedFile = join(sourceDir, "umbenannt.txt");
const copiedFile = join(targetDir, "kopiert.txt");

// Hauptfunktion für asynchrone Operationen
try {
  // Verzeichnisse erstellen, falls sie nicht existieren
  if (!existsSync(sourceDir)) await mkdir(sourceDir);
  if (!existsSync(targetDir)) await mkdir(targetDir);

  // Testdatei erstellen
  await writeFile(sourceFile, "Dies ist eine Testdatei für Dateioperationen.");
  console.log(`Testdatei erstellt: ${sourceFile}`);

  // 1. Datei umbenennen (verschieben)
  await rename(sourceFile, renamedFile);
  console.log(`Datei umbenannt zu: ${renamedFile}`);

  // 2. Datei kopieren
  await copyFile(renamedFile, copiedFile);
  console.log(`Datei kopiert nach: ${copiedFile}`);

  // 3. Originaldatei löschen
  await unlink(renamedFile);
  console.log(`Originaldatei gelöscht: ${renamedFile}`);

  // 4. Verzeichnis rekursiv löschen (mit Inhalt)
  await rm(targetDir, { recursive: true, force: true });
  console.log(`Verzeichnis gelöscht: ${targetDir}`);

  console.log("Alle Operationen abgeschlossen!");
} catch (error) {
  console.error("Fehler bei den Dateioperationen:", error);
}
