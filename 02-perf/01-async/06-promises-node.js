// --- fs ---

import { readFile } from 'node:fs/promises';

async function readTextFile() {
  try {
    const content = await readFile(new URL(import.meta.url), 'utf8');
    console.log('File Content:', content.slice(0, 100)); 
  } catch (error) {
    console.error('File Read Error:', error);
  }
}

readTextFile();

// --- dns ---

import { lookup } from 'node:dns/promises';

async function resolveDomain() {
  try {
    const { address, family } = await lookup('example.com');
    console.log(`Resolved IP: ${address}, Family: IPv${family}`);
  } catch (error) {
    console.error('DNS Lookup Error:', error);
  }
}

resolveDomain();

// --- stream ---

import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';

async function copyFile() {
  try {
    await pipeline(
      createReadStream('index.txt'),
      createWriteStream('destination.txt')
    );
    console.log('File copied successfully!');
  } catch (error) {
    console.error('Stream Error:', error);
  }
}

copyFile();

// --- timers ---

import { setTimeout } from 'node:timers/promises';

async function delayedMessage() {
  console.log('Waiting for 2 seconds...');
  await setTimeout(2000);
  console.log('2 seconds later...');
}

delayedMessage();

// --- crypto ---

import { subtle } from 'node:crypto';

async function hashText(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  console.log(`Hashed "${text}": ${hashHex}`);
}

hashText('Hello, World!');

// --- util promisify ---

import { promisify } from 'node:util';
import { readFile as readFileCallback } from 'node:fs';

const readFileAsync = promisify(readFileCallback);

async function readConfigFile() {
  try {
    const content = await readFileAsync('index.txt', 'utf8');
    console.log('Config Content:', content);
  } catch (error) {
    console.error('Read Error:', error);
  }
}

readConfigFile();