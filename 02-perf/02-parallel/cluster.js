import http from 'node:http';
import url from 'node:url';
import cluster from 'node:cluster';
import os from 'node:os';

// Anzahl der CPU-Kerne
const numCPUs = os.cpus().length;

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

// Hauptprozess (Primary)
if (cluster.isPrimary) {
  console.log(`[Primary] Prozess läuft mit PID: ${process.pid}`);
  console.log(`[Primary] Starte ${numCPUs} Worker...`);
  
  // Worker für jeden CPU Kern erstellen
  for (let i = 0; i < numCPUs - 2; i++) {
    cluster.fork();
  }
  
  // Event-Handler für beendete Worker
  cluster.on('exit', (worker, code, signal) => {
    console.log(`[Primary] Worker ${worker.process.pid} gestorben`);
    console.log('[Primary] Erstelle neuen Worker');
    cluster.fork();
  });
  
  // Nachricht von Worker empfangen
  Object.values(cluster.workers).forEach(worker => {
    worker.on('message', (message) => {
      if (message.cmd === 'log') {
        console.log(`[Master] Nachricht von Worker ${worker.process.pid}: ${message.text}`);
      }
    });
  });
} 
// Worker-Prozess
else {
  console.log(`[Worker ${process.pid}] Gestartet`);
  
  // Webserver im Worker erstellen
  const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    // Route für die rechenintensive Aufgabe
    if (parsedUrl.pathname === '/calculate') {
      const iterations = parseInt(parsedUrl.query.iterations) || 1000000;
      
      // Log an den Primary senden
      process.send({ 
        cmd: 'log', 
        text: `Starte Berechnung mit ${iterations} Iterationen` 
      });
      
      const startTime = Date.now();
      
      // Rechenintensive Aufgabe ausführen
      const result = calculatePi(iterations);
      
      const endTime = Date.now();
      const processTime = endTime - startTime;
      
      // Log an den Primary senden
      process.send({ 
        cmd: 'log', 
        text: `Berechnung abgeschlossen in ${processTime}ms` 
      });
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        result: result,
        processTime: processTime,
        pid: process.pid,
        workerId: cluster.worker.id
      }));
    } else {
      // Standard-Antwort für andere Routen
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
          <head><title>Cluster Modul Demo</title></head>
          <body>
            <h1>Rechenintensive Aufgabe mit Cluster Modul</h1>
            <p>Bearbeitet von Worker: ${process.pid}</p>
            <p>Starten Sie eine Berechnung mit:</p>
            <a href="/calculate?iterations=10000000000">/calculate?iterations=10000000000</a>
            <p>Sie können die Anzahl der Iterationen anpassen, um die Berechnungsdauer zu verändern.</p>
            <p><strong>Tipp:</strong> Öffnen Sie mehrere Browser-Tabs und senden Sie gleichzeitig Anfragen, 
            um zu sehen, wie verschiedene Worker die Anfragen parallel bearbeiten.</p>
          </body>
        </html>
      `);
    }
  });
  
  const PORT = 3000;
  server.listen(PORT, () => {
    console.log(`[Worker ${process.pid}] Server läuft auf http://localhost:${PORT}`);
  });
}