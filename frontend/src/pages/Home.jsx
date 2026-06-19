import { Link } from "react-router-dom";
import LogoMark from "../components/LogoMark";

function Home() {
  return (
    <div className="relative min-h-[85vh] flex flex-col justify-center items-center overflow-hidden">
      
      {/* AMBIENT RADIAL GLOW BLOB 1 */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      {/* AMBIENT RADIAL GLOW BLOB 2 */}
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '12s' }} />

      <div className="relative z-10 max-w-6xl w-full mx-auto px-6 text-center space-y-16 py-12">
        
        {/* HERO SECTION */}
        <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn">
          {/* Animated Logo Container */}
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 shadow-lg shadow-emerald-500/5 hover:scale-105 transition duration-300">
              <LogoMark size={70} />
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Level Up Your Code at <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              CodeNexus
            </span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Practice coding challenges, master data structures and algorithms, and prepare for top-tier technical interviews on a high-fidelity workspace.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/problems"
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition duration-200"
            >
              Start Solving Challenges
            </Link>

            <Link
              to="/login"
              className="bg-slate-900/60 border border-white/10 hover:border-emerald-500/30 text-gray-200 hover:text-white px-8 py-3.5 rounded-xl backdrop-blur-sm hover:-translate-y-0.5 transition duration-200"
            >
              Log in to Account
            </Link>
          </div>
        </div>

        {/* MOCK IDE PREVIEW GRID */}
        <div className="max-w-4xl mx-auto bg-[#0a0f1d]/80 border border-white/5 rounded-2xl p-4 shadow-2xl relative overflow-hidden group hover:border-white/10 transition duration-300 animate-fadeIn" style={{ animationDelay: '150ms' }}>
          {/* OS Window header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[10px] text-gray-500 font-mono">workspace.js — CodeNexus</span>
            <div className="w-12" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-left text-xs font-mono">
            {/* Mock Left: Problem */}
            <div className="md:col-span-2 bg-[#0d1326] p-4 rounded-xl border border-white/5 space-y-3">
              <div className="text-white font-bold text-sm">Two Sum Indices</div>
              <div className="text-gray-400 text-[11px] leading-relaxed">
                Given an array of integers <code className="text-emerald-400">nums</code> and an integer <code className="text-emerald-400">target</code>, return indices of the two numbers such that they add up to target.
              </div>
              <div className="pt-2 border-t border-white/5 space-y-1">
                <span className="text-gray-500 text-[10px] uppercase">Input</span>
                <pre className="bg-[#090d1a] p-1.5 rounded text-gray-300">nums = [2, 7, 11], target = 9</pre>
              </div>
            </div>

            {/* Mock Right: Editor */}
            <div className="md:col-span-3 bg-[#0d1326] p-4 rounded-xl border border-white/5 flex flex-col justify-between h-40">
              <div className="space-y-1">
                <div className="text-emerald-500/80">// Solution wrapper</div>
                <div><span className="text-indigo-400">function</span> <span className="text-emerald-300">solve</span>(input) &#123;</div>
                <div className="pl-4 text-gray-400"><span className="text-indigo-400">return</span> [0, 1]; <span className="text-emerald-500/70">// indices of 2 and 7</span></div>
                <div>&#125;</div>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-white/5">
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-400/10 px-2 py-0.5 rounded">✓ Accepted (32ms)</span>
                <span className="text-gray-500 text-[10px]">Score: 100/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          
          {/* FEATURE 1 */}
          <div className="bg-[#0f172a]/40 hover:bg-[#0f172a]/70 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/5 group text-left space-y-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/10 group-hover:scale-110 transition duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Zero-Boilerplate Sandbox</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Write clean algorithms directly inside template functions. The engine automatically handles stream wrapping and parses stdin under the hood.
              </p>
            </div>
          </div>

          {/* FEATURE 2 */}
          <div className="bg-[#0f172a]/40 hover:bg-[#0f172a]/70 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-indigo-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/5 group text-left space-y-4">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/10 group-hover:scale-110 transition duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Instant execution</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Verify outputs instantly against multiple test cases with visual dashboards, expected vs actual values, and code run metrics.
              </p>
            </div>
          </div>

          {/* FEATURE 3 */}
          <div className="bg-[#0f172a]/40 hover:bg-[#0f172a]/70 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/5 group text-left space-y-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/10 group-hover:scale-110 transition duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Version History & Stats</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Keep track of your performance logs. Review previous submissions and restore earlier versions of your code in a single click.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Home;