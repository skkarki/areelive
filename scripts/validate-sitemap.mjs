#!/usr/bin/env node
/**
 * Build-time sitemap validation.
 *
 * Walks src/routes/ using the same rules as src/routes/sitemap[.]xml.ts and
 * asserts:
 *   1. Every public route file (non-underscored, not under an excluded prefix)
 *      is covered by the sitemap.
 *   2. No auth-gated / layout / api / admin route slips into the public set.
 *   3. The EXCLUDE_PREFIXES and JOIN_ROLES arrays in the sitemap source
 *      have not drifted from the values this validator enforces.
 *
 * Runs before `vite build` — a failure aborts the build with exit code 1.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROUTES_DIR = "src/routes";
const SITEMAP_SRC = "src/routes/sitemap[.]xml.ts";

// Keep these in lockstep with the sitemap handler.
const EXCLUDE_PREFIXES = ["/_", "/admin", "/api", "/sitemap.xml"];
const JOIN_ROLES = [
  "creator",
  "agency",
  "merchant",
  "admin",
  "recruiter",
  "agency_manager",
];

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, acc);
    else if (name.endsWith(".tsx")) acc.push(p);
  }
  return acc;
}

function toPosix(p) {
  return p.split(sep).join("/");
}

function filenameToPath(relPath) {
  // relPath like "join.$role.tsx" or "_authenticated/admin.index.tsx"
  let p = relPath.replace(/\.tsx$/, "");
  const parts = p.split("/").flatMap((seg) => seg.split("."));
  const cleaned = [];
  for (const seg of parts) {
    if (seg.startsWith("_")) return { path: null, gated: true };
    if (seg === "index") continue;
    cleaned.push(seg);
  }
  const url = "/" + cleaned.join("/");
  return { path: url === "" ? "/" : url, gated: false };
}

function extractArrayLiteral(source, name) {
  const re = new RegExp(`${name}\\s*(?::[^=]+)?=\\s*\\[([\\s\\S]*?)\\]`);
  const m = source.match(re);
  if (!m) throw new Error(`Could not locate ${name} in ${SITEMAP_SRC}`);
  return m[1]
    .split(",")
    .map((s) => s.trim().replace(/^["'`]|["'`]$/g, ""))
    .filter(Boolean);
}

const allFiles = walk(ROUTES_DIR).map((f) => toPosix(relative(ROUTES_DIR, f)));

const publicPaths = new Set(["/"]);
const gatedPaths = [];
const skipped = [];

for (const rel of allFiles) {
  if (
    rel.includes("routeTree") ||
    rel.startsWith("sitemap") ||
    rel === "__root.tsx"
  ) {
    skipped.push(rel);
    continue;
  }
  const { path, gated } = filenameToPath(rel);
  if (gated) {
    // still compute the URL by stripping underscore segments for reporting
    const stripped = rel
      .replace(/\.tsx$/, "")
      .split("/")
      .flatMap((s) => s.split("."))
      .filter((s) => !s.startsWith("_") && s !== "index");
    gatedPaths.push("/" + stripped.join("/"));
    continue;
  }
  if (!path) continue;
  // Dynamic segments — handled explicitly via JOIN_ROLES.
  if (path.includes("$")) continue;
  if (EXCLUDE_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))) {
    continue;
  }
  publicPaths.add(path);
}

for (const r of JOIN_ROLES) publicPaths.add(`/join/${r}`);

// Drift check against the sitemap source itself.
const sitemapSrc = readFileSync(SITEMAP_SRC, "utf8");
const srcExclude = extractArrayLiteral(sitemapSrc, "EXCLUDE_PREFIXES");
const srcRoles = extractArrayLiteral(sitemapSrc, "JOIN_ROLES");

const errors = [];
const sameSet = (a, b) =>
  a.length === b.length && [...a].sort().join("|") === [...b].sort().join("|");

if (!sameSet(srcExclude, EXCLUDE_PREFIXES)) {
  errors.push(
    `EXCLUDE_PREFIXES drift — sitemap.xml.ts has [${srcExclude.join(
      ", ",
    )}] but validator expects [${EXCLUDE_PREFIXES.join(", ")}]`,
  );
}
if (!sameSet(srcRoles, JOIN_ROLES)) {
  errors.push(
    `JOIN_ROLES drift — sitemap.xml.ts has [${srcRoles.join(
      ", ",
    )}] but validator expects [${JOIN_ROLES.join(", ")}]`,
  );
}

for (const g of gatedPaths) {
  if (publicPaths.has(g)) {
    errors.push(`Auth-gated / non-public route leaked into sitemap: ${g}`);
  }
}

const sortedPublic = [...publicPaths].sort();
console.log(`Sitemap validator — ${sortedPublic.length} public URLs:`);
for (const p of sortedPublic) console.log(`  ✓ ${p}`);
if (gatedPaths.length) {
  console.log(`Excluded (auth-gated / non-public):`);
  for (const p of [...new Set(gatedPaths)].sort()) console.log(`  · ${p}`);
}

if (errors.length) {
  console.error("\n✖ Sitemap validation failed:");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log("\n✓ Sitemap validation passed.");