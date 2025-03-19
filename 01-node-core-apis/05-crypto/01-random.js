import { webcrypto } from 'crypto';
const crypto = webcrypto;

function generateRandomBytes(length = 16) {
  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);
  return randomBytes;
}

function getRandomIntInRange(min, max) {
  const randomBuffer = new Uint32Array(1);
  crypto.getRandomValues(randomBuffer);
  
  const range = max - min + 1;
  const maxValid = Math.floor(0xFFFFFFFF / range) * range - 1;
  
  let randomValue = randomBuffer[0];
  if (randomValue > maxValid) {
    return getRandomIntInRange(min, max); 
  }
  
  return min + (randomValue % range);
}

function getRandomIntInRangeSimple(min, max) {
    const randomValue = crypto.getRandomValues(new Uint32Array(1))[0];
    return min + (randomValue % (max - min + 1));
}

function generateUUID() {
  return crypto.randomUUID();
}

function getRandomHexString(length = 16) {
  const bytes = generateRandomBytes(length);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Beispiel-Verwendung
console.log('16 zufällige Bytes:', generateRandomBytes(16));
console.log('Zufallszahl zwischen 1-100:', getRandomIntInRange(1, 100));
console.log('Zufallszahl zwischen 1-100:', getRandomIntInRangeSimple(1, 100));
console.log('Zufalls-UUID:', generateUUID());
console.log('Zufälliger Hex-String:', getRandomHexString(8));




