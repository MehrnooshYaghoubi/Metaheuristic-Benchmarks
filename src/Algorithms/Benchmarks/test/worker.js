// worker.js
import { parentPort, workerData } from "worker_threads";
import { StandardPSO } from "../../PSO/pso.js";
import { Genetic } from "../../Genetic Algorithm/main.js";
import {
  ackleyN4,
  adjiman,
  alpineN1,
  alpineN2,
  brent,
  brown,
  carromTable,
  deckkersAarts,
  easom,
  elAttarVidyasagarDutta,
  forrester,
  goldsteinPrice,
  gramacyLee,
  holderTable,
  mccormick,
  periodic,
  powellSum,
  quartic,
  rastrigin,
  ridge,
  rosenbrock,
  schafferN1,
  schwefel,
  schwefel220,
  schwefel222,
  shubert,
  shubert3,
  shubertN4,
  styblinskiTank,
  trid,
  wolfe,
  xinSheYang,
  Zakharov,
} from "./../main.js";

(async () => {
  let algo = 0;

  if (algo == 1) {
    const pso = await StandardPSO(
      500,
      10, //demension
      -10, //lower bound
      10, //upperbound
      200000,
      xinSheYang,
      0.74, // inertia
      1.42, //  cognitive
      1.42 //  social
    );
    parentPort.postMessage(pso.bestFitness);
  } else {
    const gen = new Genetic(
      100, // population
      0.05, // mutation rate
      0.8, // crossover rate,
      shubertN4,
      "BL-x", // crossover
      "Tournament",
      "Max Generations",
      "Real Number",
      "Gaussian Mutation",
      "Elitism",
      2, // gene length = 2
      -20, // lower bound
      20, // upper bound
      1000 // generations
    );

    await gen.runAlgorithm();
    const best = gen.bestfit();
    parentPort.postMessage(best);
  }
})();
