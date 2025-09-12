import fs from "fs/promises";
import path from "path";

class DataReader {
  constructor(dataFilePath = "./data.json") {
    this.dataFilePath = path.resolve(dataFilePath);
  }

  // Read all results from the data file
  async readResults() {
    try {
      const fileContent = await fs.readFile(this.dataFilePath, "utf8");
      return JSON.parse(fileContent);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log("Data file not found. No results yet.");
        return [];
      }
      throw error;
    }
  }

  // Get progress summary
  async getProgress() {
    const data = await this.readResults();
    const algorithms = [...new Set(data.map((entry) => entry.algorithm))];
    const completedAlgorithms = data.length;

    console.log(`Progress: ${completedAlgorithms} algorithm runs completed`);
    console.log("Completed algorithms:", algorithms);

    return {
      total: completedAlgorithms,
      algorithms: algorithms,
      data: data,
    };
  }

  // Watch file for changes (useful during execution)
  watchProgress(intervalMs = 2000) {
    console.log(`Watching ${this.dataFilePath} for updates...`);

    const interval = setInterval(async () => {
      try {
        const progress = await this.getProgress();
        console.log(
          `[${new Date().toLocaleTimeString()}] Current progress: ${
            progress.total
          } runs completed`
        );
      } catch (error) {
        console.error("Error reading progress:", error.message);
      }
    }, intervalMs);

    // Return function to stop watching
    return () => {
      clearInterval(interval);
      console.log("Stopped watching file.");
    };
  }

  // Generate summary report
  async generateReport() {
    const data = await this.readResults();

    if (data.length === 0) {
      console.log("No data available for report.");
      return;
    }

    console.log("\n=== EXECUTION REPORT ===");
    console.log(`Total algorithm runs: ${data.length}`);
    console.log(`Data file: ${this.dataFilePath}`);

    // Group by algorithm
    const byAlgorithm = data.reduce((acc, entry) => {
      if (!acc[entry.algorithm]) {
        acc[entry.algorithm] = [];
      }
      acc[entry.algorithm].push(entry);
      return acc;
    }, {});

    console.log("\n=== RESULTS BY ALGORITHM ===");
    Object.entries(byAlgorithm).forEach(([algorithm, entries]) => {
      const entry = entries[0]; // Should only be one entry per algorithm
      console.log(`\n${algorithm}:`);
      console.log(`  Thread: ${entry.threadId}`);
      console.log(`  Execution Time: ${entry.executionTime.toFixed(2)}s`);
      console.log(`  Mean Fitness: ${entry.statistics.mean.toFixed(6)}`);
      console.log(`  Variance: ${entry.statistics.variance.toFixed(6)}`);
      console.log(`  Best Run: ${Math.min(...entry.results).toFixed(6)}`);
      console.log(`  Worst Run: ${Math.max(...entry.results).toFixed(6)}`);
    });

    // Thread summary
    const byThread = data.reduce((acc, entry) => {
      if (!acc[entry.threadId]) {
        acc[entry.threadId] = [];
      }
      acc[entry.threadId].push(entry);
      return acc;
    }, {});

    console.log("\n=== THREAD SUMMARY ===");
    Object.entries(byThread).forEach(([threadId, entries]) => {
      const totalTime = entries.reduce(
        (sum, entry) => sum + entry.executionTime,
        0
      );
      console.log(
        `Thread ${threadId}: ${entries.length} algorithms, ${totalTime.toFixed(
          2
        )}s total`
      );
    });

    return {
      totalRuns: data.length,
      byAlgorithm,
      byThread,
      data,
    };
  }
}

// Usage examples
async function main() {
  const reader = new DataReader("./data.json");

  // Generate report
  await reader.generateReport();

  // Or watch progress (uncomment to use)
  // const stopWatching = reader.watchProgress(1000);
  // setTimeout(stopWatching, 30000); // Stop after 30 seconds
}

// Export for use in other files
export { DataReader };

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
