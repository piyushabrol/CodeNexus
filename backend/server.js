require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const { protect } = require("./middleware/authMiddleware");
const { adminOnly } = require("./middleware/roleMiddleware");
const problemRoutes = require("./routes/problemRoutes");
const codeRoutes = require("./routes/codeRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const devRoutes = require("./routes/devRoutes");
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));
// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/dev", devRoutes);

// Rate limiter
app.use(rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW) * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX)
}));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Server Running 🚀" });
});

app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "You are authorized", user: req.user });
});

app.get("/api/admin-test", protect, adminOnly, (req, res) => {
  res.json({ message: "Welcome Admin 👑" });
});

// MongoDB Connect and server start
const startServer = async () => {
  let mongoUri = process.env.MONGO_URI;

  try {
    console.log("Attempting to connect to MongoDB Atlas...");
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("MongoDB Connected to Atlas...");
  } catch (err) {
    console.error("Could not connect to MongoDB Atlas:", err.message);
    console.log("Falling back to local in-memory MongoDB server...");

    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log(`Local Memory DB URI: ${mongoUri}`);
      
      await mongoose.connect(mongoUri);
      console.log("MongoDB Connected to local Memory Server...");
      
      // Auto-seed default problem
      const Problem = require("./models/Problem");
      const count = await Problem.countDocuments();
      if (count === 0) {
        console.log("Seeding default problem 'Sum of Two Numbers'...");
        await Problem.create({
          title: "Sum of Two Numbers",
          description: "Given two integers a and b, print a+b.",
          constraints: "1 <= a, b <= 10^9",
          inputFormat: "Two integers a and b separated by a single space.",
          outputFormat: "A single integer representing the sum of a and b.",
          difficulty: "Easy",
          tags: ["math", "basics"],
          sampleTestCases: [
            { input: "5 5", output: "10" },
            { input: "-3 7", output: "4" }
          ],
          hiddenTestCases: [
            { input: "2 3", output: "5" },
            { input: "10 20", output: "30" },
            { input: "100 200", output: "300" },
            { input: "-50 -50", output: "-100" }
          ]
        });
        console.log("Default problem seeded successfully!");
      }
    } catch (memDbErr) {
      console.error("Failed to spin up local Memory Server:", memDbErr);
      process.exit(1);
    }
  }

  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
};

startServer();