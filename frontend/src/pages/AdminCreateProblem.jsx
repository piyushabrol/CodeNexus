import { useState } from "react";
import API from "../api/axios";

function AdminCreateProblem() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    constraints: "",
    inputFormat: "",
    outputFormat: "",
    difficulty: "Easy",
    tags: "",
    sampleInput: "",
    sampleOutput: "",
    hiddenInput: "",
    hiddenOutput: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      constraints: form.constraints,
      inputFormat: form.inputFormat,
      outputFormat: form.outputFormat,
      difficulty: form.difficulty,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      sampleTestCases: [{ input: form.sampleInput, output: form.sampleOutput }],
      hiddenTestCases: [{ input: form.hiddenInput, output: form.hiddenOutput }],
    };

    try {
      await API.post("/problems", payload);
      alert("Problem Created ✅");
      setForm({
        title: "",
        description: "",
        constraints: "",
        inputFormat: "",
        outputFormat: "",
        difficulty: "Easy",
        tags: "",
        sampleInput: "",
        sampleOutput: "",
        hiddenInput: "",
        hiddenOutput: "",
      });
    } catch (err) {
      console.log(err);
      alert("Create Failed ❌ (Admin required)");
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto overflow-hidden">
      {/* AMBIENT RADIAL GLOW BLOB */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 bg-[#0f172a]/60 border border-white/5 backdrop-blur-md rounded-2xl p-8 shadow-2xl space-y-6 animate-fadeIn">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Create Problem</h1>
          <p className="text-gray-400 text-xs mt-1">Configure challenge prompts, constraints, sample test cases, and hidden test suites.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section: Details */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Challenge Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                className="md:col-span-2 w-full px-3 py-2 text-sm rounded-lg bg-[#070b19] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition"
                placeholder="Problem Title (e.g., Sum of Two Numbers)"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />

              <select
                className="w-full px-3 py-2 text-sm rounded-lg bg-[#070b19] border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 transition cursor-pointer"
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <textarea
              className="w-full px-3 py-2 text-sm rounded-lg bg-[#070b19] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition"
              placeholder="Description (Write detailed markdown challenge prompt here...)"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
            />

            <textarea
              className="w-full px-3 py-2 text-sm rounded-lg bg-[#070b19] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition"
              placeholder="Constraints (e.g., 1 <= a, b <= 10^9)"
              name="constraints"
              value={form.constraints}
              onChange={handleChange}
              rows={2}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="w-full px-3 py-2 text-sm rounded-lg bg-[#070b19] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition"
                placeholder="Input Format (e.g., Two space-separated integers)"
                name="inputFormat"
                value={form.inputFormat}
                onChange={handleChange}
              />
              <input
                className="w-full px-3 py-2 text-sm rounded-lg bg-[#070b19] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition"
                placeholder="Output Format (e.g., Sum of a and b)"
                name="outputFormat"
                value={form.outputFormat}
                onChange={handleChange}
              />
            </div>

            <input
              className="w-full px-3 py-2 text-sm rounded-lg bg-[#070b19] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition"
              placeholder="Tags (comma separated, e.g. array, math, dynamic-programming)"
              name="tags"
              value={form.tags}
              onChange={handleChange}
            />
          </div>

          <div className="h-[1px] bg-white/5 my-4" />

          {/* Section: Testcases */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sample Test Case</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="space-y-1">
                <span className="text-gray-500">Sample Input</span>
                <textarea
                  className="w-full p-2.5 rounded-lg bg-[#070b19] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 resize-none"
                  placeholder="Paste sample input..."
                  name="sampleInput"
                  value={form.sampleInput}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              <div className="space-y-1">
                <span className="text-gray-500">Sample Output</span>
                <textarea
                  className="w-full p-2.5 rounded-lg bg-[#070b19] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 resize-none"
                  placeholder="Paste expected output..."
                  name="sampleOutput"
                  value={form.sampleOutput}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hidden Evaluation Test Case</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="space-y-1">
                <span className="text-gray-500">Hidden Input</span>
                <textarea
                  className="w-full p-2.5 rounded-lg bg-[#070b19] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 resize-none"
                  placeholder="Paste hidden input..."
                  name="hiddenInput"
                  value={form.hiddenInput}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              <div className="space-y-1">
                <span className="text-gray-500">Hidden Output</span>
                <textarea
                  className="w-full p-2.5 rounded-lg bg-[#070b19] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 resize-none"
                  placeholder="Paste expected output..."
                  name="hiddenOutput"
                  value={form.hiddenOutput}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>
          </div>

          <button className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-sm shadow-md shadow-emerald-500/5 hover:shadow-emerald-500/10 hover:-translate-y-0.5 transition duration-200 mt-4">
            Create Problem
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminCreateProblem;