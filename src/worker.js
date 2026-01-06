const { workerData, threadId } = require('node:worker_threads');
const { performCPUHeavyWork } = require('./cpuHeavyWork.js');

const { sharedState, sharedQueue } = workerData;
const HEAD_INDEX = 0;
const TAIL_INDEX = 1;

// small artificial delay to increase the chance of interleaving
const delay = () => {
  const DELAY_DURATION = 50;
  const start = Date.now();
  while (Date.now() - start < 50) {
    //
  }
};

const processJobs = () => {
  while (true) {
    const head = Atomics.load(sharedState, HEAD_INDEX);
    const tail = Atomics.load(sharedState, TAIL_INDEX);

    if (head >= tail) {
      break;
    }

    // --- critical section starts ---
    const jobIndex = head;
    delay(); // adding delay to widen the window for interleaving
    Atomics.store(sharedState, HEAD_INDEX, jobIndex + 1);
    // --- critical section ends ---

    const jobId = Atomics.load(sharedQueue, jobIndex);

    if (jobId) {
      console.log(`[worker ${threadId}] Starting Job ${jobId}`);
      performCPUHeavyWork(`payload_${jobId}`);
      console.log(`[worker ${threadId}] Finished Job ${jobId}`);
    }
  }
};

processJobs();
