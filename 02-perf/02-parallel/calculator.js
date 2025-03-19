// calculator.js - Child-Prozess für rechenintensive Berechnungen
console.log(`[WORKER ${process.pid}] Calculator-Prozess gestartet`);

// Rechenintensive Funktion: Pi-Annäherung mit Leibniz-Formel
function calculatePi(iterations) {
  let pi = 0;
  let sign = 1;
  
  for (let i = 0; i < iterations; i++) {
    pi += sign / (2 * i + 1);
    sign *= -1;
  }
  
  return 4 * pi;
}

// Auf Nachrichten vom Hauptprozess hören
process.on('message', (message) => {
  if (message.cmd === 'start') {
    const iterations = message.iterations;
    console.log(`[WORKER ${process.pid}] Starte Berechnung mit ${iterations} Iterationen`);
    
    const startTime = Date.now();
    
    // Rechenintensive Aufgabe ausführen
    const result = calculatePi(iterations);
    
    const endTime = Date.now();
    const processTime = endTime - startTime;
    
    console.log(`[WORKER ${process.pid}] Berechnung abgeschlossen in ${processTime}ms`);
    
    // Ergebnis zurück an den Hauptprozess senden
    process.send({
      cmd: 'result',
      result: result,
      processTime: processTime,
      pid: process.pid
    });
  }
});

// Fehlerbehandlung
process.on('error', (err) => {
  console.error(`[WORKER ${process.pid}] Fehler: ${err.message}`);
  process.exit(1);
});

console.log(`[WORKER ${process.pid}] Warte auf Befehle...`);