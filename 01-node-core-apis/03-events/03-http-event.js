// HTTP-Server mit expliziter Event-Nutzung
import {createServer} from 'http';

// Server erstellen
const server = createServer();

// Event: 'request' - wird bei jeder eingehenden Anfrage ausgelöst
server.on('request', (req, res) => {
    console.log(`Neue Anfrage: ${req.method} ${req.url}`);
    
    // Response senden
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
});

// Event: 'connection' - wird bei jeder neuen TCP-Verbindung ausgelöst
server.on('connection', (socket) => {
    console.log(`Neue Verbindung von ${socket.remoteAddress}:${socket.remotePort}`);
    
    // Socket-Events
    socket.on('close', () => {
        console.log(`Verbindung von ${socket.remoteAddress}:${socket.remotePort} geschlossen`);
    });
});

// Event: 'close' - wird ausgelöst, wenn der Server geschlossen wird
server.on('close', () => {
    console.log('Server wurde geschlossen');
});

// Event: 'clientError' - wird bei Client-Fehlern ausgelöst
server.on('clientError', (err, socket) => {
    console.error('Client-Fehler:', err);
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

// Event: 'listening' - wird ausgelöst, wenn der Server beginnt zu lauschen
server.on('listening', () => {
    const addr = server.address();
    console.log(`Server hört auf ${addr.address}:${addr.port}`);
});

// Server starten (Port 3000)
server.listen(3000);

// Nach 10 Sekunden Server schließen (Demonstration des 'close' Events)
setTimeout(() => {
    console.log('Server wird jetzt geschlossen...');
    server.close();
}, 10000);