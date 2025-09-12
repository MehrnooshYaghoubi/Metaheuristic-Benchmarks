// unimodals

export function ackleyN2(vec) {
  const [x, y] = vec; // destructure array
  return -200 * Math.exp(-0.2 * Math.sqrt(x * x + y * y));
}

export function bohachevskyN1(vec) {
  const [x, y] = vec; // only 2D version
  return (
    x * x +
    2 * y * y -
    0.3 * Math.cos(3 * Math.PI * x) -
    0.4 * Math.cos(4 * Math.PI * y) +
    0.7
  );
}

export function booth(vec) {
  const [x, y] = vec; // 2D only
  return (x + 2 * y - 7) ** 2 + (2 * x + y - 5) ** 2;
}

export function sumOfSquares(x) {
  return x.reduce((acc, xi) => acc + xi * xi, 0);
}

export function sphere(vec) {
  return vec.reduce((acc, xi) => acc + xi * xi, 0);
}

export function brent(vec) {
  const [x, y] = vec; // 2D only
  return (x + 10) * (x + 10) + (y + 10) * (y + 10) + Math.exp(-x * x - y);
}

export function dropWave(vec) {
  const [x, y] = vec; // 2D only
  const r2 = x * x + y * y;
  return -1 + Math.cos(12 * Math.sqrt(r2)) / (0.5 * r2 + 2);
}

export function matyas(vec) {
  const [x, y] = vec; // 2D only
  return 0.26 * (x * x + y * y) - 0.48 * x * y;
}

export function schwefel220(vec) {
  return vec.reduce((acc, xi) => acc + Math.abs(xi), 0);
}

export function schwefel221(vec) {
  return Math.max(...vec.map(xi => Math.abs(xi)));
}

export function schwefel222(vec) {
  const sum = vec.reduce((acc, xi) => acc + Math.abs(xi), 0);
  const product = vec.reduce((acc, xi) => acc * Math.abs(xi), 1);
  return sum + product;
}

export function schwefel223(vec) {
  return vec.reduce((acc, xi) => acc + xi ** 10, 0);
}


export function Zakharov(vec) {
  const n = vec.length;

  const sumOfSquares = vec.reduce((acc, xi) => acc + xi ** 2, 0);
  const weightedSum = vec.reduce((acc, xi, i) => acc + 0.5 * (i + 1) * xi, 0);

  return sumOfSquares + weightedSum ** 2 + weightedSum ** 4;
}

export function brown(vec) {
  const n = vec.length;
  let sum = 0;

  for (let i = 0; i < n - 1; i++) {
    const xi = vec[i];
    const xi1 = vec[i + 1];
    sum += Math.pow(xi ** 2, xi1 ** 2 + 1) + Math.pow(xi1 ** 2, xi ** 2 + 1);
  }

  return sum;
}

export function exponential(vec) {
  const sumOfSquares = vec.reduce((acc, xi) => acc + xi ** 2, 0);
  return -Math.exp(-0.5 * sumOfSquares);
}

export function griewank(vec) {
  const n = vec.length;

  const sum = vec.reduce((acc, xi) => acc + xi ** 2 / 4000, 0);
  const product = vec.reduce((acc, xi, i) => acc * Math.cos(xi / Math.sqrt(i + 1)), 1);

  return 1 + sum - product;
}

export function leon(vec) {
  const [x, y] = vec; // 2D only
  return 100 * (y - x ** 3) ** 2 + (1 - x) ** 2;
}

export function powellSum(vec) {
  return vec.reduce((acc, xi, i) => acc + Math.abs(xi) ** (i + 2), 0);
}

export function ridge(vec, d = 1, alpha = 0.5) {
  const x1 = vec[0];
  const sumOfSquares = vec.slice(1).reduce((acc, xi) => acc + xi ** 2, 0);
  return x1 + d * Math.pow(sumOfSquares, alpha);
}

export function schafferN1(vec) {
  const [x, y] = vec; // 2D only
  const r2 = x ** 2 + y ** 2;
  return 0.5 + (Math.sin(r2) ** 2 - 0.5) / (1 + 0.001 * r2) ** 2;
}

export function schafferN2(vec) {
  const [x, y] = vec; // 2D only
  const r2 = x ** 2 + y ** 2;
  return 0.5 + (Math.sin(x ** 2 - y ** 2) ** 2 - 0.5) / (1 + 0.001 * r2) ** 2;
}

export function schafferN3(vec) {
  const [x, y] = vec; // 2D only
  const r2 = x ** 2 + y ** 2;
  return 0.5 + (Math.sin(Math.cos(Math.abs(x ** 2 - y ** 2))) ** 2 - 0.5) / (1 + 0.001 * r2) ** 2;
}

export function schafferN4(vec) {
  const [x, y] = vec; // 2D only
  const r2 = x ** 2 + y ** 2;
  return 0.5 + (Math.cos(Math.sin(Math.abs(x ** 2 - y ** 2))) ** 2 - 0.5) / (1 + 0.001 * r2) ** 2;
}

