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
    <div>
      <h1 className="text-3xl mb-6">My Submissions</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-950">
            <tr className="text-left">
              <th className="p-3 border-b border-gray-800">Status</th>
              <th className="p-3 border-b border-gray-800">Language</th>
              <th className="p-3 border-b border-gray-800">Time</th>
              <th className="p-3 border-b border-gray-800">Date</th>
              <th className="p-3 border-b border-gray-800">Code</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s) => (
              <tr key={s._id} className="border-b border-gray-800">
                <td className="p-3">
                  <span
                    className={
                      s.status === "Accepted"
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {s.status}
                  </span>
                </td>
                <td className="p-3">{s.language}</td>
                <td className="p-3">{s.executionTimeMs}ms</td>
                <td className="p-3">
                  {new Date(s.createdAt).toLocaleString()}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(s.code);
                      alert("Code copied ✅");
                    }}
                    className="px-3 py-1 rounded bg-gray-800 border border-gray-700 hover:border-green-500"
                  >
                    Copy
                  </button>
                </td>
              </tr>
            ))}

            {subs.length === 0 && (
              <tr>
                <td className="p-6 text-gray-400" colSpan={5}>
                  No submissions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MySubmissions;