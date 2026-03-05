const Problem = require("../models/Problem");

// CREATE (Admin)
exports.createProblem = async (req, res) => {
  try {
    const problem = await Problem.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json(problem);
  } catch (error) {
    res.status(500).json({ message: "Error creating problem" });
  }
};

// GET ALL (with pagination + filters)
exports.getProblems = async (req, res) => {
  try {
    const { page = 1, difficulty, tag, search } = req.query;

    const query = {};

    if (difficulty) query.difficulty = difficulty;
    if (tag) query.tags = tag;
    if (search) query.title = { $regex: search, $options: "i" };

    const problems = await Problem.find(query)
      .skip((page - 1) * 10)
      .limit(10);

    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching problems" });
  }
};

// GET SINGLE
exports.getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem)
      return res.status(404).json({ message: "Problem not found" });

    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: "Error fetching problem" });
  }
};

// UPDATE (Admin)
exports.updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: "Error updating problem" });
  }
};

// DELETE (Admin)
exports.deleteProblem = async (req, res) => {
  try {
    await Problem.findByIdAndDelete(req.params.id);
    res.json({ message: "Problem deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting problem" });
  }
};