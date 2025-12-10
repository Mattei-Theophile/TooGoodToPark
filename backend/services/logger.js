const fs = require("fs");
const path = require("path");
const colors = require("colors");

// Ensure logs directory exists
const logsDir = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logFilePath = path.join(logsDir, "api.log");

function maskSensitive(obj) {
  if (!obj || typeof obj !== "object") return obj;
  const clone = Array.isArray(obj) ? [] : {};
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === "object") {
      clone[k] = maskSensitive(v);
    } else {
      const keyLower = k.toLowerCase();
      if (
        ["password", "pass", "token", "authorization", "refreshToken"].some(
          (s) => keyLower.includes(s.toLowerCase()),
        )
      ) {
        clone[k] = "***";
      } else {
        clone[k] = v;
      }
    }
  }
  return clone;
}

function writeLog(line) {
  const message = line + "\n";
  try {
    fs.appendFileSync(logFilePath, message);
  } catch (e) {
    // Fallback to console if file write fails
    console.error("Log write error:", e);
    console.log(message);
  }
}

// Middleware to log incoming request and outgoing response
function apiLogger(req, res, next) {
  const start = process.hrtime.bigint();
  const time = new Date().toISOString();

  const requestInfo = {
    time,
    method: req.method,
    path: req.originalUrl || req.url,
    ip: req.ip,
    query: maskSensitive(req.query),
    headers: maskSensitive({
      "user-agent": req.headers["user-agent"],
      "content-type": req.headers["content-type"],
      authorization: req.headers["authorization"] ? "***" : undefined,
      cookie: req.headers["cookie"] ? "***" : undefined,
    }),
    body: maskSensitive(req.body),
  };

  // Capture response body by wrapping res.json and res.send
  let capturedBody;
  const origJson = res.json.bind(res);
  const origSend = res.send.bind(res);

  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;
    const responseInfo = {
      statusCode: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
      body:
        typeof capturedBody === "object"
          ? maskSensitive(capturedBody)
          : capturedBody,
    };

    const logLine = JSON.stringify({
      level: "info",
      type: "api",
      request: requestInfo,
      response: responseInfo,
    });
    writeLog(logLine);
    // Also log to console in development (with colors)
    if (process.env.NODE_ENV !== "production") {
      const method = requestInfo.method;
      const status = responseInfo.statusCode;
      const ms = responseInfo.durationMs;

      // Color by HTTP method
      const methodColored =
        method === "GET"
          ? colors.cyan(method)
          : method === "POST"
            ? colors.green(method)
            : method === "PUT"
              ? colors.yellow(method)
              : method === "DELETE"
                ? colors.red(method)
                : colors.white(method);

      // Color by status code class
      const statusColored =
        status >= 500
          ? colors.bgRed.white.bold(` ${status} `)
          : status >= 400
            ? colors.yellow.bold(status.toString())
            : status >= 300
              ? colors.blue(status.toString())
              : colors.green(status.toString());

      const durationColored =
        ms > 1000
          ? colors.red(`${ms}ms`)
          : ms > 300
            ? colors.yellow(`${ms}ms`)
            : colors.gray(`${ms}ms`);
      const pathStr = colors.white(requestInfo.path);

      // Concise colored summary line
      console.log(
        `${methodColored} ${pathStr} -> ${statusColored} ${durationColored}`,
      );

      // Optionally print masked body summary in verbose mode
      if (process.env.LOG_VERBOSE === "1") {
        const bodyPreview =
          requestInfo.body && Object.keys(requestInfo.body).length
            ? colors.gray(JSON.stringify(requestInfo.body))
            : colors.gray("{}");
        console.log(`  req ${bodyPreview}`);
        if (responseInfo && typeof responseInfo.body !== "undefined") {
          const resPreview =
            typeof responseInfo.body === "object"
              ? JSON.stringify(responseInfo.body)
              : String(responseInfo.body);
          console.log(`  res ${colors.gray(resPreview)}`);
        }
      }
    }
  });

  next();
}

module.exports = { apiLogger };
