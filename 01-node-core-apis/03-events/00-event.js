import { EventEmitter } from 'events';

const myEmitter = new EventEmitter();

myEmitter.on('error', (err) => {
  console.error('Ein Fehler ist aufgetreten:', err);
});
myEmitter.emit('error', 'xxx');


myEmitter.on('message', (msg) => {
  console.log('Eine Nachricht wurde empfangen:', msg);
});

console.log('Löse "message"-Events aus:');
myEmitter.emit('message', 'Hallo Welt!');
myEmitter.emit('message', 'Wie geht es dir?');

console.log('\nAnzahl der Listener für "message":', myEmitter.listenerCount('message'));

myEmitter.removeAllListeners('message');
console.log('Alle "message"-Listener entfernt');

console.log('\nVersuche "message"-Event auszulösen (keine Ausgabe mehr):');
myEmitter.emit('message', 'Diese Nachricht wird nicht angezeigt');