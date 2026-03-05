const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", index: true, required: true },

  language: { type: String, required: true },
  code: { type: String, required: true },

  status: { type: String, enum: ["Accepted", "Wrong Answer", "TLE", "CE", "RE"], required: true },
  executionTimeMs: { type: Number, default: 0 },
  memoryKb: { type: Number, default: null },

  createdAt: { type: Date, default: Date.now, index: true },
});

submissionSchema.index({ user: 1, problem: 1, createdAt: -1 });

module.exports = mongoose.model("Submission", submissionSchema);