export function threeHumpCamel(vec) {
  const [x, y] = vec; // 2D only
  return 2 * x ** 2 - 1.05 * x ** 4 + (x ** 6) / 6 + x * y + y ** 2;
}

// Multimodal

export function ackley(vec, a = 20, b = 0.2, c = 2 * Math.PI) {
  const n = vec.length;
  const sumOfSquares = vec.reduce((acc, xi) => acc + xi ** 2, 0);
  const sumOfCos = vec.reduce((acc, xi) => acc + Math.cos(c * xi), 0);

  return (
    -a * Math.exp(-b * Math.sqrt(sumOfSquares / n)) -
    Math.exp(sumOfCos / n) +
    a +
    Math.exp(1)
  );
}

export function ackleyN3(vec) {
  const [x, y] = vec; // 2D only
  return (
    -200 * Math.exp(-0.2 * Math.sqrt(x ** 2 + y ** 2)) +
    5 * Math.exp(Math.cos(3 * x) + Math.sin(3 * y))
  );
}

export function ackleyN4(vec) {
  const n = vec.length;
  let sum = 0;

  for (let i = 0; i < n - 1; i++) {
    const xi = vec[i];
    const xi1 = vec[i + 1];
    sum +=
      Math.exp(-0.2) * Math.sqrt(xi ** 2 + xi1 ** 2) +
      3 * (Math.cos(2 * xi) + Math.sin(2 * xi1));
  }

  return sum;
}

export function adjiman(vec) {
  const [x, y] = vec; // 2D only
  return Math.cos(x) * Math.sin(y) - x / (y ** 2 + 1);
}

export function alpineN1(vec) {
  return vec.reduce((acc, xi) => acc + Math.abs(xi * Math.sin(xi) + 0.1 * xi), 0);
}

export function alpineN2(vec) {
  return vec.reduce((acc, xi) => acc * Math.sqrt(xi) * Math.sin(xi), 1);
}

export function bartelsConn(vec) {
  const [x, y] = vec; // 2D only
  return (
    Math.abs(x ** 2 + y ** 2 + x * y) +
    Math.abs(Math.sin(x)) +
    Math.abs(Math.cos(y))
  );
}

export function beale(vec) {
  const [x, y] = vec; // 2D only
  return (
    (1.5 - x + x * y) ** 2 +
    (2.25 - x + x * y ** 2) ** 2 +
    (2.625 - x + x * y ** 3) ** 2
  );
}

export function bohachevskyN2(vec) {
  const [x, y] = vec; // 2D only
  return (
    x ** 2 +
    2 * y ** 2 -
    0.3 * Math.cos(3 * Math.PI * x) * Math.cos(4 * Math.PI * y) +
    0.3
  );
}

export function bukinN6(vec) {
  const [x, y] = vec; // 2D only
  return 100 * Math.sqrt(Math.abs(y - 0.01 * x ** 2)) + 0.01 * Math.abs(x + 10);
}

export function bird(vec) {
  const [x, y] = vec; // 2D only
  return (
    Math.sin(x) * Math.exp((1 - Math.cos(y)) ** 2) +
    Math.cos(y) * Math.exp((1 - Math.sin(x)) ** 2) +
    (x - y) ** 2
  );
}
export function deckkersAarts(vec) {
  const [x, y] = vec; // 2D only
  const r2 = x * x + y * y;
  return 105 * x * x + y * y - r2 * r2 + 10 - 5 * r2 ** 4;
}

export function goldsteinPrice(vec) {
  const [x, y] = vec; // 2D only

  const part1 =
    1 +
    (x + y + 1) ** 2 *
      (19 - 14 * x + 3 * x ** 2 - 14 * y + 6 * x * y + 3 * y ** 2);
  const part2 =
    30 +
    (2 * x - 3 * y) ** 2 *
      (18 - 32 * x + 12 * x ** 2 + 4 * y - 36 * x * y + 27 * y ** 2);

  return part1 * part2;
}

export function happyCat(vec, alpha = 0.25) {
  const n = vec.length;
  const norm2 = vec.reduce((acc, xi) => acc + xi * xi, 0);
  const sum = vec.reduce((acc, xi) => acc + xi, 0);

  return Math.pow(norm2 - n, alpha) + (1 / n) * (0.5 * norm2 + sum) + 0.5;
}

export function leviN13(vec) {
  const [x, y] = vec; // 2D only

  return (
    Math.sin(3 * Math.PI * x) ** 2 +
    (x - 1) ** 2 * (1 + Math.sin(3 * Math.PI * y) ** 2) +
    (y - 1) ** 2 * (1 + Math.sin(2 * Math.PI * y) ** 2)
  );
}

export function salomon(vec) {
  const norm = Math.sqrt(vec.reduce((acc, xi) => acc + xi * xi, 0));
  return 1 - Math.cos(2 * Math.PI * norm) + 0.1 * norm;
}

export function wolfe(vec) {
  const [x, y, z] = vec; // 3D only
  return 43 * Math.pow(x * x + y * y - x * y, 0.75) + z;
}
