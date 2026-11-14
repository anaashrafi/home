// Runs before dev/build/test. Kept as plain CommonJS with no modern syntax so it
// still runs (and explains the problem) on old Node versions.
var fs = require("fs");
var path = require("path");

var wanted = fs.readFileSync(path.join(__dirname, "..", ".nvmrc"), "utf8").trim();
var wantedMajor = parseInt(wanted.split(".")[0], 10);
var currentMajor = parseInt(process.versions.node.split(".")[0], 10);

if (currentMajor < wantedMajor) {
  console.error(
    "\n  ✖ This project needs Node " + wanted + " (you are on " + process.version + ").\n\n" +
    "    Fix:  nvm use            (reads .nvmrc)\n" +
    "    Then: npm start\n\n" +
    "    Make it the default for new terminals:  nvm alias default " + wantedMajor + "\n"
  );
  process.exit(1);
}
