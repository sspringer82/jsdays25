try {
  const contentPromise = await readFilePromise("input.txt", "utf-8");
  console.log(contentPromise);
} catch (error) {
  console.error("Fehler beim Lesen der Datei:", error);
}

// contentPromise
//   .then((content) => console.log(content))
//   .catch((error) => console.error("Fehler beim Lesen der Datei:", error));
