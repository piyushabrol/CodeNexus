const mongoose = require("mongoose");

const codeHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", index: true, required: true },
  language: { type: String, required: true },

  versionNumber: { type: Number, required: true },
  code: { type: String, required: true },

  createdAt: { type: Date, default: Date.now, index: true },
});

codeHistorySchema.index({ user: 1, problem: 1, language: 1, versionNumber: -1 });

module.exports = mongoose.model("CodeHistory", codeHistorySchema);