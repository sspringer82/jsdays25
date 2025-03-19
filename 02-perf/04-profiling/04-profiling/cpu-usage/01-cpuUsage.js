const startUsage = process.cpuUsage();

// CPU-intensive Operation
for (let i = 0; i < 1e8; i++) Math.sqrt(i);

const endUsage = process.cpuUsage(startUsage);

console.log(`User CPU time: ${endUsage.user / 1000} ms`);
console.log(`System CPU time: ${endUsage.system / 1000} ms`);