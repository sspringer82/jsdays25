import os from 'os';

const getCPUUsage = () => {
  const startMeasure = os.cpus();

  setTimeout(() => {
    const endMeasure = os.cpus();

    startMeasure.forEach((cpu, index) => {
      const startIdle = cpu.times.idle;
      const startTotal = Object.values(cpu.times).reduce((a, b) => a + b, 0);

      const endIdle = endMeasure[index].times.idle;
      const endTotal = Object.values(endMeasure[index].times).reduce((a, b) => a + b, 0);

      const idleDiff = endIdle - startIdle;
      const totalDiff = endTotal - startTotal;

      const usage = 100 - (100 * idleDiff) / totalDiff;
      console.log(`CPU ${index}: ${usage.toFixed(2)}%`);
    });
  }, 1000);
};

getCPUUsage();