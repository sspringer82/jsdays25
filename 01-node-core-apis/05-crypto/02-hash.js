import crypto from 'crypto';

function createMD5Hash(data) {
  const hash = crypto.createHash('md5');
  hash.update(data);
  return hash.digest('hex');
}

const text = "Beispieltext";
console.log(`MD5 Hash: ${createMD5Hash(text)}`);