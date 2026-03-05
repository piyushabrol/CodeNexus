import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

function Problems() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await API.get("/problems");

        // backend may return array OR { items: [...] }
        const data = res.data;
        const list = Array.isArray(data) ? data : (data.items || data.problems || []);

        setProblems(list);
      } catch (err) {
        console.log(err);
        setProblems([]);
      }
    };

    fetchProblems();
  }, []);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-950 text-gray-300">
          <tr>
            <th className="p-4">Title</th>
            <th className="p-4">Difficulty</th>
            <th className="p-4">Tags</th>
          </tr>
        </thead>

        <tbody>
          {problems.map((p) => (
            <tr
              key={p._id}
              className="border-t border-gray-800 hover:bg-gray-800 transition"
            >
              <td className="p-4">
                <Link
                  to={`/problems/${p._id}`}
                  className="text-green-400 hover:underline"
                >
                  {p.title}
                </Link>
              </td>

              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    p.difficulty === "Easy"
                      ? "bg-green-900 text-green-400"
                      : p.difficulty === "Medium"
                      ? "bg-yellow-900 text-yellow-400"
                      : "bg-red-900 text-red-400"
                  }`}
                >
                  {p.difficulty}
                </span>
              </td>

              <td className="p-4">
                <div className="flex gap-2 flex-wrap">
                  {(Array.isArray(p.tags) ? p.tags : []).map((tag, i) => (
                    <span
                      key={i}
                      className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Problems;