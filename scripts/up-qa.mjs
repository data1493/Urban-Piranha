import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const base = process.argv[2] || "http://127.0.0.1:8080";
mkdirSync("/workspace/screenshots", { recursive: true });

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const errors = [];

async function shot(page, name) {
  await page.screenshot({ path: `/workspace/screenshots/${name}.png`, fullPage: false });
}

async function run(label, viewport, fn) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(`${label} pageerror: ${e.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`${label} console: ${msg.text()}`);
  });
  try {
    await fn(page);
  } catch (e) {
    errors.push(`${label} fail: ${e instanceof Error ? e.message : e}`);
  }
  await context.close();
}

await run("desktop-menu", { width: 1280, height: 800 }, async (page) => {
  await page.goto(`${base}/up`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.waitForTimeout(300);
  const text = await page.locator("body").innerText();
  if (!/Your account/i.test(text)) throw new Error("hamburger missing Your account");
  if (!/Sign in/i.test(text)) throw new Error("hamburger missing Sign in");
  if (!/Track your order/i.test(text)) throw new Error("hamburger missing Track");
  if (!/FAQ/i.test(text)) throw new Error("hamburger missing FAQ");
  await shot(page, "up-menu");
});

await run("mobile-menu", { width: 390, height: 844 }, async (page) => {
  await page.goto(`${base}/up`, { waitUntil: "networkidle" });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  if (overflow) throw new Error("home horizontal overflow");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.waitForTimeout(300);
  const text = await page.locator("body").innerText();
  if (!/Your account/i.test(text)) throw new Error("mobile hamburger missing Your account");
  await shot(page, "up-menu-mobile");
});

await run("search", { width: 390, height: 844 }, async (page) => {
  await page.goto(`${base}/up`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Search" }).click();
  await page.getByLabel("Search the shop").fill("hat");
  await page.waitForTimeout(200);
  const text = await page.locator("body").innerText();
  if (!/59FIFTY/i.test(text)) throw new Error("search hat miss");
  await shot(page, "up-search");
});

await run("hat-pdp", { width: 390, height: 844 }, async (page) => {
  await page.goto(`${base}/up/product/piranha-59fifty`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  const canvas = await page.locator("canvas").count();
  if (!canvas) throw new Error("3D hat canvas missing");
  await shot(page, "up-hat");
  await page.getByRole("button", { name: /Add to bag/ }).click();
  await page.getByRole("link", { name: "View bag" }).click();
  await page.waitForURL("**/up/cart");
  await page.waitForTimeout(400);
  const text = await page.locator("body").innerText();
  if (!/Piranha 59FIFTY/i.test(text)) throw new Error("cart missing hat");
  await shot(page, "up-cart");
  await page.getByRole("link", { name: "Checkout" }).click();
  await page.waitForURL("**/up/checkout");
  await page.waitForTimeout(400);
  await page.getByLabel("Name").fill("Jordan Rider");
  await page.getByLabel("Email").fill("jordan@example.com");
  await page.getByRole("button", { name: /Place order|Pay/ }).click();
  await page.waitForURL("**/up/thanks**", { timeout: 20000 });
  const thanks = await page.locator("body").innerText();
  if (!/Order UP-|Thank you|Locked/i.test(thanks)) throw new Error("thanks page miss");
  await shot(page, "up-thanks");
});

await run("login-faq", { width: 1280, height: 800 }, async (page) => {
  await page.goto(`${base}/login`, { waitUntil: "networkidle" });
  const login = await page.locator("body").innerText();
  if (!/Continue with Google/i.test(login)) throw new Error("login missing Google");
  if (!/Continue with X/i.test(login)) throw new Error("login missing X");
  if (!/Create account/i.test(login)) throw new Error("login missing email signup");
  await shot(page, "up-login");
  await page.goto(`${base}/up/faq`, { waitUntil: "networkidle" });
  const faq = await page.locator("body").innerText();
  if (!/How do I pay/i.test(faq)) throw new Error("faq miss");
  await page.goto(`${base}/up/track`, { waitUntil: "networkidle" });
  const track = await page.locator("body").innerText();
  if (!/Track your order/i.test(track)) throw new Error("track miss");
});

await browser.close();

if (errors.length) {
  console.error(JSON.stringify({ ok: false, errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, errors: [] }));
