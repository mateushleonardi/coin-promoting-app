// check-environment.js
const semver = require('semver');
const os = require('os');

// Get Node.js version
const nodeVersion = process.version;
const minVersion = '18.19.0';

const isVSCode = process.env.TERM_PROGRAM === 'vscode';
const isWindows11 = os.platform() === 'win32' && os.release().startsWith('10.0.22');

if (!semver.satisfies(nodeVersion, `>=${minVersion}`)) {
  console.error(`Error: Node.js version must be at least ${minVersion}. Current version: ${nodeVersion}`);
  process.exit(1);
}

if (isVSCode && isWindows11) {
  console.error('Error: Running the project in a VSCode terminal is not supported. Please use a regular terminal without a VSCode.');
  process.exit(1);
}

// Run the project in only Codespaces terminal
const isCodespaces = !!process.env.CODESPACES;
if (isCodespaces) {
  console.log("Running the project in Codespaces terminal.");
}

const isGitpod = !!process.env.GITPOD_WORKSPACE_URL;
const isCodeSandbox = !!process.env.SANDBOX;
if (isGitpod || isCodeSandbox) {
  console.error("Error: Running the project in this terminal is not supported. Please use a regular terminal.");
  process.exit(1);
}

console.log('Environment check passed.');
