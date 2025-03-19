import express from 'express';

const app = express();
const PORT = 3000;

// Fake-Datenbank
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

// Route: Liste aller User abrufen
app.get('/users', (req, res) => {
  console.log('[LOG] GET /users aufgerufen'); // Log für Debugging
  res.json(users);
});

// Route: Einzelnen User abrufen
app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  console.log(`[LOG] Suche User mit ID ${userId}`);

  const user = users.find(u => u.id === userId);
  
  if (!user) {
    console.error(`[ERROR] User ${userId} nicht gefunden`);
    return res.status(404).json({ error: 'User nicht gefunden' });
  }

  res.json(user);
});

// Route: Simulierte asynchrone Berechnung mit Verzögerung
app.get('/calculate', async (req, res) => {
  console.log('[LOG] Starte Berechnung...');
  
  await new Promise(resolve => setTimeout(resolve, 2000)); // 2 Sek. Verzögerung
  
  console.log('[LOG] Berechnung abgeschlossen!');
  res.json({ result: Math.random() * 100 });
});

app.listen(PORT, () => {
  console.log(`[SERVER] Läuft auf http://localhost:${PORT}`);
});