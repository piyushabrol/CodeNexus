import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import API from "../api/axios";

const LANGS = [
  { label: "JavaScript", value: "javascript", monaco: "javascript" },
  { label: "Python", value: "python", monaco: "python" },
  { label: "Java", value: "java", monaco: "java" },
  { label: "C++", value: "cpp", monaco: "cpp" },
];

const starterCode = {
  javascript: `// Write your solution here
function solve(input) {
  // TODO: parse input
  return input;
}
`,
  python: `# Write your solution here
def solve(input):
    # TODO: parse input
    return input
`,
  java: `// Write your solution here
import java.util.*;
class Main {
  public static void main(String[] args) {
    // TODO: read input and print output
    System.out.print("hello");
  }
}
`,
  cpp: `// Write your solution here
#include <bits/stdc++.h>
using namespace std;
int main(){
  // TODO: read input and print output
  cout << "hello";
  return 0;
}
`,
};

function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);

  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState("");
  const [stdin, setStdin] = useState("");
  const [consoleOut, setConsoleOut] = useState("");
  const [running, setRunning] = useState(false);

  const storageKey = useMemo(() => `code:${id}:${language}`, [id, language]);

  useEffect(() => {
    const fetchProblem = async () => {
      const res = await API.get(`/problems/${id}`);
      setProblem(res.data);
    };
    fetchProblem().catch(console.log);
  }, [id]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    setCode(saved ?? starterCode[language]);
  }, [storageKey, language]);

  useEffect(() => {
    if (code) localStorage.setItem(storageKey, code);
  }, [code, storageKey]);

  const onRun = async () => {
    try {
      setRunning(true);
      setConsoleOut("Running...\n");

      const res = await API.post("/code/run", {
        problemId: id,
        language,
        code,
        stdin,
      });

      const out =
        `Status: ${res.data.status}\n` +
        `Time: ${res.data.timeMs}ms\n` +
        `Memory: ${res.data.memoryKb ?? "N/A"}\n\n` +
        `${res.data.output || ""}`;

      setConsoleOut(out);
    } catch (err) {
      setConsoleOut(
        (err.response?.data?.message || err.message || "Run failed") + "\n",
      );
    } finally {
      setRunning(false);
    }
  };

  const onSubmit = async () => {
    try {
      setRunning(true);
      setConsoleOut("Submitting...\n");

      const res = await API.post("/code/submit", {
        problemId: id,
        language,
        code,
      });

      let extra = "";

      if (res.data.details) {
        const expected = res.data.details.expected ?? "";
        const got = res.data.details.got ?? "";

        if (expected !== "" || got !== "") {
          extra =
            `\n\n--- Expected ---\n${expected}\n\n` +
            `--- Got ---\n${got || "(no output)"}\n`;
        }
      }

      if (res.data.details?.error) {
        extra = `\n\n--- Error ---\n${res.data.details.error}\n`;
      }

      const out =
        `Result: ${res.data.status}\n` +
        `Score: ${res.data.score}\n` +
        `Time: ${res.data.timeMs}ms\n` +
        `Memory: ${res.data.memoryKb ?? "N/A"}\n` +
        `Version: ${res.data.version ?? "N/A"}\n\n` +
        `${res.data.message || ""}` +
        extra;

      setConsoleOut(out);
    } catch (err) {
      setConsoleOut(
        (err.response?.data?.message || err.message || "Submit failed") + "\n",
      );
    } finally {
      setRunning(false);
    }
  };

  if (!problem) return <div>Loading...</div>;

  return (
    <div className="h-[calc(100vh-80px)] grid grid-rows-[1fr_220px] gap-4">

      {/* MAIN */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 overflow-hidden">

        {/* LEFT PANEL */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-5 overflow-auto">

          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{problem.title}</h1>
            <span className="text-sm px-3 py-1 rounded-full bg-gray-800 border border-gray-700">
              {problem.difficulty}
            </span>
          </div>

          <div className="mt-4 text-gray-200 whitespace-pre-wrap">
            {problem.description}
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Constraints</h2>
            <div className="text-gray-300 whitespace-pre-wrap">
              {problem.constraints || "—"}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Input Format</h2>
            <div className="text-gray-300 whitespace-pre-wrap">
              {problem.inputFormat || "—"}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Output Format</h2>
            <div className="text-gray-300 whitespace-pre-wrap">
              {problem.outputFormat || "—"}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Sample</h2>

            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">

              <div className="text-sm text-gray-300">Input</div>

              <pre className="text-gray-200 overflow-auto whitespace-pre-wrap">
                {problem.sampleTestCases?.[0]?.input || "—"}
              </pre>

              <div className="text-sm text-gray-300 mt-3">Output</div>

              <pre className="text-gray-200 overflow-auto whitespace-pre-wrap">
                {problem.sampleTestCases?.[0]?.output || "—"}
              </pre>

            </div>
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-3 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col">

          <div className="p-3 border-b border-gray-800 flex items-center justify-between">

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-300">Language</span>

              <select
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1"
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
                onClick={onRun}
                disabled={running}
                className="px-4 py-1.5 rounded bg-gray-800 border border-gray-700 hover:border-green-500 disabled:opacity-50"
              >
                Run
              </button>

              <button
                onClick={onSubmit}
                disabled={running}
                className="px-4 py-1.5 rounded bg-green-500 hover:bg-green-600 font-semibold disabled:opacity-50"
              >
                Submit
              </button>

            </div>

          </div>

          <div className="flex-1">

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
              }}
            />

          </div>

          <div className="p-3 border-t border-gray-800">

            <div className="text-sm text-gray-300 mb-1">
              Custom Input (optional)
            </div>

            <textarea
              className="w-full bg-gray-950 border border-gray-800 rounded p-2 text-sm"
              rows={3}
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Paste custom input here..."
            />

          </div>

        </div>

      </div>

      {/* CONSOLE */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">

        <div className="px-4 py-2 border-b border-gray-800 text-sm text-gray-300">
          Output Console
        </div>

        <pre className="p-4 text-gray-200 overflow-y-auto max-h-[200px] whitespace-pre-wrap">
          {consoleOut || "Run / Submit to see output..."}
        </pre>

      </div>

    </div>
  );
}

export default ProblemDetail;