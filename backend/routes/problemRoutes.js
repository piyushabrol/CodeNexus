const express = require("express");
const router = express.Router();

const {
  createProblem,
  getProblems,
  getProblemById,
  updateProblem,
  deleteProblem
} = require("../controllers/problemController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

router.get("/", getProblems);
router.get("/:id", getProblemById);

router.post("/", protect, adminOnly, createProblem);
router.put("/:id", protect, adminOnly, updateProblem);
router.delete("/:id", protect, adminOnly, deleteProblem);
exports.getProblems = async (req, res) => {
  const problems = await Problem.find();
  res.json(problems);
};
module.exports = router;