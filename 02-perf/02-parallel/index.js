// server.js - Hauptdatei für den Webserver
import http from 'http';
import { fork } from 'child_process';
import url from 'url';

// Webserver erstellen
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // Route für die rechenintensive Aufgabe
  if (parsedUrl.pathname === '/calculate') {
    const iterations = parseInt(parsedUrl.query.iterations) || 1000000;
    
    console.log(`[MAIN] Starte Berechnung mit ${iterations} Iterationen`);
    
    // Child-Prozess starten
    const calculator = fork('./calculator.js');
    
    // Nachricht an den Child-Prozess senden
    calculator.send({ cmd: 'start', iterations: iterations });
    
    // Auf Nachricht vom Child-Prozess warten
    calculator.on('message', (message) => {
      if (message.cmd === 'result') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          result: message.result,
          processTime: message.processTime,
          pid: message.pid
        }));
        
        console.log(`[MAIN] Berechnung abgeschlossen durch Prozess ${message.pid}`);
      }
    });
    
    // Fehlerbehandlung für den Child-Prozess
    calculator.on('error', (error) => {
      console.error(`[MAIN] Fehler im Child-Prozess: ${error.message}`);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Ein Fehler ist aufgetreten');
    });
    
    // Bei Beendigung des Child-Prozesses
    calculator.on('exit', (code) => {
      console.log(`[MAIN] Child-Prozess beendet mit Code ${code}`);
      if (code !== 0) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Die Berechnung wurde unerwartet beendet');
      }
    });
  } else {
    // Standard-Antwort für andere Routen
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <head><title>Child Process Demo</title></head>
        <body>
          <h1>Rechenintensive Aufgabe mit Child Process</h1>
          <p>Starten Sie eine Berechnung mit:</p>
          <a href="/calculate?iterations=10000000000">/calculate?iterations=10000000000</a>
          <p>Sie können die Anzahl der Iterationen anpassen, um die Berechnungsdauer zu verändern.</p>
        </body>
      </html>
    `);
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`[MAIN] Server läuft auf http://localhost:${PORT}`);
});