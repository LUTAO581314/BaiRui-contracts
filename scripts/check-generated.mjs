import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generatedArtifacts } from "./generate.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
for (const [relative, expected] of await generatedArtifacts()) {
  const target = path.join(root, relative);
  if (!fs.existsSync(target)) failures.push(`${relative} is missing`);
  else if (fs.readFileSync(target, "utf8") !== expected) failures.push(`${relative} is stale; run npm run generate`);
}
if (failures.length) {
  for (const failure of failures) process.stderr.write(`${failure}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write("Generated contracts are current.\n");
}
