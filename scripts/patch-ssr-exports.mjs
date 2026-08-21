import { existsSync, readFileSync, writeFileSync } from "node:fs";

const paths = [
  ".vercel/output/functions/__server.func/_ssr/ssr.mjs",
  "node_modules/.nitro/vite/services/ssr/ssr.mjs",
];

for (const p of paths) {
  if (!existsSync(p)) continue;
  const src = readFileSync(p, "utf8");
  if (!src.includes("ssr_exports as s")) continue;
  const next = src.includes("const ssr_exports")
    ? src
    : src.replace(
        "export {",
        "const ssr_exports = {};\nexport {",
      );
  writeFileSync(p, next);
  console.log("[patch-ssr-exports]", p);
}
