// Wraps `shadcn add`. On this setup the shadcn CLI (4.22) rewrites the `cn` import to the bare
// module "cn" and installs an unrelated npm package of that name, so every add is followed by
// pointing the import back at our utils and dropping that package again.
import { execSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const UI_DIR = "src/modules/common/components/ui";
const UTILS_IMPORT = '"@/modules/common/lib/utils"';

const args = process.argv.slice(2).join(" ");
execSync(`yarn shadcn add ${args}`, { stdio: "inherit" });

for (const file of readdirSync(UI_DIR)) {
  const path = join(UI_DIR, file);
  const source = readFileSync(path, "utf8");
  const fixed = source.replaceAll('from "cn"', `from ${UTILS_IMPORT}`);
  if (fixed !== source) writeFileSync(path, fixed);
}

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
if (pkg.dependencies?.cn) execSync("yarn remove cn", { stdio: "inherit" });
