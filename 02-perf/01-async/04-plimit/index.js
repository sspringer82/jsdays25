import pLimit from 'p-limit';
import {setTimeout} from 'timers/promises';

async function fetchData(id, delay) {
  console.log(`Starte Aufgabe ${id}...`);
  await setTimeout(delay);
  console.log(`Aufgabe ${id} abgeschlossen nach ${delay}ms`);
  return { id, result: `Daten für ${id}`, processingTime: delay };
}

// Hauptfunktion
async function main() {
  console.log('Demo: p-limit mit 2 gleichzeitigen Aufgaben');
  
  // Begrenze auf 2 gleichzeitige Promises
  const limit = pLimit(2);
  
  // Aufgaben mit unterschiedlichen Verarbeitungszeiten
  const tasks = [
    { id: 1, delay: 2000 },
    { id: 2, delay: 1000 },
    { id: 3, delay: 3000 },
    { id: 4, delay: 1500 }
  ];
  
  console.log(`Starte ${tasks.length} Aufgaben mit maximal 2 gleichzeitig`);
  console.time('Gesamtzeit');
  
  // Alle Aufgaben starten, aber nur 2 laufen gleichzeitig
  const results = await Promise.all(
    tasks.map(task => limit(() => fetchData(task.id, task.delay)))
  );
  
  console.timeEnd('Gesamtzeit');
  console.log('Alle Ergebnisse:', results);
}

main().catch(error => console.error('Fehler:', error));