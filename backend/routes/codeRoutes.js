const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const Problem = require("../models/Problem");
const Submission = require("../models/Submission");
const CodeHistory = require("../models/CodeHistory");

const { execute } = require("../services/codeRunner");
const { normalizeOutput } = require("../utils/normalize");

router.post("/run", protect, async (req, res) => {
  const { problemId, language, code, stdin = "" } = req.body;

  const result = await execute({
    language,
    code,
    stdin,
    timeoutMs: Number(process.env.EXECUTION_TIMEOUT || 5000),
  });

  if (result.status === "TLE") {
    return res.json({
      status: "TLE",
      timeMs: result.timeMs,
      memoryKb: null,
      output: "Time Limit Exceeded",
    });
  }
  if (result.status === "CE") {
    return res.json({
      status: "CE",
      timeMs: result.timeMs,
      memoryKb: null,
      output: result.stderr || "Compile Error",
    });
  }
  if (result.status === "RE") {
    return res.json({
      status: "RE",
      timeMs: result.timeMs,
      memoryKb: null,
      output: result.stderr || result.stdout || "Runtime Error",
    });
  }

  return res.json({
    status: "OK",
    timeMs: result.timeMs,
    memoryKb: null,
    output: result.stdout || "",
  });
});

// ✅ SUBMIT = run hidden tests and save submission + history
router.post("/submit", protect, async (req, res) => {
  const { problemId, language, code } = req.body;

  const problem = await Problem.findById(problemId);
  if (!problem) return res.status(404).json({ message: "Problem not found" });

  const tests = problem.hiddenTestCases || [];
  if (tests.length === 0) {
    return res.status(400).json({ message: "No hidden test cases configured" });
  }

  let totalTime = 0;
  let status = "Accepted";
  let failAt = -1;
  let expected = "";
  let got = "";
  let errorText = "";

  for (let i = 0; i < tests.length; i++) {
    const t = tests[i];

    const result = await execute({
      language,
      code,
      stdin: t.input || "",
      timeoutMs: Number(process.env.EXECUTION_TIMEOUT || 5000),
    });

    totalTime += result.timeMs || 0;

    if (result.status === "TLE") {
      status = "TLE";
      failAt = i;
      errorText = "Time Limit Exceeded";
      break;
    }
    if (result.status === "CE") {
      status = "CE";
      failAt = i;
      errorText = result.stderr || "Compile Error";
      break;
    }
    if (result.status === "RE") {
      status = "RE";
      failAt = i;
      errorText = result.stderr || result.stdout || "Runtime Error";
      break;
    }

    const out = normalizeOutput(result.stdout || "");
    const exp = normalizeOutput(t.output || "");
    console.log("EXPECTED:", exp);
    console.log("GOT:", out);
    if (out !== exp) {
      status = "Wrong Answer";
      failAt = i;
      expected = exp;
      got = out;
      break;
    }
  }

  // ✅ Save submission
  const sub = await Submission.create({
    user: req.user.id,
    problem: problemId,
    language,
    code,
    status,
    executionTimeMs: totalTime,
    memoryKb: null,
  });

  // ✅ Save code history (version++)
  const last = await CodeHistory.findOne({
    user: req.user.id,
    problem: problemId,
    language,
  }).sort({ versionNumber: -1 });

  const nextVersion = last ? last.versionNumber + 1 : 1;

  await CodeHistory.create({
    user: req.user.id,
    problem: problemId,
    language,
    versionNumber: nextVersion,
    code,
  });

  if (status === "Accepted") {
    return res.json({
      status: "Accepted",
      score: 100,
      timeMs: totalTime,
      memoryKb: null,
      message: `All ${tests.length} test cases passed ✅`,
      submissionId: sub._id,
      version: nextVersion,
    });
  }

  // Failed
  return res.json({
    status,
    score: 0,
    timeMs: totalTime,
    memoryKb: null,
    message:
      status === "Wrong Answer"
        ? `Wrong Answer on test #${failAt + 1}`
        : `${status} on test #${failAt + 1}`,
    details:
      status === "Wrong Answer" ? { expected, got } : { error: errorText },
    submissionId: sub._id,
    version: nextVersion,
  });
});

module.exports = router;
