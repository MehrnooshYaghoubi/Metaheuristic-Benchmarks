import { parentPort, workerData } from "worker_threads";
import { StandardPSO } from "./../PSO/pso.js";
import { meanAndVariance } from "./eval.js";
import {
  ackleyN2,
  bohachevskyN1,
  booth,
  sumOfSquares,
  sphere,
  brent,
  dropWave,
  matyas,
  schwefel220,
  schwefel221,
  schwefel222,
  schwefel223,
  Zakharov,
  brown,
  exponential,
  griewank,
  leon,
  powellSum,
  ridge,
  schafferN1,
  schafferN2,
  schafferN3,
  schafferN4,
  threeHumpCamel,
  trid,
  xinSheYangN3,
} from "./main.js";

// Map benchmark names to functions
const benchmarkMap = {
  bohachevskyN1,
  ackleyN2,
  sphere,
  brent,
  dropWave,
  matyas,
  schwefel220,
  bird,
  deckkersAarts,
  goldsteinPrice,
  happyCat,
  leviN13,
  salomon,
  wolfe,
};

import fs from "fs/promises"; // Make sure you import fs

// Get assigned benchmarks and thread ID
const { benchmarks, threadId } = workerData;
const mappedBenchmarks = benchmarks.map((name) => benchmarkMap[name]);

console.log(`Thread ${threadId} starting with algorithms:`, benchmarks);
const dataFilePath = "./data.json";
// File writing utility with retry mechanism for handling concurrent writes
async function appendToDataFile(data) {
  let existingData = [];
  let path = `data/${threadId}-data.json`;
  try {
    const fileContent = await fs.readFile(path, "utf8");
    const parsed = JSON.parse(fileContent);
    existingData = Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn(`Thread ${threadId} - Warning reading file:`, error.message);
    }
    existingData = [];
  }

  existingData.push(data);

  await fs.writeFile(path, JSON.stringify(existingData, null, 2));
  console.log(
    `Thread ${threadId} - Saved result for ${data.algorithm} to ${path}`
  );
}

async function runBenchmarks(list) {
  const results = {};
  for (let modal of list) {
    const modalResults = [];
    const startTime = Date.now();

    const runs = Array.from({ length: 20 }, (_, i) =>
      StandardPSO(
        50,
        30,
        -10,
        10,
        40000,
        modal,
        0.74,
        1.42,
        1.42,
        null,
        false
      ).then((res) => {
        modalResults.push(res.bestFitness);
        parentPort.postMessage({
          type: "run",
          modal: modal.name,
          run: i + 1,
          bestFitness: res.bestFitness,
          threadId: threadId,
        });
        return res;
      })
    );

    await Promise.all(runs);

    const endTime = Date.now();
    const executionTime = (endTime - startTime) / 1000;
    const stats = meanAndVariance(modalResults);

    results[modal.name] = stats;

    // Prepare data for JSON file
    const dataEntry = {
      algorithm: modal.name,
      threadId: threadId,
      timestamp: new Date().toISOString(),
      executionTime: executionTime,
      runs: 20,
      results: modalResults,
      statistics: {
        mean: stats.mean,
        variance: stats.variance,
      },
    };

    try {
      // Save to JSON file immediately after completing 20 runs
      await appendToDataFile(dataEntry);
    } catch (error) {
      console.error(
        `Thread ${threadId} - Failed to save ${modal.name} results:`,
        error.message
      );
      // Continue execution even if file write fails
    }

    parentPort.postMessage({
      type: "modal_done",
      modal: modal.name,
      stats: stats,
      threadId: threadId,
      savedToFile: true,
    });
  }
  return results;
}

runBenchmarks(mappedBenchmarks)
  .then((res) => {
    console.log(`Thread ${threadId} completed all benchmarks`);
    parentPort.postMessage({
      type: "done",
      results: res,
      threadId: threadId,
    });
  })
  .catch((err) => {
    console.error(`Thread ${threadId} error:`, err.message);
    parentPort.postMessage({
      type: "error",
      error: err.message,
      threadId: threadId,
    });
  });
