const { log } = require('node:console');
const { Worker } = require('node:worker_threads');

const NUM_JOBS = 10;
const NUM_THREADS = 4;

class Job {
  constructor(id, payload) {
    this.id = id;
    this.payload = payload;
  }
}

const logMessage = (msg) => console.log(`[main] ${msg}`);

const jobs = [];
for (let i = 1; i <= NUM_JOBS; i++) {
  jobs.push(new Job(i, `task_data_${i}`));
}

const sharedBuffer = new SharedArrayBuffer(2 * Uint32Array.BYTES_PER_ELEMENT);
const sharedState = new Uint32Array(sharedBuffer);

sharedState[0] = 0; // head of the queue
sharedState[1] = jobs.length; // tail of the queue

logMessage(`main created ${NUM_JOBS} jobs`);
logMessage(`spawning ${NUM_THREADS} threads... \n`);

let numActiveWorkers = 0;
for (let i = 0; i < NUM_THREADS; i++) {
  const worker = new Worker('./src/worker.js', {
    workerData: {
      sharedState,
      jobs,
    },
  });
  numActiveWorkers++;

  worker.on('exit', (code) => {
    numActiveWorkers--;
    logMessage(`Worker ${i} exited with code ${code}`);

    if (numActiveWorkers === 0) {
      logMessage('\n All threads finished');
      const jobsMissing = NUM_JOBS - sharedState[0];
      logMessage(`Jobs missing: ${jobsMissing}`);
    }
  });
}
