// Import the Express library (used to build the web server)
const express = require("express");

// Create an Express application instance
const app = express();

// Middleware: tells Express to automatically parse incoming JSON bodies
// e.g. so req.body works when client sends { "features": [[1,2,3]] }
app.use(express.json());

/**
 * Helper function to validate input:
 * Checks that the value is a 2D array of numbers.
 * Example of valid input: [[1,2,3], [4,5,6]]
 */
function is2DNumberArray(x) {
  return Array.isArray(x) && 
         x.every(row => Array.isArray(row) && row.every(n => typeof n === "number"));
}

/* -----------------------------
   SYNC PREDICTION ENDPOINT
   POST /predict
   - Expects JSON body with "features" (2D array)
   - Immediately returns 200 OK with predictions
   - Demo: one prediction per row, always zero
-------------------------------- */
app.post("/predict", (req, res) => {
  // Extract the "features" array from request body
  const feats = req.body?.features;

  // Validate input
  if (!is2DNumberArray(feats)) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  // Fake predictions: one zero per row
  const predictions = Array(feats.length).fill(0);

  // Send response with predictions, model version, and row count
  return res.status(200).json({ 
    predictions, 
    model_version: "demo-1.0", 
    count: predictions.length 
  });
});

/* -----------------------------
   ASYNC PREDICTION ENDPOINTS
   - POST /predict-async
     * Starts a "job" and returns 202 Accepted
     * Client polls /jobs/:id for result
   - GET /jobs/:id
     * Returns job status or result
-------------------------------- */

// In-memory "job queue" (reset every time server restarts)
const jobs = {};

// Polling endpoint: check status/result of a job
app.get("/jobs/:id", (req, res) => {
  const job = jobs[req.params.id]; // Look up job by ID
  if (!job) return res.status(404).json({ status: "unknown" }); // If not found, 404
  return res.json(job); // Otherwise, return job info
});

// Endpoint to create a new async prediction job
app.post("/predict-async", (req, res) => {
  const feats = req.body?.features;

  // Validate input early
  if (!is2DNumberArray(feats)) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  // Generate a random job ID
  const id = Math.random().toString(36).slice(2, 10);

  // Mark job as "queued"
  jobs[id] = { status: "queued" };

  // Simulate async ML work with a 3-second delay
  setTimeout(() => {
    // Fake predictions: one "42" per row
    const predictions = Array(feats.length).fill(42);

    // Update job to "succeeded" with result data
    jobs[id] = { 
      status: "succeeded", 
      result: { 
        predictions, 
        model_version: "demo-1.0", 
        count: predictions.length 
      } 
    };
  }, 3000);

  // Respond with 202 Accepted + Location header for polling
  res.status(202)
     .set("Location", `http://localhost:3000/jobs/${id}`)
     .json({ job_id: id, status_url: `/jobs/${id}` });
});

// Port configuration: use env var PORT if provided, else default to 3000
const PORT = process.env.PORT || 3000;

// Start the server, listening on all network interfaces (0.0.0.0)
app.listen(PORT, "0.0.0.0", () => 
  console.log(`Listening on http://localhost:${PORT}`)
);
