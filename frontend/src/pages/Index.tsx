import React, { useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Type for numeric stats
interface NumericStat {
  count: number;
  mean: number;
  min: number;
  max: number;
  sum: number;
}

// Type for categorical stats
interface CategoricalStat {
  count: number;
  unique: number;
  top: string | null;
  freq: number;
}

// Type for backend result (dynamic keys for CSV columns)
interface BackupResult {
  [column: string]: NumericStat | CategoricalStat | string | number[] | undefined;
  generated_at: string;
  predictions?: number[];
  predictions_error?: string;
}

const IndexPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<BackupResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    if (selectedFile && !selectedFile.name.toLowerCase().endsWith(".csv")) {
      setErrorMsg("❌ Only CSV files allowed");
      setFile(null);
      return;
    }
    setErrorMsg("");
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMsg("❌ Please select a CSV file");
      return;
    }

    setLoading(true);
    setResult(null);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to analyze file");

      const data: BackupResult = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      setErrorMsg("❌ Analysis failed! Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart dynamically for numeric columns
  const numericColumns = result
    ? Object.entries(result).filter(
        ([, value]) => typeof value === "object" && value !== null && "mean" in value
      ) as [string, NumericStat][]
    : [];

  const chartData = numericColumns.length
    ? {
        labels: numericColumns.map(([col]) => col),
        datasets: [
          {
            label: "Mean Values",
            data: numericColumns.map(([, col]) => col.mean),
            borderColor: "#00FF7F",
            backgroundColor: "#00FF7F55",
            tension: 0.4,
          },
        ],
      }
    : null;

  // Observations & prediction
  const observations = (): string[] => {
    if (!result) return [];
    const obs: string[] = [];

    numericColumns.forEach(([colName, col]) => {
      if (col.mean > 1000) obs.push(`⚠️ Column "${colName}" has unusually high mean.`);
    });

    if (result.predictions && result.predictions.length > 0) {
      const successRate =
        result.predictions.reduce((acc, val) => acc + val, 0) / result.predictions.length;
      if (successRate >= 0.5) obs.push("✅ Overall, backups are likely to succeed.");
      else obs.push("❌ Overall, backups might fail.");
    } else if (result.predictions_error) {
      obs.push(`⚠️ Prediction not possible: ${result.predictions_error}`);
    }

    return obs;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#001F3F] via-[#003366] to-[#004080] text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center space-y-6 w-full max-w-4xl"
      >
        {/* Typing Title */}
        <h1 className="text-6xl font-extrabold drop-shadow-lg">
          <TypeAnimation
            sequence={[
              "BackSure 💾",
              2000,
              "AI-Driven Backups ⚙️",
              2000,
              "Reliable. Predictive. Smart. 🚀",
              2000,
            ]}
            wrapper="span"
            speed={60}
            repeat={Infinity}
          />
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-200 max-w-2xl mx-auto">
          AI-Powered Backup Success Prediction — upload any CSV to forecast whether your
          next backup will <span className="text-green-400 font-semibold">succeed</span> or{" "}
          <span className="text-red-400 font-semibold">fail</span>.
        </p>

        {/* CSV Upload */}
        <div className="flex flex-col items-center gap-4 mt-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="p-2 rounded border border-white/30 bg-white/10 text-white hover:bg-white/20 transition-all"
          />
          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Upload & Analyze"}
          </button>
          {errorMsg && <span className="text-red-400 mt-1">{errorMsg}</span>}
        </div>

        {/* Results & Chart */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-8 p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg border border-white/20 text-left overflow-x-auto"
          >
            <h2 className="text-xl font-semibold text-green-300 mb-2">
              📊 Analysis Results
            </h2>
            <pre className="text-gray-200">{JSON.stringify(result, null, 2)}</pre>

            {/* Chart */}
            {chartData && (
              <div className="mt-6">
                <Line
                  data={chartData}
                  options={{ responsive: true, plugins: { legend: { position: "top" } } }}
                />
              </div>
            )}

            {/* Observations */}
            {observations().length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">🔍 Observations:</h3>
                <ul className="list-disc ml-6 text-gray-200">
                  {observations().map((obs, idx) => (
                    <li key={idx}>{obs}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default IndexPage;













