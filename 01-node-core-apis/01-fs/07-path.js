// Beispiel für Pfadverwaltung mit fs-API und path-Modul (ESM Version)
import { symlink, readlink, mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

// Pfade definieren
const __dirname = new URL(".", import.meta.url).pathname;
const originFile = join(__dirname, "original.txt");
const symLinkFile = join(__dirname, "verknuepfung.txt");
const nestedDir = join(__dirname, "unterordner");

try {
  // Testdateien und -verzeichnisse erstellen
  if (!existsSync(nestedDir)) await mkdir(nestedDir);
  await writeFile(originFile, "Dies ist die Originaldatei.");
  console.log(`Originaldatei erstellt: ${originFile}`);

  // 1. Symbolischen Link erstellen
  await symlink(originFile, symLinkFile);
  console.log(`Symbolischer Link erstellt: ${symLinkFile} -> ${originFile}`);

  // 2. Ziel eines symbolischen Links auslesen
  const linkTarget = await readlink(symLinkFile);
  console.log(`Der Link zeigt auf: ${linkTarget}`);
} catch (error) {
  console.error("Fehler bei der Pfadverwaltung:", error);
}
