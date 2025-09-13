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
    "ackleyN2",
    "bohachevskyN1",
    "booth",
    "sumOfSquares",
    "sphere",
    "brent",
    "dropWave",
    "matyas",
    "schwefel220",
    "schwefel221",
    "schwefel222",
    "schwefel223",
    "Zakharov",
    "brown",
    "exponential",
    "griewank",
    "leon",
    "powellSum",
    "ridge",
    "schafferN1",
    "schafferN2",
    "schafferN3",
    "schafferN4",
    "threeHumpCamel",
    "trid",
    "xinSheYangN3",
    "ackley",
    "ackleyN3",
    "ackleyN4",
    "adjiman",
    "alpineN1",
    "alpineN2",
    "bartelsConn",
    "beale",
    "bohachevskyN2",
    "bukinN6",
    "bird",
    "deckkersAarts",
    "goldsteinPrice",
    "happyCat",
    "leviN13",
    "salomon",
    "wolfe",
    "carromTable",
    "crossInTray",
    "easom",
    "eggCrate",
    "elAttarVidyasagarDutta",
    "forrester",
    "gramacyLee",
    "himmelblau",
    "holderTable",
    "keane",
    "mccormick",
    "periodic",
    "qing",
    "quartic",
    "rastrigin",
    "rosenbrock",
    "schwefel",
    "shubert3",
    "shubertN4",
    "shubert",
    "styblinskiTank",
    "xinSheYang",
    "xinSheYangN2",
    "xinSheYangN4",
  ];

  const numberOfThreads = 8; // Set your desired number of threads
  const workerPath = path.resolve("./worker.js"); // Path to your worker file

  const manager = new ThreadManager(numberOfThreads, algorithms, workerPath);

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

// Run the test
// runTest().catch(console.error);

export { ThreadManager };
