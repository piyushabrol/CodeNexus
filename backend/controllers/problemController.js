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
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "40", 10), 1), 100);

    const { difficulty, tag, search } = req.query;

    const query = {};
    if (difficulty) query.difficulty = difficulty;
    if (tag) query.tags = tag; // exact match for tag
    if (search) query.title = { $regex: search, $options: "i" };

    const skip = (page - 1) * limit;

    const [problems, total] = await Promise.all([
      Problem.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Problem.countDocuments(query),
    ]);

    res.json({
      items: problems,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
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