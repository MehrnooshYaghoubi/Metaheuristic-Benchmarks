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
  ackley,
  ackleyN3,
  ackleyN4,
  adjiman,
  alpineN1,
  alpineN2,
  bartelsConn,
  beale,
  bohachevskyN2,
  bukinN6,
  bird,
  deckkersAarts,
  goldsteinPrice,
  happyCat,
  leviN13,
  salomon,
  wolfe,
  carromTable,
  crossInTray,
  easom,
  eggCrate,
  elAttarVidyasagarDutta,
  forrester,
  gramacyLee,
  himmelblau,
  holderTable,
  keane,
  mccormick,
  periodic,
  qing,
  quartic,
  rastrigin,
  rosenbrock,
  schwefel,
  shubert3,
  shubertN4,
  shubert,
  styblinskiTank,
  xinSheYang,
  xinSheYangN2,
  xinSheYangN4,
} from "./main.js";

// Map benchmark names to functions
const benchmarkMap = {
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
  ackley,
  ackleyN3,
  ackleyN4,
  adjiman,
  alpineN1,
  alpineN2,
  bartelsConn,
  beale,
  bohachevskyN2,
  bukinN6,
  bird,
  deckkersAarts,
  goldsteinPrice,
  happyCat,
  leviN13,
  salomon,
  wolfe,
  carromTable,
  crossInTray,
  easom,
  eggCrate,
  elAttarVidyasagarDutta,
  forrester,
  gramacyLee,
  himmelblau,
  holderTable,
  keane,
  mccormick,
  periodic,
  qing,
  quartic,
  rastrigin,
  rosenbrock,
  schwefel,
  shubert3,
  shubertN4,
  shubert,
  styblinskiTank,
  xinSheYang,
  xinSheYangN2,
  xinSheYangN4,
};

import fs from "fs/promises"; // Make sure you import fs
import { Genetic } from "../Genetic Algorithm/main.js";

// Get assigned benchmarks and thread ID
const { benchmarks, threadId } = workerData;
const mappedBenchmarks = benchmarks.map((name) => {
  const fn = benchmarkMap[name];
  if (!fn) {
    console.error(
      `Thread ${threadId} - Benchmark "${name}" is not defined in benchmarkMap`
    );
  }
  return fn;
});

console.log(`Thread ${threadId} starting with algorithms:`, benchmarks);
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

async function runBenchmarks(list, algo) {
  const results = {};
  for (let modal of list) {
    const modalResults = [];
    const startTime = Date.now();

    const runs = Array.from({ length: 20 }, (_, i) => {
      if (algo == "PSO") {
        return StandardPSO(
          50,
          30,
          -10,
          10,
          60000,
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
        });
      } else if (algo == "Genetic") {
        const gen = new Genetic(
          50,
          0.01,
          0.75,
          modal,
          "BL-x",
          "Roulette Wheel",
          "Max Generations",
          "Real Number",
          "Gaussian Mutation",
          "Elitism",
          30,
          -10,
          10,
          800
        );

        return gen.runAlgorithm().then(() => {
          let res = gen.bestfit();
          modalResults.push(res);
          parentPort.postMessage({
            type: "run",
            modal: modal.name,
            run: i + 1,
            bestFitness: res,
            threadId: threadId,
          });
          return res;
        });
      }
    });

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
runBenchmarks(mappedBenchmarks, "PSO")
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
