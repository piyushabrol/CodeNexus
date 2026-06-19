import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

function Problems() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const fetchProblems = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (difficulty) params.difficulty = difficulty;

      const res = await API.get("/problems", { params });
      const data = res.data;
      const list = Array.isArray(data) ? data : (data.items || data.problems || []);

      setProblems(list);
    } catch (err) {
      console.log("Error fetching problems:", err);
      setProblems([]);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [search, difficulty]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* HEADER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0f172a] border border-white/5 rounded-2xl p-5 shadow-lg">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Coding Challenges</h1>
          <p className="text-gray-400 text-xs mt-1">Select a challenge to solve and improve your ranking.</p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded-xl px-3.5 py-1.5 pl-9 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition w-56"
            />
            <svg className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Difficulty Dropdown */}
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition cursor-pointer"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* PROBLEMS LIST TABLE */}
      <div className="bg-[#0f172a] border border-white/5 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/40 text-gray-400 text-xs font-semibold uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="p-4 pl-6">Challenge Title</th>
                <th className="p-4">Difficulty</th>
                <th className="p-4 pr-6">Topics / Tags</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 text-sm">
              {problems.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-12 text-gray-500 text-xs">
                    No challenges found matching your search.
                  </td>
                </tr>
              ) : (
                problems.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-slate-900/40 transition duration-150 group"
                  >
                    {/* Title */}
                    <td className="p-4 pl-6 font-semibold">
                      <Link
                        to={`/problems/${p._id}`}
                        className="text-white hover:text-emerald-400 transition duration-200"
                      >
                        {p.title}
                      </Link>
                    </td>

                    {/* Difficulty */}
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          p.difficulty === "Easy"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : p.difficulty === "Medium"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}
                      >
                        {p.difficulty}
                      </span>
                    </td>

                    {/* Tags */}
                    <td className="p-4 pr-6">
                      <div className="flex gap-1.5 flex-wrap">
                        {(Array.isArray(p.tags) ? p.tags : []).map((tag, i) => (
                          <span
                            key={i}
                            className="bg-slate-800/40 text-gray-400 border border-white/5 px-2.5 py-0.5 rounded-full text-[10px] font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Problems;