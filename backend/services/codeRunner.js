const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

function mkTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "code-"));
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, "utf8");
}

function runCmd(cmd, args, opts = {}) {
  return new Promise((resolve) => {
    const start = Date.now();

    let child;
    try {
      child = spawn(cmd, args, {
        cwd: opts.cwd,
        shell: false,
        windowsHide: true,
      });
    } catch (err) {
      return resolve({
        code: 1,
        timeMs: 0,
        stdout: "",
        stderr: err.message,
        timedOut: false,
      });
    }

    let stdout = "";
    let stderr = "";
    let killedByTimeout = false;
    let settled = false;

    const timeoutMs = opts.timeoutMs ?? 5000;

    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(result);
    };

    const timer = setTimeout(() => {
      killedByTimeout = true;
      try {
        child.kill("SIGKILL");
      } catch {}
    }, timeoutMs);

    if (opts.stdin) {
      child.stdin.write(opts.stdin);
    }
    child.stdin.end();

    child.stdout.on("data", (d) => {
      stdout += d.toString();
    });

    child.stderr.on("data", (d) => {
      stderr += d.toString();
    });

    child.on("error", (err) => {
      finish({
        code: 1,
        timeMs: Date.now() - start,
        stdout,
        stderr: err.message,
        timedOut: false,
      });
    });

    child.on("close", (code) => {
      finish({
        code,
        timeMs: Date.now() - start,
        stdout,
        stderr,
        timedOut: killedByTimeout,
      });
    });
  });
}

function isCommandMissing(result) {
  const msg = (result.stderr || "").toLowerCase();
  return (
    msg.includes("enoent") ||
    msg.includes("not found") ||
    msg.includes("is not recognized")
  );
}

async function runPython(tempDir, code, stdin, timeoutMs) {
  const file = path.join(tempDir, "main.py");
  writeFile(file, code);

  let run = await runCmd("python", ["main.py"], {
    cwd: tempDir,
    stdin,
    timeoutMs,
  });

  if (run.code !== 0 && isCommandMissing(run)) {
    run = await runCmd("python3", ["main.py"], {
      cwd: tempDir,
      stdin,
      timeoutMs,
    });
  }

  if (run.code !== 0 && isCommandMissing(run)) {
    return {
      status: "RE",
      code: 1,
      timeMs: run.timeMs,
      stdout: "",
      stderr: "Python is not available on the server.",
      timedOut: false,
    };
  }

  return {
    status: run.timedOut ? "TLE" : run.code === 0 ? "OK" : "RE",
    ...run,
  };
}

async function runJS(tempDir, code, stdin, timeoutMs) {
  const file = path.join(tempDir, "main.js");
  writeFile(file, code);

  const run = await runCmd("node", ["main.js"], {
    cwd: tempDir,
    stdin,
    timeoutMs,
  });

  return {
    status: run.timedOut ? "TLE" : run.code === 0 ? "OK" : "RE",
    ...run,
  };
}

async function execute({ language, code, stdin, timeoutMs }) {
  const tempDir = mkTempDir();

  try {
    if (language === "python") {
      return await runPython(tempDir, code, stdin, timeoutMs);
    }

    if (language === "javascript") {
      return await runJS(tempDir, code, stdin, timeoutMs);
    }

    return {
      status: "ERR",
      code: 1,
      timeMs: 0,
      stdout: "",
      stderr: "Only JavaScript and Python are supported on this server right now.",
      timedOut: false,
    };
  } finally {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  }
}

module.exports = { execute };