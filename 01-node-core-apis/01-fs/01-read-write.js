import { readFile, writeFile } from "node:fs/promises";

const data = "Hello, Node.js";

await writeFile('file.txt', data, {flag: 'a+'});

const content = await readFile('file.txt', 'utf-8');

console.log(content);
