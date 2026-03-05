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
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl mb-6">Create Problem (Admin)</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          placeholder="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          placeholder="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows={4}
        />

        <textarea
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          placeholder="Constraints"
          name="constraints"
          value={form.constraints}
          onChange={handleChange}
          rows={2}
        />

        <input
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          placeholder="Input Format"
          name="inputFormat"
          value={form.inputFormat}
          onChange={handleChange}
        />

        <input
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          placeholder="Output Format"
          name="outputFormat"
          value={form.outputFormat}
          onChange={handleChange}
        />

        <select
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          name="difficulty"
          value={form.difficulty}
          onChange={handleChange}
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <input
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          placeholder="Tags (comma separated) e.g. array, sorting"
          name="tags"
          value={form.tags}
          onChange={handleChange}
        />

        <div className="grid grid-cols-2 gap-4">
          <textarea
            className="p-2 rounded bg-gray-800 border border-gray-700"
            placeholder="Sample Input"
            name="sampleInput"
            value={form.sampleInput}
            onChange={handleChange}
            rows={3}
          />
          <textarea
            className="p-2 rounded bg-gray-800 border border-gray-700"
            placeholder="Sample Output"
            name="sampleOutput"
            value={form.sampleOutput}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <textarea
            className="p-2 rounded bg-gray-800 border border-gray-700"
            placeholder="Hidden Input"
            name="hiddenInput"
            value={form.hiddenInput}
            onChange={handleChange}
            rows={3}
          />
          <textarea
            className="p-2 rounded bg-gray-800 border border-gray-700"
            placeholder="Hidden Output"
            name="hiddenOutput"
            value={form.hiddenOutput}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <button className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded font-semibold">
          Create
        </button>
      </form>
    </div>
  );
}

export default AdminCreateProblem;