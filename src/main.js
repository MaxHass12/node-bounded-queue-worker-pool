const { Worker } = require('node:worker_threads');

const NUM_JOBS = 10;
const NUM_THREADS = 4;
const QUEUE_CAPACITY = NUM_JOBS;

// shared memory setup
// shared state contains the index of head and tail of the queue
const HEAD_INDEX = 0;
const TAIL_INDEX = 1;
const STATE_LENGTH = 2;

const sharedBuffer = new SharedArrayBuffer(2 * Uint32Array.BYTES_PER_ELEMENT);
const sharedState = new Uint32Array(sharedBuffer);

// We are also sharing the queue represented by array made of job ids
const sharedQueueBuffer = new SharedArrayBuffer(
  QUEUE_CAPACITY * Uint32Array.BYTES_PER_ELEMENT
);
const sharedQueue = new Uint32Array(sharedQueueBuffer);

// prefill the queue with job
console.log(`[main] creating and enquing ${NUM_JOBS} jobs...`);
for (let i = 0; i < NUM_JOBS; i++) {
  const jobId = i + 1;
  Atomics.store(sharedQueue, i, jobId);
  // is atomics even necessary here
}

// initialize sharedState
Atomics.store(sharedState, HEAD_INDEX, 0);
Atomics.store(sharedState, TAIL_INDEX, NUM_JOBS);

// create worker
console.log(`[main] spawning ${NUM_THREADS} workers...`);
let numActiveWorkers = NUM_THREADS;

for (let i = 1; i <= NUM_THREADS; i++) {
  const worker = new Worker('./src/worker.js', {
    workerData: {
      sharedState,
      sharedQueue,
    },
  });

  worker.on('exit', (code) => {
    numActiveWorkers--;
    console.log(
      `[main] Worker ${i} exited with code ${code}. Still active: ${numActiveWorkers}`
    );

    if (numActiveWorkers === 0) {
      console.log(`[main] All workers finished`)
    }
  });
}
