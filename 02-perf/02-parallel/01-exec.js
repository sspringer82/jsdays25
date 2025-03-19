import { exec } from 'child_process';

exec('ls -1', (error, stdout, stderr) => {
  if (error) {
    console.error(`Fehler: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }

  // Zeilen auswerten und Anzahl der Dateien zählen
  const files = stdout.trim().split('\n');
  console.log(`Anzahl der Dateien im aktuellen Verzeichnis: ${files.length}`);
});