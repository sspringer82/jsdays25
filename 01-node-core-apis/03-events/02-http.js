// HTTP-Server ohne explizite Event-Nutzung
import http from 'http';

// Server erstellen mit Request-Handler als Callback
const server = http.createServer((req, res) => {
    console.log(`Neue Anfrage: ${req.method} ${req.url}`);
    
    // Response senden
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
});

// Server starten (Port 3000)
server.listen(3000, () => {
    const addr = server.address();
    console.log(`Server hört auf ${addr.address}:${addr.port}`);
});

// Nach 10 Sekunden Server schließen
setTimeout(() => {
    console.log('Server wird jetzt geschlossen...');
    server.close(() => {
        console.log('Server wurde geschlossen');
    });
}, 10000);

// Fehlerbehandlung
server.on('error', (err) => {
    console.error('Server-Fehler:', err);
});