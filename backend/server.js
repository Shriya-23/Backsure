const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Folders
const uploadDir = path.join(__dirname, "uploads");
const outputDir = path.join(__dirname, "output");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// POST /analyze
app.post("/analyze", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  if (!req.file.originalname.toLowerCase().endsWith(".csv"))
    return res.status(400).json({ error: "Please upload a CSV file only." });

  const filePath = path.join(uploadDir, req.file.filename);
  const pyScript = path.join(__dirname, "analyze_backup.py");
  const pyExec = path.join(__dirname, ".venv", "Scripts", "python.exe");

  console.log("🔹 Running analysis...", filePath);

  const python = spawn(pyExec, [pyScript, filePath]);

  let dataBuffer = "";
  python.stdout.on("data", (data) => (dataBuffer += data.toString()));
  python.stderr.on("data", (data) => console.error(`stderr: ${data}`));

  python.on("close", (code) => {
    console.log(`Python exited with code ${code}`);
    try {
      const result = JSON.parse(dataBuffer);
      res.json(result);
    } catch (e) {
      console.error("Failed to parse Python output", e);
      res.status(500).json({ error: "Analysis failed. Check backend logs." });
    }
  });
});

app.listen(PORT, () => console.log(`✅ Backend running at http://localhost:${PORT}`));

