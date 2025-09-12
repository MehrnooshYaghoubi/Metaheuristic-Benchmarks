import { Worker } from "worker_threads";
import path from "path";

class ThreadManager {
  constructor(numberOfThreads, algorithms, workerPath) {
    this.numberOfThreads = numberOfThreads;
    this.algorithms = algorithms;
    this.workerPath = workerPath;
    this.workers = [];
    this.results = {};
    this.completedThreads = 0;
  }

  // Split algorithms into chunks for each thread
  createAlgorithmChunks() {
    const totalAlgos = this.algorithms.length;
    const chunkSize = Math.ceil(totalAlgos / this.numberOfThreads);
    const chunks = [];

    for (let i = 0; i < this.numberOfThreads; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, totalAlgos);

      if (start < totalAlgos) {
        chunks.push(this.algorithms.slice(start, end));
      }
    }

    return chunks;
  }

  // Create and start workers
  async startWorkers() {
    const chunks = this.createAlgorithmChunks();
    console.log(
      `Starting ${chunks.length} threads for ${this.algorithms.length} algorithms`
    );

    chunks.forEach((chunk, threadIndex) => {
      console.log(`Thread ${threadIndex + 1} will handle:`, chunk);
    });

    const promises = chunks.map((chunk, threadIndex) => {
      return new Promise((resolve, reject) => {
        const worker = new Worker(this.workerPath, {
          workerData: {
            benchmarks: chunk,
            threadId: threadIndex + 1,
          },
        });

        this.workers.push(worker);

        worker.on("message", (message) => {
          this.handleWorkerMessage(message, threadIndex, resolve);
        });

        worker.on("error", (error) => {
          console.error(`Thread ${threadIndex + 1} error:`, error);
          reject(error);
        });

        worker.on("exit", (code) => {
          if (code !== 0) {
            console.error(
              `Thread ${threadIndex + 1} stopped with exit code ${code}`
            );
          }
        });
      });
    });

    return Promise.all(promises);
  }

  handleWorkerMessage(message, threadIndex, resolve) {
    switch (message.type) {
      case "run":
        console.log(
          `Thread ${threadIndex + 1} - ${message.modal} run ${message.run}: ${
            message.bestFitness
          }`
        );
        break;

      case "modal_done":
        console.log(
          `Thread ${threadIndex + 1} - Completed ${message.modal}:`,
          message.stats
        );
        break;

      case "done":
        console.log(`Thread ${threadIndex + 1} - All benchmarks completed`);
        this.results[`thread_${threadIndex + 1}`] = message.results;
        this.completedThreads++;
        resolve(message.results);
        break;

      case "error":
        console.error(`Thread ${threadIndex + 1} error:`, message.error);
        break;
    }
  }

  // Clean up workers
  terminateWorkers() {
    this.workers.forEach((worker) => {
      worker.terminate();
    });
    this.workers = [];
  }

  // Get consolidated results
  getResults() {
    const consolidatedResults = {};
    Object.values(this.results).forEach((threadResults) => {
      Object.assign(consolidatedResults, threadResults);
    });
    return consolidatedResults;
  }
}

// Usage example
async function main() {
  // Your list of algorithms
  const algorithms = [
    "bohachevskyN1",
    "ackleyN2",
    "sphere",
    "brent",
    "dropWave",
    "matyas",
    "schwefel220",
    "bird",
    "deckkersAarts",
    "goldsteinPrice",
    "happyCat",
    "leviN13",
    "salomon",
    "wolfe",
  ];

  const numberOfThreads = 4; // Set your desired number of threads
  const workerPath = path.resolve("./worker.js"); // Path to your worker file
  const dataFilePath = "./data.json"; // Path where results will be saved

  const manager = new ThreadManager(
    numberOfThreads,
    algorithms,
    workerPath,
    dataFilePath
  );

  try {
    console.log("=== Starting Multi-threaded Benchmark ===");
    const startTime = Date.now();

    await manager.startWorkers();

    const endTime = Date.now();
    const executionTime = (endTime - startTime) / 1000;

    console.log("=== All Threads Completed ===");
    console.log(`Total execution time: ${executionTime.toFixed(2)} seconds`);
    console.log("\n=== Final Results ===");

    const finalResults = manager.getResults();
    Object.entries(finalResults).forEach(([algo, stats]) => {
      console.log(
        `${algo}: Mean=${stats.mean.toFixed(
          6
        )}, Variance=${stats.variance.toFixed(6)}`
      );
    });
  } catch (error) {
    console.error("Error running benchmarks:", error);
  } finally {
    manager.terminateWorkers();
    process.exit(0);
  }
}

main();

import { DataReader } from "./reader_utility.js"; // Update path if needed

async function runTest() {
  console.log("🚀 Starting Multi-Threading Test...\n");

  // Your existing algorithms list
  const algorithms = [
    "bohachevskyN1",
    "ackleyN2",
    "sphere",
    "brent",
    "dropWave",
    "matyas",
    "schwefel220",
    "bird",
    "deckkersAarts",
    "goldsteinPrice",
    "happyCat",
    "leviN13",
    "salomon",
    "wolfe",
  ];

  // Test configuration
  const numberOfThreads = 4; // Adjust as needed
  const workerPath = path.resolve("./worker.js"); // Path to your updated worker
  const dataFilePath = "./data.json"; // Output file

  // Create thread manager
  const manager = new ThreadManager(
    numberOfThreads,
    algorithms,
    workerPath,
    dataFilePath
  );

  // Optional: Start progress monitoring in parallel
  const reader = new DataReader(dataFilePath);
  const stopWatching = reader.watchProgress(3000); // Check every 3 seconds

  try {
    console.log(
      `📊 Running ${algorithms.length} algorithms across ${numberOfThreads} threads`
    );
    console.log(`💾 Results will be saved to: ${dataFilePath}\n`);

    const startTime = Date.now();

    // Start the workers
    await manager.startWorkers();

    const endTime = Date.now();
    const totalTime = (endTime - startTime) / 1000;

    // Stop progress monitoring
    stopWatching();

    console.log(
      `\n✅ All threads completed in ${totalTime.toFixed(2)} seconds`
    );

    // Generate final report
    console.log("\n📋 Generating final report...");
    await reader.generateReport();
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    stopWatching();
  } finally {
    manager.terminateWorkers();
    console.log("\n🔧 Cleaned up workers");
  }
}

// Run the test
// runTest().catch(console.error);

export { ThreadManager };
