const cache = new Map();

const fetchData = (key) => {
  if (cache.has(key)) {
    return cache.get(key);
  }

  // Simuliert eine große Antwort (z. B. API-Response)
  let bigData = new Array(1e6).fill(`Data for ${key}`);

  cache.set(key, bigData);

  // ⚠ Memory Leak: Closure hält `bigData` unnötig fest!
  setTimeout(() => {
    console.log(`Data for ${key} expired.`);
    // ❌ Entfernt nur den Cache-Eintrag, aber Closure lebt weiter!
    cache.delete(key);
  }, 10000);

  return bigData;
};

// Simuliert API-Requests
setInterval(() => {
  fetchData(`key-${Date.now()}`); // Neue Keys erzeugen mehr Speicherverbrauch
  console.log(
    `Memory Usage:`,
    process.memoryUsage().heapUsed / 1024 / 1024,
    "MB"
  );
}, 1000);
