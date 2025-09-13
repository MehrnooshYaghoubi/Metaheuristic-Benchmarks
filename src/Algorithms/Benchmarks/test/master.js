// main.js
import { Worker } from "worker_threads";
import { meanAndVariance } from "./../eval.js";

async function runWorker(i) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./worker.js", { workerData: i });
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with code ${code}`));
    });
  });
}

async function test() {
  console.log("Running 20 GA workers in parallel...");
  const runs = Array.from({ length: 20 }, (_, i) => runWorker(i));
  const results = await Promise.all(runs);
  console.log("Results:", results);
  const m = meanAndVariance(results);
  console.log(m);
}

test();
