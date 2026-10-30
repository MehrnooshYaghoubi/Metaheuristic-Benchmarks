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
import { specFor } from "./problem-specs.js";

// Number of objective evaluations each algorithm is allowed per run. Both GA
// and PSO are held to the same budget so the comparison is meaningful.
const MAX_FITNESS_CALLS = 60000;
const RUNS_PER_BENCHMARK = 20;

// Get assigned benchmarks, thread ID and which algorithm to run.
const { benchmarks, threadId, algorithm = "PSO" } = workerData;
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
  let path = `data/${algorithm}-${threadId}-data.json`;
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

    const spec = specFor(modal.name);

    const runs = Array.from({ length: RUNS_PER_BENCHMARK }, (_, i) => {
      const report = (bestFitness) => {
        modalResults.push(bestFitness);
        parentPort.postMessage({
          type: "run",
          modal: modal.name,
          run: i + 1,
          bestFitness,
          threadId: threadId,
        });
        return bestFitness;
      };

      if (algo === "PSO") {
        return StandardPSO(
          50,
          spec.dimension,
          spec.lowerBound,
          spec.upperBound,
          MAX_FITNESS_CALLS,
          modal,
          0.74,
          1.42,
          1.42,
          null,
          false
        ).then((res) => report(res.bestFitness));
      }

      if (algo === "Genetic") {
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
          spec.dimension,
          spec.lowerBound,
          spec.upperBound,
          Infinity, // generations are bounded by the fitness-call budget
          0.01,
          10,
          60000,
          0.001,
          MAX_FITNESS_CALLS
        );

        return gen.runAlgorithm().then(() => report(gen.bestfit()));
      }

      return Promise.reject(new Error(`Unknown algorithm "${algo}"`));
    });

    await Promise.all(runs);

    const endTime = Date.now();
    const executionTime = (endTime - startTime) / 1000;
    const stats = meanAndVariance(modalResults);

    results[modal.name] = stats;

    // Prepare data for JSON file
    const dataEntry = {
      algorithm: modal.name,
      optimizer: algo,
      dimension: spec.dimension,
      lowerBound: spec.lowerBound,
      upperBound: spec.upperBound,
      globalMinimum: spec.globalMinimum,
      maxFitnessCalls: MAX_FITNESS_CALLS,
      threadId: threadId,
      timestamp: new Date().toISOString(),
      executionTime: executionTime,
      runs: RUNS_PER_BENCHMARK,
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
runBenchmarks(mappedBenchmarks, algorithm)
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
