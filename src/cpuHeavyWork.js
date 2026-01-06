const performCPUHeavyWork = (payload) => {
  const BLOCK_DURATION = Math.floor(Math.random() * 1000);
  const startTime = Date.now();

  while (Date.now() - startTime < BLOCK_DURATION) {
    //
  }
};

module.exports = {
  performCPUHeavyWork,
};
