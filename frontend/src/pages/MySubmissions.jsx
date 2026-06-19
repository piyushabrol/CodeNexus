import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";

function MySubmissions() {
  const [subs, setSubs] = useState([]);
  const [searchParams] = useSearchParams();
  const problemId = searchParams.get("problemId");

  useEffect(() => {
    const fetchSubs = async () => {
      const url = problemId
        ? `/submissions/me?problemId=${problemId}`
        : `/submissions/me`;
      const res = await API.get(url);
      setSubs(res.data);
    };
    fetchSubs().catch(console.log);
  }, [problemId]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* HEADER */}
      <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-5 shadow-lg">
        <h1 className="text-xl font-bold text-white tracking-tight">Submission History</h1>
        <p className="text-gray-400 text-xs mt-1">Review your execution records, score outcomes, and code drafts.</p>
      </div>

      {/* TABLE LIST */}
      <div className="bg-[#0f172a] border border-white/5 rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/40 text-gray-400 text-xs font-semibold uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="p-4 pl-6">Verdict Status</th>
                <th className="p-4">Language</th>
                <th className="p-4">Execution Time</th>
                <th className="p-4">Submitted Date</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-white/5 text-sm">
              {subs.length === 0 ? (
                <tr>
                  <td className="p-12 text-center text-gray-500 text-xs" colSpan={5}>
                    No submissions recorded yet. Solve a challenge to submit!
                  </td>
                </tr>
              ) : (
                subs.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-900/40 transition duration-150">
                    {/* Status Badge */}
                    <td className="p-4 pl-6">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          s.status === "Accepted"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>

                    {/* Language */}
                    <td className="p-4 font-mono text-xs text-gray-400 uppercase">
                      {s.language}
                    </td>

                    {/* Execution Time */}
                    <td className="p-4 font-semibold text-white">
                      {s.executionTimeMs} ms
                    </td>

                    {/* Date */}
                    <td className="p-4 text-xs text-gray-400">
                      {new Date(s.createdAt).toLocaleString()}
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(s.code);
                          alert("Code copied to clipboard! ✅");
                        }}
                        className="bg-slate-800/40 hover:bg-slate-800 border border-white/5 hover:border-emerald-500/30 text-xs px-3 py-1.5 rounded-lg text-gray-300 hover:text-white transition flex items-center gap-1.5 ml-auto"
                      >
                        <span>📋</span> Copy Code
                      </button>
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

export default MySubmissions;