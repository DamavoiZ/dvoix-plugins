// Checks registry.json the same way the app does (crates/dvoix-core/src/store.rs
// in dvoi-dev/dvoix), so a broken entry fails in CI instead of being skipped
// silently in the app.
import { readFileSync } from "node:fs";

const OFFICIAL_OWNER = "dvoi-dev";
const errors = [];
let registry;
try {
  registry = JSON.parse(readFileSync(new URL("../registry.json", import.meta.url), "utf8"));
} catch (e) {
  console.error(`registry.json is not valid JSON: ${e.message}`);
  process.exit(1);
}

if (registry.version !== 1) errors.push(`"version" must be 1`);
if (!Array.isArray(registry.plugins)) errors.push(`"plugins" must be an array`);

const seen = new Set();
for (const [i, p] of (registry.plugins ?? []).entries()) {
  const at = `plugins[${i}] (${p?.id ?? "?"})`;
  for (const key of ["id", "name", "author", "description", "repo", "channel"]) {
    if (typeof p?.[key] !== "string" || !p[key].trim()) errors.push(`${at}: "${key}" is missing`);
  }
  if (typeof p?.id === "string") {
    if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(p.id)) errors.push(`${at}: id must be lower-case a-z0-9-`);
    if (seen.has(p.id)) errors.push(`${at}: id is used twice`);
    seen.add(p.id);
  }
  if (typeof p?.repo === "string" && !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(p.repo)) {
    errors.push(`${at}: repo must be "owner/name"`);
  }
  if (p?.channel !== "official" && p?.channel !== "community") errors.push(`${at}: channel must be "official" or "community"`);
  if (p?.channel === "official" && p.repo?.split("/")[0].toLowerCase() !== OFFICIAL_OWNER) {
    errors.push(`${at}: only repositories of dvoi-dev can be official`);
  }
}

if (errors.length) {
  for (const e of errors) console.error(e);
  process.exit(1);
}
console.log(`registry.json ok, ${seen.size} plugin(s)`);
