import { EventEmitter } from "node:events";

async function* eventEmitterToAsyncIterator(emitter, eventName) {
  const queue = [];
  let pendingResolve = null;

  const listener = (data) => {
    if (pendingResolve) {
      pendingResolve({ value: data, done: false });
      pendingResolve = null;
    } else {
      queue.push(data);
    }
  };

  emitter.on(eventName, listener);

  try {
    while (true) {
      if (queue.length > 0) {
        yield { value: queue.shift(), done: false };
      } else {
        yield await new Promise((resolve) => {
          pendingResolve = resolve;
        });
      }
    }
  } finally {
    emitter.off(eventName, listener);
  }
}

// Beispielhafte Verwendung:
const emitter = new EventEmitter();

(async () => {
  for await (const data of eventEmitterToAsyncIterator(emitter, "data")) {
    console.log("Empfangen:", data);
  }
})();

// Events auslösen
setTimeout(() => emitter.emit("data", "Daten 1"), 100);
setTimeout(() => emitter.emit("data", "Daten 2"), 200);
setTimeout(() => emitter.emit("data", "Daten 3"), 300);

emitter.emit("data", "Daten 4");
emitter.emit("data", "Daten 5");
emitter.emit("data", "Daten 6");
