const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");
const Problem = require("../models/Problem");

router.post("/seed", protect, adminOnly, async (req, res) => {
  await Problem.create({
    title: "Sum of Two Numbers",
    description: "Given two integers a and b, print a+b.",
    constraints: "1 <= a,b <= 10^9",
    inputFormat: "Two integers a and b",
    outputFormat: "Single integer a+b",
    difficulty: "Easy",
    tags: ["math"],
    sampleTestCases: [{ input: "5 5", output: "10" }],
    hiddenTestCases: [{ input: "2 3", output: "5" }, { input: "10 20", output: "30" }],
  });

  res.json({ message: "Seeded ✅" });
});

module.exports = router;