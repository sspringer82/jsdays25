// pi_calculator.js - Worker Thread Script
import { parentPort } from 'worker_threads';

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

// Auf Nachrichten vom Hauptthread hören
parentPort.on('message', (iterations) => {
    console.log(`[Worker] Starte Berechnung mit ${iterations} Iterationen`);
    
    // Rechenintensive Aufgabe ausführen
    const result = calculatePi(iterations);
    
    console.log(`[Worker] Berechnung abgeschlossen, sende Ergebnis zurück`);
    
    // Ergebnis zurück an den Hauptthread senden
    parentPort.postMessage(result);
});

console.log(`[Worker] Initialisiert und bereit für Aufgaben`);