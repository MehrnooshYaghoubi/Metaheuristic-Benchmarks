// Per-benchmark problem definitions: the dimensionality and input domain that
// each function is actually defined on, taken from functions.json.
//
// The sweep previously ran every function at 30 dimensions on [-10, 10]. That
// is wrong in two ways: 2-D functions such as booth or goldsteinPrice ignore
// genes 2..29 entirely, and functions whose domain is not [-10, 10] (schwefel,
// gramacyLee, goldsteinPrice, bukinN6, ...) were optimised over the wrong box,
// so the reported optima were not comparable to published values.

// Dimension used for the n-dimensional (scalable) benchmarks.
export const DEFAULT_DIMENSION = 30;

export const PROBLEM_SPECS = {
  ackleyN2: { dimension: 2, lowerBound: -32, upperBound: 32, globalMinimum: "-200" },
  bohachevskyN1: { dimension: 2, lowerBound: -100, upperBound: 100, globalMinimum: "0" },
  booth: { dimension: 2, lowerBound: -10, upperBound: 10, globalMinimum: "0" },
  sumOfSquares: { dimension: DEFAULT_DIMENSION, lowerBound: -10, upperBound: 10, globalMinimum: "0" },
  sphere: { dimension: DEFAULT_DIMENSION, lowerBound: -5.12, upperBound: 5.12, globalMinimum: "0" },
  brent: { dimension: 2, lowerBound: -20, upperBound: 0, globalMinimum: "0" },
  dropWave: { dimension: 2, lowerBound: -5.2, upperBound: 5.2, globalMinimum: "-1" },
  matyas: { dimension: 2, lowerBound: -10, upperBound: 10, globalMinimum: "0" },
  schwefel220: { dimension: DEFAULT_DIMENSION, lowerBound: -100, upperBound: 100, globalMinimum: "0" },
  schwefel221: { dimension: DEFAULT_DIMENSION, lowerBound: -100, upperBound: 100, globalMinimum: "0" },
  schwefel222: { dimension: DEFAULT_DIMENSION, lowerBound: -100, upperBound: 100, globalMinimum: "0" },
  schwefel223: { dimension: DEFAULT_DIMENSION, lowerBound: -10, upperBound: 10, globalMinimum: "0" },
  Zakharov: { dimension: DEFAULT_DIMENSION, lowerBound: -5, upperBound: 10, globalMinimum: "0" },
  brown: { dimension: DEFAULT_DIMENSION, lowerBound: -1, upperBound: 4, globalMinimum: "0" },
  exponential: { dimension: DEFAULT_DIMENSION, lowerBound: -1, upperBound: 1, globalMinimum: "-1" },
  griewank: { dimension: DEFAULT_DIMENSION, lowerBound: -600, upperBound: 600, globalMinimum: "0" },
  leon: { dimension: 2, lowerBound: 0, upperBound: 10, globalMinimum: "0" },
  powellSum: { dimension: DEFAULT_DIMENSION, lowerBound: -1, upperBound: 1, globalMinimum: "0" },
  ridge: { dimension: DEFAULT_DIMENSION, lowerBound: -5, upperBound: 5, globalMinimum: "-5" },
  schafferN1: { dimension: 2, lowerBound: -100, upperBound: 100, globalMinimum: "0" },
  schafferN2: { dimension: 2, lowerBound: -100, upperBound: 100, globalMinimum: "0.0" },
  schafferN3: { dimension: 2, lowerBound: -100, upperBound: 100, globalMinimum: "0.00156685" },
  schafferN4: { dimension: 2, lowerBound: -100, upperBound: 100, globalMinimum: "0.292579" },
  threeHumpCamel: { dimension: 2, lowerBound: -5, upperBound: 5, globalMinimum: "0" },
  trid: { dimension: DEFAULT_DIMENSION, lowerBound: -900, upperBound: 900, globalMinimum: "-\\frac{n(n+4)(n-1)}{6}" },
  xinSheYangN3: { dimension: DEFAULT_DIMENSION, lowerBound: -6.28318530718, upperBound: 6.28318530718, globalMinimum: "-1" },
  ackley: { dimension: DEFAULT_DIMENSION, lowerBound: -32, upperBound: 32, globalMinimum: "0" },
  ackleyN3: { dimension: 2, lowerBound: -32, upperBound: 32, globalMinimum: "-195.629028238419" },
  ackleyN4: { dimension: DEFAULT_DIMENSION, lowerBound: -35, upperBound: 35, globalMinimum: "-4.590101633799122" },
  adjiman: { dimension: 2, lowerBound: [-1,-1], upperBound: [2,1], globalMinimum: "-2.02181" },
  alpineN1: { dimension: DEFAULT_DIMENSION, lowerBound: 0, upperBound: 10, globalMinimum: "0" },
  alpineN2: { dimension: DEFAULT_DIMENSION, lowerBound: 0, upperBound: 10, globalMinimum: "2.808^n" },
  bartelsConn: { dimension: 2, lowerBound: -500, upperBound: 500, globalMinimum: "1" },
  beale: { dimension: 2, lowerBound: -4.5, upperBound: 4.5, globalMinimum: "0" },
  bohachevskyN2: { dimension: 2, lowerBound: -100, upperBound: 100, globalMinimum: "0" },
  bukinN6: { dimension: 2, lowerBound: [-15,-3], upperBound: [-5,3], globalMinimum: "0" },
  bird: { dimension: 2, lowerBound: -6.28318530718, upperBound: 6.28318530718, globalMinimum: "-106.764537" },
  deckkersAarts: { dimension: 2, lowerBound: -20, upperBound: 20, globalMinimum: "-24771.09375" },
  goldsteinPrice: { dimension: 2, lowerBound: -2, upperBound: 2, globalMinimum: "3" },
  happyCat: { dimension: DEFAULT_DIMENSION, lowerBound: -2, upperBound: 2, globalMinimum: "0" },
  leviN13: { dimension: 2, lowerBound: -10, upperBound: 10, globalMinimum: "0" },
  salomon: { dimension: DEFAULT_DIMENSION, lowerBound: -100, upperBound: 100, globalMinimum: "0" },
  wolfe: { dimension: 3, lowerBound: 0, upperBound: 2, globalMinimum: "0" },
  carromTable: { dimension: 2, lowerBound: -10, upperBound: 10, globalMinimum: "-24.15681551650653" },
  crossInTray: { dimension: 2, lowerBound: -10, upperBound: 10, globalMinimum: "-2.06261218" },
  easom: { dimension: 2, lowerBound: -100, upperBound: 100, globalMinimum: "-1" },
  eggCrate: { dimension: 2, lowerBound: -5, upperBound: 5, globalMinimum: "0" },
  elAttarVidyasagarDutta: { dimension: 2, lowerBound: -500, upperBound: 500, globalMinimum: "0" },
  forrester: { dimension: 1, lowerBound: 0, upperBound: 1, globalMinimum: "-6.0207" },
  gramacyLee: { dimension: 1, lowerBound: 0.5, upperBound: 2.5, globalMinimum: "-0.869011134989500" },
  himmelblau: { dimension: 2, lowerBound: -6, upperBound: 6, globalMinimum: "0" },
  holderTable: { dimension: 2, lowerBound: -10, upperBound: 10, globalMinimum: "-19.2085" },
  keane: { dimension: 2, lowerBound: 0, upperBound: 10, globalMinimum: "-0.673667521146855" },
  mccormick: { dimension: 2, lowerBound: [-1.5,-3], upperBound: [4,3], globalMinimum: "-1.9133" },
  periodic: { dimension: DEFAULT_DIMENSION, lowerBound: -10, upperBound: 10, globalMinimum: "0.9" },
  qing: { dimension: DEFAULT_DIMENSION, lowerBound: -500, upperBound: 500, globalMinimum: "0" },
  quartic: { dimension: DEFAULT_DIMENSION, lowerBound: -1.28, upperBound: 1.28, globalMinimum: "0 + \\text{random noise}" },
  rastrigin: { dimension: DEFAULT_DIMENSION, lowerBound: -5.12, upperBound: 5.12, globalMinimum: "0" },
  rosenbrock: { dimension: DEFAULT_DIMENSION, lowerBound: -5, upperBound: 10, globalMinimum: "0" },
  schwefel: { dimension: DEFAULT_DIMENSION, lowerBound: -500, upperBound: 500, globalMinimum: "0" },
  shubert3: { dimension: DEFAULT_DIMENSION, lowerBound: -10, upperBound: 10, globalMinimum: "-29.6733337" },
  shubertN4: { dimension: DEFAULT_DIMENSION, lowerBound: -10, upperBound: 10, globalMinimum: "-25.740858" },
  shubert: { dimension: DEFAULT_DIMENSION, lowerBound: -10, upperBound: 10, globalMinimum: "-186.7309." },
  styblinskiTank: { dimension: DEFAULT_DIMENSION, lowerBound: -5, upperBound: 5, globalMinimum: "-39.16599n" },
  xinSheYang: { dimension: DEFAULT_DIMENSION, lowerBound: -5, upperBound: 5, globalMinimum: "0" },
  xinSheYangN2: { dimension: DEFAULT_DIMENSION, lowerBound: -6.28318530718, upperBound: 6.28318530718, globalMinimum: "0" },
  xinSheYangN4: { dimension: DEFAULT_DIMENSION, lowerBound: -10, upperBound: 10, globalMinimum: "-1" },
};

export function specFor(name) {
  const spec = PROBLEM_SPECS[name];
  if (!spec) {
    throw new Error(`No problem spec for benchmark "${name}"`);
  }
  return spec;
}
