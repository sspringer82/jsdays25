import { performance, PerformanceObserver } from 'perf_hooks';

// PerformanceObserver zur Überwachung der Messungen
const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`[${entry.name}] Dauer: ${entry.duration.toFixed(2)} ms`);
  });
});
obs.observe({ entryTypes: ['measure'] });

function simulateTask() {
  performance.mark('startTask');

  // Simulierte Verzögerung
  for (let i = 0; i < 1e7; i++) {} // CPU-intensive Schleife

  performance.mark('endTask');
  performance.measure('Task-Dauer', 'startTask', 'endTask');
}

// Messen der Startzeit der App bis zur ersten Aufgabe
performance.mark('beforeFirstTask');
performance.measure('App-Start bis erste Aufgabe', 'beforeFirstTask'); // Misst Zeit seit App-Start

// Erste Messung
simulateTask();

// Asynchrone Messung
setTimeout(() => {
  performance.mark('startAsyncTask');
  
  setTimeout(() => {
    performance.mark('endAsyncTask');
    performance.measure('Async-Task-Dauer', 'startAsyncTask', 'endAsyncTask');
  }, 500);
}, 200);