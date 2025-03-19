import pidusage from 'pidusage';

setInterval(() => {
  pidusage(process.pid, (err, stats) => {
    if (err) throw err;
    console.log(`CPU: ${stats.cpu.toFixed(2)}% | Memory: ${stats.memory / 1024 / 1024} MB`);
  });
}, 1000);