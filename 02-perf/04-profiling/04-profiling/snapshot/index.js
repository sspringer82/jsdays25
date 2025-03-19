import fs from 'fs';
import v8 from 'v8';

const takeHeapSnapshot = (filename = 'heap-snapshot.heapsnapshot') => {
  const snapshotStream = v8.getHeapSnapshot();
  const fileStream = fs.createWriteStream(filename);

  snapshotStream.pipe(fileStream);
  console.log(`Heap snapshot saved as ${filename}`);
};

// Beispiel: Speicherleck simulieren
const leakyArray = [];
setInterval(() => {
  leakyArray.push(new Array(100000).fill('*')); // Simuliert wachsendes Memory-Leak
  console.log('Memory growing...');
}, 1000);

// Heap Snapshot nach 5 Sekunden erstellen
setTimeout(() => takeHeapSnapshot(), 5000);