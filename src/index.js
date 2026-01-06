const { Worker } = require('node:worker_threads');
const WORKER_FILE = './src/worker.js';

const sharedMemory = new SharedArrayBuffer(4);
const sharedArray = new Int32Array(sharedMemory);

sharedArray[0] = 0;

console.log(`[main] Before sharedArray[0]: ${sharedArray[0]}`);
const worker = new Worker(WORKER_FILE, {
  workerData: {
    sharedArray,
  },
});

worker.on('exit', (code) => {
  console.log(`[main] After sharedArray[0]: ${sharedArray[0]}`);
  console.log(`[main] worker exited with code ${code}`);
});

worker.on('error', (err) => {
  console.log(`[main] Error in worker`, err);
});
