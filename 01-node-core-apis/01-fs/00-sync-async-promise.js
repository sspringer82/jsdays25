import { readFile, readFileSync } from "fs";
import { readFile as readFilePromise } from "fs/promises";

try {
  const contentSync = readFileSync("input.txt", "utf-8");
  console.log(contentSync);
} catch (error) {
  console.error("Fehler beim Lesen der Datei:", error);
}

readFile("input.txt", "utf-8", (err, data) => {
  if (err) {
    console.error("Fehler beim Lesen der Datei:", err);
    return;
  }
  console.log(data);
});

try {
  const contentPromise = await readFilePromise("input.txt", "utf-8");
  console.log(contentPromise);
} catch (error) {
  console.error("Fehler beim Lesen der Datei:", error);
}
