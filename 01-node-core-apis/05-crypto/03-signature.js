// ESM-Beispiel für digitale Signaturen mit Web Crypto API in Node.js
import { webcrypto } from 'crypto';
const { subtle } = webcrypto;

// Funktion zum Generieren eines Schlüsselpaars (ECDSA mit P-256 Kurve)
async function generateKeyPair() {
  return await subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-256' // Alternativ: P-384, P-521
    },
    true, // exportable
    ['sign', 'verify'] // verwendungszwecke
  );
}

// Funktion zum Exportieren des öffentlichen Schlüssels (für Weitergabe)
async function exportPublicKey(publicKey) {
  const exported = await subtle.exportKey('spki', publicKey);
  // Als Base64 konvertieren für einfache Übertragung/Speicherung
  return Buffer.from(exported).toString('base64');
}

// Funktion zum Importieren eines öffentlichen Schlüssels
async function importPublicKey(publicKeyBase64) {
  const keyData = Buffer.from(publicKeyBase64, 'base64');
  return await subtle.importKey(
    'spki',
    keyData,
    {
      name: 'ECDSA',
      namedCurve: 'P-256'
    },
    true,
    ['verify']
  );
}

// Funktion zum Signieren von Daten
async function signData(privateKey, data) {
  // Daten in ArrayBuffer konvertieren falls nötig
  const dataBuffer = typeof data === 'string' 
    ? new TextEncoder().encode(data) 
    : data;
    
console.log(dataBuffer);

  const signature = await subtle.sign(
    {
      name: 'ECDSA',
      hash: { name: 'SHA-256' },
    },
    privateKey,
    dataBuffer
  );
  
  // Signatur als Base64 zurückgeben
  return Buffer.from(signature).toString('base64');
}

// Funktion zum Verifizieren einer Signatur
async function verifySignature(publicKey, data, signatureBase64) {
  // Daten in ArrayBuffer konvertieren falls nötig
  const dataBuffer = typeof data === 'string' 
    ? new TextEncoder().encode(data) 
    : data;
    
  const signature = Buffer.from(signatureBase64, 'base64');
  
  return await subtle.verify(
    {
      name: 'ECDSA',
      hash: { name: 'SHA-256' },
    },
    publicKey,
    signature,
    dataBuffer
  );
}

// Beispiel für die Verwendung
async function demo() {
  try {
    // Generiere Schlüsselpaar
    console.log('Generiere Schlüsselpaar...');
    const keyPair = await generateKeyPair();
    
    // Exportiere öffentlichen Schlüssel
    const exportedPublicKey = await exportPublicKey(keyPair.publicKey);
    console.log('Öffentlicher Schlüssel:', exportedPublicKey.substring(0, 40) + '...');
    
    // Nachricht definieren
    const message = 'Dies ist eine wichtige Nachricht, die signiert werden muss.';
    console.log('Originalnachricht:', message);
    
    // Nachricht signieren
    console.log('Signiere Nachricht...');
    const signature = await signData(keyPair.privateKey, message);
    console.log('Signatur:', signature.substring(0, 40) + '...');
    
    // Signatur verifizieren
    console.log('Verifiziere Signatur...');
    const isValid = await verifySignature(keyPair.publicKey, message, signature);
    console.log('Signatur gültig:', isValid);
    
    // Verifiziere manipulierte Nachricht
    const tamperedMessage = message + ' Manipulierter Inhalt!';
    console.log('Verifiziere manipulierte Nachricht:', tamperedMessage);
    const isTamperedValid = await verifySignature(keyPair.publicKey, tamperedMessage, signature);
    console.log('Manipulierte Signatur gültig:', isTamperedValid);
    
  } catch (error) {
    console.error('Fehler:', error);
  }
}

// Führe Demo aus
demo();