import express from 'express';

const app = express();
const PORT = 3000;

// CPU-intensive Funktion: Berechnet die Fibonacci-Zahl rekursiv (ineffizient)
const fibonacci = (num) => {
  if (num <= 1) return num;
  return fibonacci(num - 1) + fibonacci(num - 2);
};

const memoizedFibonacci = (() => {
    const cache = new Map();
    
    return (num) => {
      if (num <= 1) return num;
      if (cache.has(num)) return cache.get(num);
      
      const result = memoizedFibonacci(num - 1) + memoizedFibonacci(num - 2);
      cache.set(num, result);
      return result;
    };
  })();



// API-Endpunkt, der eine hohe CPU-Last erzeugt
app.get('/cpu-intensive', (req, res) => {
  const n = Number(req.query.n) || 40; // Standard: 40 (starke Belastung)
  const result = fibonacci(n);
  res.send(`Fibonacci(${n}) = ${result}`);
});

app.get('/cpu-intensive-mem', (req, res) => {
    const n = Number(req.query.n) || 40;
    const result = memoizedFibonacci(n);
    res.send(`Fibonacci(${n}) = ${result}`);
  });

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});