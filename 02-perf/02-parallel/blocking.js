// blocking-server.js - Webserver mit blockierender Berechnung
import http from 'http';
import url from 'url';

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

// Webserver erstellen
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // Route für die rechenintensive Aufgabe
  if (parsedUrl.pathname === '/calculate') {
    const iterations = parseInt(parsedUrl.query.iterations) || 1000000;
    
    console.log(`[SERVER] Starte Berechnung mit ${iterations} Iterationen`);
    
    const startTime = Date.now();
    
    // Rechenintensive Aufgabe DIREKT im Hauptprozess ausführen
    // Dies blockiert die Event-Loop und alle anderen Anfragen müssen warten
    const result = calculatePi(iterations);
    
    const endTime = Date.now();
    const processTime = endTime - startTime;
    
    console.log(`[SERVER] Berechnung abgeschlossen in ${processTime}ms`);
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      result: result,
      processTime: processTime,
      pid: process.pid
    }));
  } else {
    // Standard-Antwort für andere Routen
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <head><title>Blocking Code Demo</title></head>
        <body>
          <h1>Rechenintensive Aufgabe mit blockierendem Code</h1>
          <p>Starten Sie eine Berechnung mit:</p>
          <a href="/calculate?iterations=10000000000">/calculate?iterations=10000000000</a>
          <p>Sie können die Anzahl der Iterationen anpassen, um die Berechnungsdauer zu verändern.</p>
          <p><strong>Hinweis:</strong> Während eine Berechnung läuft, ist der Server für andere Anfragen blockiert!</p>
        </body>
      </html>
    `);
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`[SERVER] Server läuft auf http://localhost:${PORT}`);
});