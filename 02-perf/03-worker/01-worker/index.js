// server.mjs - Hauptdatei für den Webserver mit Worker Threads
import http from 'http';
import { parse } from 'url';
import { Worker } from 'worker_threads';
import { cpus } from 'os';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Pool für Worker Threads
const workerPool = [];
const MAX_WORKERS = cpus().length;
let nextWorkerId = 0;

// __dirname and __filename replacement in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Worker Pool initialisieren
function initializeWorkerPool() {
    for (let i = 0; i < MAX_WORKERS; i++) {
        const worker = new Worker(join(__dirname, 'worker.js'));
        
        worker.on('error', (err) => {
            console.error(`[MAIN] Worker Fehler: ${err}`);
            // Ersetze fehlerhaften Worker
            const index = workerPool.findIndex(w => w.worker === worker);
            if (index !== -1) {
                createNewWorker(index);
            }
        });
        
        worker.on('exit', (code) => {
            console.log(`[MAIN] Worker beendet mit Code ${code}`);
            // Ersetze beendeten Worker
            const index = workerPool.findIndex(w => w.worker === worker);
            if (index !== -1) {
                createNewWorker(index);
            }
        });
        
        workerPool.push({
            worker,
            busy: false
        });
    }
    
    console.log(`[MAIN] Worker Pool mit ${MAX_WORKERS} Workern initialisiert`);
}

// Neuen Worker erstellen und dem Pool hinzufügen
function createNewWorker(index) {
    const worker = new Worker(join(__dirname, 'worker.js'));
    
    worker.on('error', (err) => {
        console.error(`[MAIN] Worker Fehler: ${err}`);
        const index = workerPool.findIndex(w => w.worker === worker);
        if (index !== -1) {
            createNewWorker(index);
        }
    });
    
    worker.on('exit', (code) => {
        console.log(`[MAIN] Worker beendet mit Code ${code}`);
        const index = workerPool.findIndex(w => w.worker === worker);
        if (index !== -1) {
            createNewWorker(index);
        }
    });
    
    workerPool[index] = {
        worker,
        busy: false
    };
}

// Freien Worker aus dem Pool holen
function getAvailableWorker() {
    const availableWorker = workerPool.find(w => !w.busy);
    if (availableWorker) {
        availableWorker.busy = true;
        return availableWorker.worker;
    }
    return null;
}

// Worker als verfügbar markieren
function releaseWorker(worker) {
    const workerEntry = workerPool.find(w => w.worker === worker);
    if (workerEntry) {
        workerEntry.busy = false;
    }
}

// Webserver erstellen
const server = http.createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    
    // Route für die rechenintensive Aufgabe
    if (parsedUrl.pathname === '/calculate') {
        const iterations = parseInt(parsedUrl.query.iterations) || 1000000;
        
        // Versuche, einen verfügbaren Worker zu bekommen
        const worker = getAvailableWorker();
        
        if (worker) {
            console.log(`[MAIN] Starte Berechnung mit ${iterations} Iterationen`);
            const startTime = Date.now();
            
            // Event-Handler für Nachricht vom Worker
            worker.once('message', (result) => {
                const endTime = Date.now();
                const processTime = endTime - startTime;
                
                console.log(`[MAIN] Berechnung abgeschlossen in ${processTime}ms`);
                
                // Worker freigeben für neue Aufgaben
                releaseWorker(worker);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    result: result,
                    processTime: processTime,
                    threadId: worker.threadId
                }));
            });
            
            // Aufgabe an Worker senden
            worker.postMessage(iterations);
        } else {
            // Alle Worker sind beschäftigt
            res.writeHead(503, { 'Content-Type': 'text/plain' });
            res.end('Alle Worker sind beschäftigt. Bitte versuchen Sie es später erneut.');
        }
    } else {
        // Standard-Antwort für andere Routen
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <html>
                <head><title>Worker Threads Demo</title></head>
                <body>
                    <h1>Rechenintensive Aufgabe mit Worker Threads</h1>
                    <p>Starten Sie eine Berechnung mit:</p>
                    <a href="/calculate?iterations=10000000">/calculate?iterations=10000000</a>
                    <p>Sie können die Anzahl der Iterationen anpassen, um die Berechnungsdauer zu verändern.</p>
                    <p><strong>Tipp:</strong> Öffnen Sie mehrere Browser-Tabs und senden Sie gleichzeitig Anfragen, 
                    um zu sehen, wie verschiedene Worker Threads die Anfragen parallel bearbeiten.</p>
                    <p><strong>Hinweis:</strong> Es stehen maximal ${MAX_WORKERS} Worker Threads zur Verfügung.</p>
                </body>
            </html>
        `);
    }
});

// Initialisiere den Worker Pool
initializeWorkerPool();

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`[MAIN] Server läuft auf http://localhost:${PORT}`);
});