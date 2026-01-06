const { workerData } = require('node:worker_threads');

const sharedArray = workerData.sharedArray;
sharedArray[0] = 123;
