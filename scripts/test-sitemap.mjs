#!/usr/bin/env node
/**
 * Automated sitemap test.
 *
 * 1. Spins up Vite in middleware mode (no HTTP server) so `import.meta.glob`
 *    and TypeScript resolve exactly the way they do in a real build.
 * 2. Loads src/routes/sitemap[.]xml.ts through Vite's SSR module loader and
 *    invokes the actual GET handler — the same code that serves
 *    /sitemap.xml in production.
 * 3. Parses the returned XML, extracts every <loc>, and asserts the URL
 *    set matches the computed public-routes list (from the filesystem,
 *    using the same exclusion rules as scripts/validate-sitemap.mjs).
 *
 * Run: `node ./scripts/test-sitemap.mjs`
 * Also wired to `bun run test:sitemap`.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { createServer } from "vite";

const ROUTES_DIR = "src/routes";
const BASE_URL = "https://areelive.com";
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
const toPosix = (p) => p.split(sep).join("/");

function filenameToPath(rel) {
  const parts = rel
    .replace(/\.tsx$/, "")
    .split("/")
    .flatMap((seg) => seg.split("."));
  const cleaned = [];
  for (const seg of parts) {
    if (seg.startsWith("_")) return null;
    if (seg === "index") continue;
    cleaned.push(seg);
  }
  const url = "/" + cleaned.join("/");
  return url === "" ? "/" : url;
}

function computeExpectedPublicPaths() {
  const paths = new Set(["/"]);
  for (const abs of walk(ROUTES_DIR)) {
    const rel = toPosix(relative(ROUTES_DIR, abs));
    if (
      rel.includes("routeTree") ||
      rel.startsWith("sitemap") ||
      rel === "__root.tsx"
    )
      continue;
    const path = filenameToPath(rel);
    if (!path) continue;
    if (path.includes("$")) continue;
    if (EXCLUDE_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`)))
      continue;
    paths.add(path);
  }
  for (const r of JOIN_ROLES) paths.add(`/join/${r}`);
  return paths;
}

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

let vite;
let module;

test.before(async () => {
  vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "error",
  });
  module = await vite.ssrLoadModule("/src/routes/sitemap[.]xml.ts");
});

test.after(async () => {
  if (vite) await vite.close();
});

test("sitemap.xml contains exactly the computed public routes", async () => {
  const handler = module.Route?.options?.server?.handlers?.GET;
  assert.ok(typeof handler === "function", "GET handler not found on Route");

  const res = await handler({ request: new Request(`${BASE_URL}/sitemap.xml`) });
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type") ?? "", /xml/);

  const xml = await res.text();
  const locs = extractLocs(xml);
  const actual = new Set(
    locs.map((u) => u.replace(BASE_URL, "")).map((p) => p || "/"),
  );

  const expected = computeExpectedPublicPaths();

  const missing = [...expected].filter((p) => !actual.has(p)).sort();
  const extra = [...actual].filter((p) => !expected.has(p)).sort();

  assert.deepEqual(
    { missing, extra },
    { missing: [], extra: [] },
    `Sitemap URLs do not match computed public routes.\n  missing: ${JSON.stringify(missing)}\n  extra:   ${JSON.stringify(extra)}`,
  );

  // Also assert every entry has a <lastmod>.
  const urlBlocks = xml.match(/<url>[\s\S]*?<\/url>/g) ?? [];
  assert.equal(urlBlocks.length, actual.size, "url block count mismatch");
  for (const block of urlBlocks) {
    assert.match(block, /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/, "missing lastmod");
  }

  // And that no gated / non-public prefix leaked in.
  for (const p of actual) {
    for (const bad of EXCLUDE_PREFIXES) {
      assert.ok(
        !(p === bad || p.startsWith(`${bad}/`)),
        `Non-public route leaked into sitemap: ${p}`,
      );
    }
  }
});