import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://areelive.com";

type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

interface SitemapEntry {
  path: string;
  changefreq?: ChangeFreq;
  priority?: string;
}

// Build/deploy timestamp — evaluated once at module load, so lastmod refreshes on every deploy.
const BUILD_LASTMOD = new Date().toISOString().slice(0, 10);

// Per-path overrides for changefreq/priority. Any route not listed here still gets included
// with sensible defaults, so new public pages added under src/routes/ appear automatically.
const OVERRIDES: Record<string, { changefreq?: ChangeFreq; priority?: string }> = {
  "/": { changefreq: "weekly", priority: "1.0" },
  "/join": { changefreq: "weekly", priority: "0.9" },
  "/invite-broadcaster": { changefreq: "weekly", priority: "0.8" },
  "/contact": { changefreq: "monthly", priority: "0.5" },
  "/support": { changefreq: "monthly", priority: "0.5" },
  "/privacy": { changefreq: "monthly", priority: "0.4" },
  "/terms": { changefreq: "monthly", priority: "0.4" },
  "/referral-policy": { changefreq: "monthly", priority: "0.4" },
  "/cookies": { changefreq: "monthly", priority: "0.3" },
  "/auth": { changefreq: "monthly", priority: "0.3" },
};

// Paths (or path prefixes) to exclude — non-public, auth-gated, or utility routes.
const EXCLUDE_PREFIXES = ["/_", "/admin", "/api", "/sitemap.xml"];

// Static role list mirrors the /join/$role loader's supported values.
const JOIN_ROLES = ["creator", "agency", "merchant", "admin", "recruiter", "agency_manager"];

// Enumerate every route file under src/routes at build time. Vite inlines this glob,
// so new files added under src/routes/ automatically show up in the sitemap on next build.
const ROUTE_MODULES = import.meta.glob("./**/*.tsx", { eager: false });

function filenameToPath(file: string): string | null {
  // file is like "./index.tsx", "./join.tsx", "./join.$role.tsx", "./_authenticated/admin.tsx"
  let p = file.replace(/^\.\//, "").replace(/\.tsx$/, "");
  // strip pathless / layout segments prefixed with "_" (e.g. _authenticated)
  const parts = p.split("/").flatMap((seg) => seg.split("."));
  const cleaned: string[] = [];
  for (const seg of parts) {
    if (seg.startsWith("_")) return null; // auth-gated / layout — skip
    if (seg === "index") continue;
    cleaned.push(seg);
  }
  const url = "/" + cleaned.join("/");
  return url === "" ? "/" : url;
}

function collectStaticPaths(): string[] {
  const paths = new Set<string>(["/"]);
  for (const file of Object.keys(ROUTE_MODULES)) {
    // skip route-tree gen file and this sitemap file itself
    if (file.includes("routeTree") || file.includes("sitemap")) continue;
    // skip server-only api handlers
    if (file.startsWith("./api/")) continue;
    // skip files containing dynamic params — handled separately
    if (file.includes("$")) continue;
    const path = filenameToPath(file);
    if (!path) continue;
    if (EXCLUDE_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))) continue;
    paths.add(path);
  }
  return Array.from(paths);
}

function buildEntries(): SitemapEntry[] {
  const staticPaths = collectStaticPaths();
  const dynamicPaths = JOIN_ROLES.map((r) => `/join/${r}`);
  const all = Array.from(new Set([...staticPaths, ...dynamicPaths])).sort();
  return all.map((path) => ({
    path,
    changefreq: OVERRIDES[path]?.changefreq ?? (path.startsWith("/join") ? "weekly" : "monthly"),
    priority: OVERRIDES[path]?.priority ?? (path.startsWith("/join/") ? "0.7" : "0.6"),
  }));
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = buildEntries();

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            `    <lastmod>${BUILD_LASTMOD}</lastmod>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});