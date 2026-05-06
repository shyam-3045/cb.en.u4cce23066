const axios = require("axios");

const LOG_API = "http://20.207.122.201/evaluation-service/logs";

const VALID_STACKS = ["backend", "frontend"];
const VALID_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const VALID_PACKAGES = [
  "cache",
  "controller",
  "cron_job",
  "db",
  "domain",
  "handler",
  "repository",
  "route",
  "service",
];

async function Log(stack, level, packageName, message) {
  if (!VALID_STACKS.includes(stack)) {
    console.error(`Invalid stack: ${stack}`);
    return;
  }

  if (!VALID_LEVELS.includes(level)) {
    console.error(`Invalid level: ${level}`);
    return;
  }

  if (!VALID_PACKAGES.includes(packageName)) {
    console.error(`Invalid package: ${packageName}`);
    return;
  }

  if (typeof message !== "string") {
    console.error("Message must be a string");
    return;
  }

  const colors = {
    debug: "\x1b[36m",
    info: "\x1b[32m",
    warn: "\x1b[33m",
    error: "\x1b[31m",
    fatal: "\x1b[35m",
  };
  const reset = "\x1b[0m";
  const color = colors[level] || reset;
  const logData = {
    stack,
    level,
    package: packageName,
    message,
    timestamp: new Date().toISOString(),
  };

  console.log(
    `${color}[${level.toUpperCase()}]${reset} [${packageName}] ${message}`,
  );

  if (!process.env.JWT_TOKEN) {
    return;
  }

  try {
    const response = await axios.post(LOG_API, logData, {
      headers: {
        Authorization: `Bearer ${process.env.JWT_TOKEN}`,
        "Content-Type": "application/json",
      },
      timeout: 5000,
    });

    if (response.status === 200 || response.status === 201) {
      console.log(`  ✓ Log sent (ID: ${response.data?.logID || "N/A"})`);
    }
  } catch (error) {
    if (error.response?.status === 401) {
      console.warn("  ⚠️  Logging API authentication failed (401)");
    } else if (error.response?.status === 403) {
      console.warn("  ⚠️  Logging API forbidden (403)");
    } else if (error.code === "ECONNREFUSED") {
      console.warn(`  ⚠️  Logging API unavailable at ${LOG_API}`);
    } else if (error.code === "ENOTFOUND") {
      console.warn("  ⚠️  Logging API host not found");
    } else if (error.message?.includes("timeout")) {
      console.warn("  ⚠️  Logging API request timeout");
    } else {
      console.warn(`  ⚠️  Logging API error: ${error.message}`);
    }
  }
}

module.exports = Log;
