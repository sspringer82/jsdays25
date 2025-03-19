import fs from "fs-extra";

const content = await fs.readFile("input.txt", "utf-8");
console.log(content);

const person = {
    name: "Jane Doe",
    age: 30,
    city: "New York",

};

await fs.writeJson("person.json", person);
const personRead = await fs.readJson("person.json");
console.log(personRead);