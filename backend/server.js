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

app.use(cors({
  origin: process.env.CLIENT_URL,
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

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected...");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.log(err));