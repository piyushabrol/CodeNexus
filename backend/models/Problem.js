const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  input: String,
  output: String
}, { _id: false });

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  constraints: String,
  inputFormat: String,
  outputFormat: String,

  sampleTestCases: [testCaseSchema],
  hiddenTestCases: [testCaseSchema],

  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
    index: true
  },

  tags: [{
    type: String,
    index: true
  }],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Problem", problemSchema);