import { Link } from "react-router-dom";
import LogoMark from "../components/LogoMark";

function Home() {
  return (
    <div className="max-w-6xl mx-auto text-center">

      {/* HERO */}
      <div className="mt-16 mb-20">
        <div className="flex justify-center mb-6">
          <LogoMark size={70} />
        </div>

        <h1 className="text-4xl font-bold mb-4 text-white">
          Welcome to <span className="text-emerald-400">CodeNexus</span>
        </h1>

        <p className="text-gray-400 max-w-xl mx-auto">
          Practice coding problems, improve your problem solving skills,
          and prepare for coding interviews with a clean and minimal platform.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/problems"
            className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-lg font-semibold"
          >
            Start Solving
          </Link>

          <Link
            to="/login"
            className="border border-gray-700 hover:border-emerald-400 px-6 py-3 rounded-lg"
          >
            Login
          </Link>
        </div>
      </div>

      {/* FEATURES */}
      <div className="grid md:grid-cols-3 gap-8 mb-24">

        <div className="bg-[#0f172a] p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-semibold mb-2">💻 Multiple Languages</h3>
          <p className="text-gray-400 text-sm">
            Solve problems using Java, Python, C++, and JavaScript.
          </p>
        </div>

        <div className="bg-[#0f172a] p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-semibold mb-2">⚡ Real-time Execution</h3>
          <p className="text-gray-400 text-sm">
            Run your code instantly and see results in the output console.
          </p>
        </div>

        <div className="bg-[#0f172a] p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-semibold mb-2">🏆 Interview Practice</h3>
          <p className="text-gray-400 text-sm">
            Prepare for coding interviews with curated problems.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Home;