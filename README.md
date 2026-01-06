## Node Bounded Queue Concurrency Lab

A minimal project to learn **multithreading and shared-memory concurrency in Node.js**.

- Uses `worker_threads`, `SharedArrayBuffer`, and `Atomics`
- Implements a **bounded producer–consumer queue**
- Fixed-size **worker thread pool**
- Explicit mutexes and condition variables
- Demonstrates race conditions, memory visibility, and lost wakeups
- Enforces backpressure via bounded queues
- Includes graceful shutdown logic
