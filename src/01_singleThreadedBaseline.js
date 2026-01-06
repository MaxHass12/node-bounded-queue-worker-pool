class Job {
  constructor(id, payload) {
    this.id = id;
    this.payload = payload;
  }
}

const performCpuHeavyWork = (payload) => {
  console.log(`[WORK] processing payload: ${payload}`);

  const BLOCK_DURATION = 1000;
  const startTime = Date.now();

  while (Date.now() - startTime < BLOCK_DURATION) {
    // blocking code
  }
};

const jobQueue = [];
const NUM_JOBS_FOR_QUEUE = 5;

console.log('--- Phase 1: Single-Thread Baseline ---');

for (let i = 1; i <= NUM_JOBS_FOR_QUEUE; i++) {
  const newJob = new Job(i, `task_data_${i}`);
  jobQueue.push(newJob);
  console.log(
    `[QUEUE] Added job ${newJob.id}. Queue depth: ${jobQueue.length}`
  );
}

console.log('\n--- Starting Sequential Job Execution --- ');

while (jobQueue.length > 0) {
  const currentJob = jobQueue.shift();
  console.log(
    `[EXEC] Starting Job ${currentJob.id}. Queue Depth: ${jobQueue.length}`
  );
  performCpuHeavyWork(currentJob.payload);
  console.log(`[EXEC] Finished Job ${currentJob.id}`);
}

console.log('\n--- End Sequential Job Execution --- ');
