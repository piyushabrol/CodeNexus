const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

function mkTempDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "code-"));
  return dir;
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, "utf8");
}

function runCmd(cmd, args, opts) {
  return new Promise((resolve) => {
    const start = Date.now();
    const child = spawn(cmd, args, {
      cwd: opts.cwd,
      shell: false,
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";
    let killedByTimeout = false;

    const timeoutMs = opts.timeoutMs ?? 5000;

    const timer = setTimeout(() => {
      killedByTimeout = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    if (opts.stdin) {
      child.stdin.write(opts.stdin);
    }
    child.stdin.end();

    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));

    child.on("close", (code) => {
      clearTimeout(timer);
      const timeMs = Date.now() - start;

      resolve({
        code,
        timeMs,
        stdout,
        stderr,
        timedOut: killedByTimeout,
      });
    });
  });
}

async function runJava(tempDir, code, stdin, timeoutMs) {
  const file = path.join(tempDir, "Main.java");
  writeFile(file, code);

  const compile = await runCmd("javac", ["Main.java"], { cwd: tempDir, timeoutMs });
  if (compile.code !== 0) return { status: "CE", ...compile };

  const run = await runCmd("java", ["Main"], { cwd: tempDir, stdin, timeoutMs });
  return { status: run.timedOut ? "TLE" : run.code === 0 ? "OK" : "RE", ...run };
}

async function runCpp(tempDir, code, stdin, timeoutMs) {
  const cpp = path.join(tempDir, "main.cpp");
  writeFile(cpp, code);

  const exeName = process.platform === "win32" ? "main.exe" : "main";
  const compile = await runCmd("g++", ["main.cpp", "-O2", "-std=c++17", "-o", exeName], {
    cwd: tempDir,
    timeoutMs,
  });
  if (compile.code !== 0) return { status: "CE", ...compile };

  const run = await runCmd(path.join(tempDir, exeName), [], { cwd: tempDir, stdin, timeoutMs });
  return { status: run.timedOut ? "TLE" : run.code === 0 ? "OK" : "RE", ...run };
}

async function runPython(tempDir, code, stdin, timeoutMs) {
  const file = path.join(tempDir, "main.py");
  writeFile(file, code);

  // try python, fallback python3
  let run = await runCmd("python", ["main.py"], { cwd: tempDir, stdin, timeoutMs });
  if (run.code === 127) run = await runCmd("python3", ["main.py"], { cwd: tempDir, stdin, timeoutMs });

  return { status: run.timedOut ? "TLE" : run.code === 0 ? "OK" : "RE", ...run };
}

async function runJS(tempDir, code, stdin, timeoutMs) {
  const file = path.join(tempDir, "main.js");
  writeFile(file, code);

  const run = await runCmd("node", ["main.js"], { cwd: tempDir, stdin, timeoutMs });
  return { status: run.timedOut ? "TLE" : run.code === 0 ? "OK" : "RE", ...run };
}

async function execute({ language, code, stdin, timeoutMs }) {
  const tempDir = mkTempDir();
  try {
    if (language === "java") return await runJava(tempDir, code, stdin, timeoutMs);
    if (language === "cpp") return await runCpp(tempDir, code, stdin, timeoutMs);
    if (language === "python") return await runPython(tempDir, code, stdin, timeoutMs);
    if (language === "javascript") return await runJS(tempDir, code, stdin, timeoutMs);

    return { status: "ERR", code: 1, timeMs: 0, stdout: "", stderr: "Unsupported language" };
  } finally {
    // cleanup
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
  }
}

module.exports = { execute };