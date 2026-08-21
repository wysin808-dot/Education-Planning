/**
 * 打包成单个自包含 HTML，便于直接发给同事在本地打开测试。
 *
 * 与正式部署的区别只有两点：
 *  1. 启用哈希路由（VITE_HASH_ROUTER=true），使 file:// 与静态子路径下深层链接仍可用；
 *  2. CSS、JS 与品牌图片全部内联，产物不依赖任何同目录资源。
 *
 * 运行方式：node scripts/build-standalone.mjs
 * 产物：dist/bci-planner-standalone.html
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist", "public");

execFileSync("npx", ["vite", "build"], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, VITE_HASH_ROUTER: "true" },
});

let html = readFileSync(path.join(dist, "index.html"), "utf8");

// 内联样式表
for (const href of html.match(/(?<=<link rel="stylesheet"[^>]*href=")[^"]+/g) ?? []) {
  const css = readFileSync(path.join(dist, href.replace(/^\//, "")), "utf8");
  html = html.replace(
    new RegExp(`<link rel="stylesheet"[^>]*href="${href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>`),
    () => `<style>${css}</style>`,
  );
}

// 内联脚本
for (const src of html.match(/(?<=<script[^>]*src=")[^"]+\.js/g) ?? []) {
  const js = readFileSync(path.join(dist, src.replace(/^\//, "")), "utf8");
  html = html.replace(
    new RegExp(`<script[^>]*src="${src.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*></script>`),
    () => `<script type="module">${js}</script>`,
  );
}

// 品牌图片转 data URI
const brandDir = path.join(dist, "brand");
for (const name of readdirSync(brandDir)) {
  const b64 = readFileSync(path.join(brandDir, name)).toString("base64");
  html = html.split(`/brand/${name}`).join(`data:image/png;base64,${b64}`);
}

const outDir = path.join(root, "dist");
mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, "bci-planner-standalone.html");
writeFileSync(out, html, "utf8");
console.log(`单文件已生成：${out}（${(statSync(out).size / 1024 / 1024).toFixed(2)} MB）`);
