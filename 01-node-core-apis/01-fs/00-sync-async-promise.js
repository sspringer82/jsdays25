import { readFile, readFileSync } from "node:fs";
import { readFile as readFilePromise } from "node:fs/promises";

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
  console.log('1');
  const contentPromise = await readFilePromise("input.txt", "utf-8");
  console.log('2');
  console.log(contentPromise);
} catch (error) {
  console.error("Fehler beim Lesen der Datei:", error);
}

console.log('1')
readFilePromise("input.txt", "utf-8")
.then((content) => console.log(content))
.catch((error) => console.error("Fehler beim Lesen der Datei:", error));
console.log('2')
