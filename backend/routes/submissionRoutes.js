const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Submission = require("../models/Submission");

// GET my submissions (optional: filter by problemId)
router.get("/me", protect, async (req, res) => {
  const { problemId } = req.query;

  const query = { user: req.user.id };
  if (problemId) query.problem = problemId;

  const subs = await Submission.find(query)
    .sort({ createdAt: -1 })
    .limit(50);

  res.json(subs);
});

module.exports = router;