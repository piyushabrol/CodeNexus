function normalizeOutput(s = "") {
  // trim + normalize newlines + collapse trailing spaces per line
  return s
    .toString()
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

module.exports = { normalizeOutput };