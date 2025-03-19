// ESM-Beispiel für Verschlüsselung mit Web Crypto API in Node.js
import { webcrypto } from 'crypto';
const { subtle } = webcrypto;

// Funktion zum Generieren eines AES-GCM Schlüssels
async function generateEncryptionKey() {
  return await subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256 // 256-Bit Schlüssel
    },
    true, // exportable
    ['encrypt', 'decrypt'] // Verwendungszwecke
  );
}

// Funktion zum Exportieren des Schlüssels (für Speicherung oder Übertragung)
async function exportKey(key) {
  const exportedKey = await subtle.exportKey('raw', key);
  return Buffer.from(exportedKey).toString('base64');
}

// Funktion zum Importieren eines Schlüssels
async function importKey(keyData) {
  const keyBuffer = Buffer.from(keyData, 'base64');
  return await subtle.importKey(
    'raw',
    keyBuffer,
    {
      name: 'AES-GCM',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  );
}

// Funktion zur Verschlüsselung von Daten
async function encryptData(key, data) {
  // Zufälligen Initialization Vector (IV) generieren
  const iv = webcrypto.getRandomValues(new Uint8Array(12)); // 12 Bytes für GCM
  
  // Daten in ArrayBuffer konvertieren falls nötig
  const dataBuffer = typeof data === 'string' 
    ? new TextEncoder().encode(data) 
    : data;
  
  // Daten verschlüsseln
  const encryptedBuffer = await subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
      // Optional: zusätzliche authentifizierte Daten (AAD)
      // additionalData: new TextEncoder().encode('geschützte Metadaten')
    },
    key,
    dataBuffer
  );
  
  // IV und verschlüsselte Daten kombinieren und als Base64 zurückgeben
  const result = {
    iv: Buffer.from(iv).toString('base64'),
    data: Buffer.from(encryptedBuffer).toString('base64')
  };
  
  return result;
}

// Funktion zur Entschlüsselung von Daten
async function decryptData(key, encryptedData) {
  try {
    // IV und verschlüsselte Daten aus Base64 konvertieren
    const iv = Buffer.from(encryptedData.iv, 'base64');
    const data = Buffer.from(encryptedData.data, 'base64');
    
    // Daten entschlüsseln
    const decryptedBuffer = await subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
        // Optional: AAD muss identisch sein wie bei der Verschlüsselung
        // additionalData: new TextEncoder().encode('geschützte Metadaten')
      },
      key,
      data
    );
    
    // Entschlüsselte Daten als String zurückgeben
    return new TextDecoder().decode(decryptedBuffer);
  } catch (error) {
    // Bei Fehler (z.B. Manipulation der Daten) wird eine Exception geworfen
    console.error('Entschlüsselungsfehler:', error.message);
    return null;
  }
}

// Beispiel für die Verwendung
async function demo() {
  try {
    // Schlüssel generieren
    console.log('Generiere Verschlüsselungsschlüssel...');
    const key = await generateEncryptionKey();
    
    // Schlüssel exportieren (für spätere Verwendung)
    const exportedKey = await exportKey(key);
    console.log('Exportierter Schlüssel:', exportedKey);
    
    // Daten zum Verschlüsseln
    const sensitiveData = 'Geheime Nachricht: Personenbezogene Informationen und vertrauliche Daten';
    console.log('\nOriginaldaten:', sensitiveData);
    
    // Daten verschlüsseln
    console.log('\nVerschlüssele Daten...');
    const encrypted = await encryptData(key, sensitiveData);
    console.log('Verschlüsselte Daten:', encrypted);
    
    // Daten entschlüsseln
    console.log('\nEntschlüssele Daten...');
    const decrypted = await decryptData(key, encrypted);
    console.log('Entschlüsselte Daten:', decrypted);
    
    // Demonstriere Erkennung von Manipulationen
    console.log('\nDemo: Manipulationserkennung');
    const manipulated = { ...encrypted };
    // Manipuliere einen Buchstaben in den verschlüsselten Daten
    if (manipulated.data.length > 10) {
      const arr = manipulated.data.split('');
      arr[10] = arr[10] === 'A' ? 'B' : 'A';
      manipulated.data = arr.join('');
    }
    console.log('Manipulierte Daten:', manipulated);
    
    const decryptedManipulated = await decryptData(key, manipulated);
    console.log('Entschlüsselungsergebnis nach Manipulation:', decryptedManipulated);
    
  } catch (error) {
    console.error('Fehler:', error);
  }
}

// Führe Demo aus
demo();