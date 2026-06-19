import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import API from "../api/axios";

const LANGS = [
  { label: "JavaScript", value: "javascript", monaco: "javascript" },
  { label: "Python", value: "python", monaco: "python" },
];

const starterCode = {
  javascript: `// Write your solution here
function solve(input) {
  // TODO: Return your output
  return input;
}
`,
  python: `# Write your solution here
def solve(input):
    # TODO: Return your output
    return input
`,
};

const normalizeOutput = (s = "") => {
  return s
    .toString()
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
};

function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [stdin, setStdin] = useState("");
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Tabs for Left Panel
  const [leftTab, setLeftTab] = useState("description"); // "description" | "submissions" | "history"
  const [submissions, setSubmissions] = useState([]);
  const [history, setHistory] = useState([]);

  // Tabs for Bottom Console
  const [consoleTab, setConsoleTab] = useState("cases"); // "cases" | "custom"
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);
  const [runResults, setRunResults] = useState(null); // array of run results
  const [customOutput, setCustomOutput] = useState("");
  const [customRunStatus, setCustomRunStatus] = useState("");
  const [customRunTime, setCustomRunTime] = useState(0);
  const [submitVerdict, setSubmitVerdict] = useState(null); // submit result object

  const storageKey = useMemo(() => `code:${id}:${language}`, [id, language]);

  // Fetch Problem details
  useEffect(() => {
    const fetchProblem = async () => {
      const res = await API.get(`/problems/${id}`);
      setProblem(res.data);
    };
    fetchProblem().catch(console.log);
  }, [id]);

  // Load Saved Code
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    setCode(saved ?? starterCode[language]);
  }, [storageKey, language]);

  // Save Code changes
  useEffect(() => {
    if (code) localStorage.setItem(storageKey, code);
  }, [code, storageKey]);

  // Fetch Submissions
  const fetchSubmissions = async () => {
    try {
      const res = await API.get(`/submissions/me?problemId=${id}`);
      setSubmissions(res.data);
    } catch (err) {
      console.log("Error fetching submissions:", err);
    }
  };

  // Fetch Version History
  const fetchHistory = async () => {
    try {
      const res = await API.get(`/code/history?problemId=${id}&language=${language}`);
      setHistory(res.data);
    } catch (err) {
      console.log("Error fetching history:", err);
    }
  };

  // Handle Left Tab toggle
  useEffect(() => {
    if (leftTab === "submissions") {
      fetchSubmissions();
    } else if (leftTab === "history") {
      fetchHistory();
    }
  }, [leftTab, id, language]);

  // Run on all sample test cases
  const onRunAll = async () => {
    if (!problem?.sampleTestCases?.length) return;
    try {
      setRunning(true);
      setConsoleTab("cases");
      setSubmitVerdict(null); // hide submit verdict when running tests
      const results = [];
      
      for (let i = 0; i < problem.sampleTestCases.length; i++) {
        const tc = problem.sampleTestCases[i];
        const res = await API.post("/code/run", {
          problemId: id,
          language,
          code,
          stdin: tc.input,
        });

        const actualOut = res.data.output || "";
        const cleanActual = normalizeOutput(actualOut);
        const cleanExpected = normalizeOutput(tc.output);
        const passed = res.data.status === "OK" && cleanActual === cleanExpected;

        results.push({
          status: res.data.status,
          stdout: actualOut,
          passed,
          timeMs: res.data.timeMs,
          expected: tc.output,
          input: tc.input
        });
      }
      setRunResults(results);
      setActiveCaseIdx(0);
    } catch (err) {
      console.error(err);
      setRunResults(
        problem.sampleTestCases.map(tc => ({
          status: "Error",
          stdout: err.response?.data?.message || err.message || "Run failed",
          passed: false,
          timeMs: 0,
          expected: tc.output,
          input: tc.input
        }))
      );
    } finally {
      setRunning(false);
    }
  };

  // Run Custom Input
  const onRunCustom = async () => {
    try {
      setRunning(true);
      setConsoleTab("custom");
      setSubmitVerdict(null);
      setCustomOutput("Running...");
      setCustomRunStatus("");
      setCustomRunTime(0);

      const res = await API.post("/code/run", {
        problemId: id,
        language,
        code,
        stdin,
      });

      setCustomOutput(res.data.output || "");
      setCustomRunStatus(res.data.status);
      setCustomRunTime(res.data.timeMs);
    } catch (err) {
      setCustomOutput(err.response?.data?.message || err.message || "Run failed");
      setCustomRunStatus("Error");
      setCustomRunTime(0);
    } finally {
      setRunning(false);
    }
  };

  // Submit Code
  const onSubmit = async () => {
    try {
      setSubmitting(true);
      setSubmitVerdict(null);

      const res = await API.post("/code/submit", {
        problemId: id,
        language,
        code,
      });

      setSubmitVerdict(res.data);
      // Auto switch to show submissions and refresh stats
      setLeftTab("submissions");
      fetchSubmissions();
      fetchHistory();
    } catch (err) {
      setSubmitVerdict({
        status: "Error",
        message: err.response?.data?.message || err.message || "Submit failed",
        score: 0,
        timeMs: 0
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!problem) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-3">
        <svg className="animate-spin h-10 w-10 text-emerald-400" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-gray-400 text-sm font-medium">Loading problem details...</span>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col gap-4">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#0f172a] border border-white/5 rounded-xl px-5 py-3.5 gap-3">
        <div className="flex items-center gap-4">
          <Link
            to="/problems"
            className="text-gray-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 px-3 py-1.5 rounded-lg text-sm transition flex items-center gap-1.5 border border-white/5"
          >
            ← Problems
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              {problem.title}
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                problem.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                problem.difficulty === "Medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                "bg-rose-500/10 text-rose-400 border-rose-500/20"
              }`}>
                {problem.difficulty}
              </span>
            </h1>
          </div>
        </div>

        {/* TOP STATUS BAR IF RECENTLY SUBMITTED */}
        {submitVerdict && (
          <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border text-sm animate-fadeIn ${
            submitVerdict.status === "Accepted"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
              : "bg-rose-500/10 text-rose-400 border-rose-500/25 shadow-[0_0_15px_rgba(244,63,94,0.05)]"
          }`}>
            <span className="font-semibold flex items-center gap-1.5">
              {submitVerdict.status === "Accepted" ? "✓" : "✗"} Verdict: {submitVerdict.status}
            </span>
            <span className="text-white/40">|</span>
            <span>Score: {submitVerdict.score}</span>
            <span className="text-white/40">|</span>
            <span>Time: {submitVerdict.timeMs}ms</span>
          </div>
        )}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-4 overflow-hidden min-h-0">
        
        {/* LEFT COLUMN: DESCRIPTION / SUBMISSIONS / HISTORY */}
        <div className="lg:col-span-2 flex flex-col bg-[#0f172a] border border-white/5 rounded-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-white/5 bg-slate-900/50 p-1.5 gap-1">
            <button
              onClick={() => setLeftTab("description")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition duration-200 ${
                leftTab === "description"
                  ? "bg-[#1e293b] text-emerald-400 shadow-sm"
                  : "text-gray-400 hover:text-white hover:bg-slate-800/40"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setLeftTab("submissions")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition duration-200 ${
                leftTab === "submissions"
                  ? "bg-[#1e293b] text-emerald-400 shadow-sm"
                  : "text-gray-400 hover:text-white hover:bg-slate-800/40"
              }`}
            >
              Submissions
            </button>
            <button
              onClick={() => setLeftTab("history")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition duration-200 ${
                leftTab === "history"
                  ? "bg-[#1e293b] text-emerald-400 shadow-sm"
                  : "text-gray-400 hover:text-white hover:bg-slate-800/40"
              }`}
            >
              Code History
            </button>
          </div>

          {/* Tab content wrapper */}
          <div className="flex-1 overflow-y-auto p-5">
            {leftTab === "description" && (
              <div className="space-y-6 animate-fadeIn">
                {/* Description */}
                <div className="text-gray-300 text-[14px] leading-relaxed whitespace-pre-wrap">
                  {problem.description}
                </div>

                {/* Constraints */}
                {problem.constraints && (
                  <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Constraints</h3>
                    <div className="text-gray-200 font-mono text-sm whitespace-pre-wrap">{problem.constraints}</div>
                  </div>
                )}

                {/* Formats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {problem.inputFormat && (
                    <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Input Format</h3>
                      <div className="text-gray-300 text-sm whitespace-pre-wrap">{problem.inputFormat}</div>
                    </div>
                  )}
                  {problem.outputFormat && (
                    <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Output Format</h3>
                      <div className="text-gray-300 text-sm whitespace-pre-wrap">{problem.outputFormat}</div>
                    </div>
                  )}
                </div>

                {/* Sample Testcases */}
                {problem.sampleTestCases && problem.sampleTestCases.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sample Cases</h3>
                    {problem.sampleTestCases.map((tc, idx) => (
                      <div key={idx} className="bg-slate-950 border border-white/5 rounded-xl p-4 space-y-3 font-mono text-xs">
                        <div>
                          <div className="text-emerald-400/80 mb-1 font-semibold">Sample Input #{idx + 1}</div>
                          <pre className="text-gray-200 bg-slate-900 p-2.5 rounded border border-white/5 overflow-auto max-h-[150px] whitespace-pre-wrap">{tc.input || "—"}</pre>
                        </div>
                        <div>
                          <div className="text-emerald-400/80 mb-1 font-semibold">Sample Output #{idx + 1}</div>
                          <pre className="text-gray-200 bg-slate-900 p-2.5 rounded border border-white/5 overflow-auto max-h-[150px] whitespace-pre-wrap">{tc.output || "—"}</pre>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {leftTab === "submissions" && (
              <div className="space-y-3 animate-fadeIn">
                <h2 className="text-sm font-semibold text-gray-400 mb-2">Submission History</h2>
                {submissions.length === 0 ? (
                  <div className="text-center py-10 text-gray-500 text-xs border border-dashed border-white/5 rounded-xl">
                    No submissions found for this problem yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {submissions.map((sub) => (
                      <div key={sub._id} className="bg-slate-900/50 border border-white/5 rounded-xl p-3 flex items-center justify-between hover:bg-slate-900 transition">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold ${
                              sub.status === "Accepted" ? "text-emerald-400" : "text-rose-400"
                            }`}>
                              {sub.status}
                            </span>
                            <span className="text-[10px] text-gray-500 font-mono">({sub.language})</span>
                          </div>
                          <div className="text-[10px] text-gray-400 mt-1">
                            {new Date(sub.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right text-xs">
                          <div className="font-semibold text-white">{sub.executionTimeMs} ms</div>
                          <div className="text-[10px] text-gray-500">Duration</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {leftTab === "history" && (
              <div className="space-y-3 animate-fadeIn">
                <h2 className="text-sm font-semibold text-gray-400 mb-2">Saved Versions</h2>
                {history.length === 0 ? (
                  <div className="text-center py-10 text-gray-500 text-xs border border-dashed border-white/5 rounded-xl">
                    No saved code history found.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {history.map((hist) => (
                      <div
                        key={hist._id}
                        onClick={() => {
                          if (window.confirm("Restore this version to your editor? This will overwrite your current draft.")) {
                            setCode(hist.code);
                          }
                        }}
                        className="bg-slate-900/50 border border-white/5 rounded-xl p-3 flex items-center justify-between hover:bg-slate-900 cursor-pointer hover:border-emerald-500/20 transition group"
                      >
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-emerald-400 transition">
                            Version #{hist.versionNumber}
                          </div>
                          <div className="text-[10px] text-gray-500 mt-1">
                            Saved {new Date(hist.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition">
                          Restore
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: EDITOR & RUNNER CONSOLE */}
        <div className="lg:col-span-3 flex flex-col bg-[#0f172a] border border-white/5 rounded-2xl overflow-hidden min-h-0">
          
          {/* EDITOR TOOLBAR */}
          <div className="p-3 border-b border-white/5 bg-slate-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Language</span>
              <select
                className="bg-slate-800 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-emerald-500 transition cursor-pointer"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {LANGS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onRunAll}
                disabled={running || submitting}
                className="px-4 py-1.5 rounded-lg bg-slate-800 border border-white/5 text-xs font-semibold text-gray-200 hover:text-white hover:border-emerald-500 transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {running ? (
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <span className="text-emerald-400 font-bold">▶</span>
                )}
                Run
              </button>

              <button
                onClick={onSubmit}
                disabled={running || submitting}
                className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <svg className="animate-spin h-3.5 w-3.5 text-slate-950" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <span>☁</span>
                )}
                Submit
              </button>
            </div>
          </div>

          {/* MONACO CODE EDITOR */}
          <div className="flex-1 min-h-0 bg-[#1e293b]/10">
            <Editor
              height="100%"
              theme="vs-dark"
              language={LANGS.find((x) => x.value === language)?.monaco}
              value={code}
              onChange={(v) => setCode(v ?? "")}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 12 },
              }}
            />
          </div>

          {/* BOTTOM RUNNER CONSOLE */}
          <div className="h-[250px] border-t border-white/5 flex flex-col bg-slate-950">
            <div className="flex border-b border-white/5 bg-slate-900/30 px-3 p-1.5 justify-between items-center">
              {/* Console Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setConsoleTab("cases")}
                  className={`px-3 py-1 rounded text-xs font-semibold transition ${
                    consoleTab === "cases"
                      ? "text-emerald-400 bg-slate-800"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Testcases
                </button>
                <button
                  onClick={() => setConsoleTab("custom")}
                  className={`px-3 py-1 rounded text-xs font-semibold transition ${
                    consoleTab === "custom"
                      ? "text-emerald-400 bg-slate-800"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Custom Input
                </button>
              </div>

              {/* Status Badge */}
              <div className="text-[10px] text-gray-500 font-mono">
                {running ? "Executing Code..." : "Ready"}
              </div>
            </div>

            {/* Console Tab Content */}
            <div className="flex-1 p-4 overflow-y-auto min-h-0">
              {consoleTab === "cases" && (
                <div className="h-full flex flex-col gap-3">
                  {/* Case Indicator Selector */}
                  <div className="flex gap-2">
                    {problem.sampleTestCases?.map((tc, idx) => {
                      const hasResult = runResults && runResults[idx];
                      const isPassed = hasResult && runResults[idx].passed;
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => setActiveCaseIdx(idx)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono border flex items-center gap-1.5 transition ${
                            activeCaseIdx === idx
                              ? "bg-slate-800 border-white/10 text-white"
                              : "bg-slate-900/40 border-white/5 text-gray-400 hover:text-white"
                          }`}
                        >
                          Case {idx + 1}
                          {hasResult && (
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              isPassed ? "bg-emerald-400" : "bg-rose-400"
                            }`} />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Case Result Details */}
                  {problem.sampleTestCases?.length > 0 && (
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs overflow-y-auto">
                      <div className="space-y-2">
                        <div>
                          <div className="text-gray-500">Input</div>
                          <pre className="p-2 bg-slate-900 border border-white/5 rounded text-gray-300 whitespace-pre-wrap">
                            {problem.sampleTestCases[activeCaseIdx]?.input || "(empty)"}
                          </pre>
                        </div>
                        <div>
                          <div className="text-gray-500">Expected Output</div>
                          <pre className="p-2 bg-slate-900 border border-white/5 rounded text-gray-300 whitespace-pre-wrap">
                            {problem.sampleTestCases[activeCaseIdx]?.output || "(empty)"}
                          </pre>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-gray-500 flex items-center justify-between">
                          <span>Output</span>
                          {runResults && runResults[activeCaseIdx] && (
                            <span className={`font-semibold ${
                              runResults[activeCaseIdx].passed ? "text-emerald-400" : "text-rose-400"
                            }`}>
                              {runResults[activeCaseIdx].status === "OK"
                                ? (runResults[activeCaseIdx].passed ? "Passed ✓" : "Wrong Answer ✗")
                                : runResults[activeCaseIdx].status
                              } ({runResults[activeCaseIdx].timeMs}ms)
                            </span>
                          )}
                        </div>
                        <pre className={`p-2 border rounded min-h-[90px] whitespace-pre-wrap ${
                          runResults && runResults[activeCaseIdx]
                            ? runResults[activeCaseIdx].passed
                              ? "bg-slate-900/40 border-emerald-500/20 text-emerald-400"
                              : "bg-slate-900/40 border-rose-500/20 text-rose-400"
                            : "bg-slate-900 border-white/5 text-gray-500"
                        }`}>
                          {runResults && runResults[activeCaseIdx]
                            ? (runResults[activeCaseIdx].stdout || "(no output)")
                            : "Run the code to see output..."
                          }
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {consoleTab === "custom" && (
                <div className="h-full flex flex-col md:flex-row gap-4">
                  {/* Left: Input Textarea */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="text-xs text-gray-500 font-mono flex items-center justify-between">
                      <span>Standard Input</span>
                      <button
                        onClick={onRunCustom}
                        disabled={running}
                        className="text-[10px] text-emerald-400 hover:underline"
                      >
                        Run this input
                      </button>
                    </div>
                    <textarea
                      className="flex-1 w-full bg-slate-900 border border-white/5 rounded-lg p-2.5 font-mono text-xs text-white focus:outline-none focus:border-white/10 resize-none"
                      value={stdin}
                      onChange={(e) => setStdin(e.target.value)}
                      placeholder="Enter custom input standard inputs..."
                    />
                  </div>

                  {/* Right: Output console */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="text-xs text-gray-500 font-mono flex justify-between items-center">
                      <span>Standard Output</span>
                      {customRunStatus && (
                        <span className={`text-[10px] font-bold ${
                          customRunStatus === "OK" ? "text-emerald-400" : "text-rose-400"
                        }`}>
                          {customRunStatus} {customRunTime ? `(${customRunTime}ms)` : ""}
                        </span>
                      )}
                    </div>
                    <pre className="flex-1 p-2.5 bg-slate-900 border border-white/5 rounded-lg text-gray-300 font-mono text-xs overflow-auto whitespace-pre-wrap">
                      {customOutput || "Output will show here..."}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemDetail;