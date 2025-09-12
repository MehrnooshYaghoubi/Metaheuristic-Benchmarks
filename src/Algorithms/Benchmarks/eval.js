export function meanAndVariance(vec) {
  const n = vec.length;
  if (n === 0) return { mean: NaN, variance: NaN };

  // Calculate mean
  const mean = vec.reduce((acc, x) => acc + x, 0) / n;

  // Calculate variance
  const variance = vec.reduce((acc, x) => acc + (x - mean) ** 2, 0) / n;

  return { mean, variance };
}

/**
 * Save a JavaScript object to a JSON file
 * @param {string} filePath - path to the JSON file
 * @param {object} obj - JavaScript object to save
 */
// export async function saveObjectToJSON(filePath, obj) {
//   try {
//     const jsonData = JSON.stringify(obj, null, 2); // pretty-print with 2-space indentation
//     await writeFile(filePath, jsonData, "utf-8");
//     console.log(`Object saved to ${filePath}`);
//   } catch (err) {
//     console.error("Error writing JSON file:", err);
//   }
// }
