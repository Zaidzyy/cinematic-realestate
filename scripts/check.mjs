import { chromium } from "playwright-core";

const EXE = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox"] });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce", // simulate the user's likely OS setting — motion must STILL run
});

const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

await page.goto("http://localhost:3000", { waitUntil: "load", timeout: 60000 }).catch((e) => console.log("GOTO_WARN", e.message));

// Preloader visible early.
await page.waitForTimeout(700);
await page.screenshot({ path: "/tmp/shot-preloader.png" });

// Wait out the preloader (~3s) before measuring/scrolling.
await page.waitForTimeout(3200);
await page.screenshot({ path: "/tmp/shot-hero.png" });

const ids = ["top", "about", "services", "approach", "method", "clients", "contact"];
const present = {};
for (const id of ids) present[id] = (await page.locator("#" + id).count()) > 0;

const total = await page.evaluate(() => document.body.scrollHeight);
const lenisOn = await page.evaluate(() => document.documentElement.classList.contains("lenis"));

// Prove the fly-through actually animates: sample a frame's opacity at two scroll depths.
async function flyOpacity(frac) {
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(total * frac));
  await page.waitForTimeout(700);
  return page.evaluate(() => {
    const el = document.querySelectorAll(".fly__img")[2];
    return el ? Number(getComputedStyle(el).opacity).toFixed(2) : "n/a";
  });
}
console.log("LENIS_ACTIVE:", lenisOn);

// Verify the walkthrough video is wired: readyState + currentTime should advance with scroll.
async function videoState(frac) {
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(total * frac));
  await page.waitForTimeout(900);
  return page.evaluate(() => {
    const v = document.querySelector(".fly__video");
    return v ? { rs: v.readyState, t: +v.currentTime.toFixed(2), dur: +(v.duration || 0).toFixed(2) } : null;
  });
}
const heroVid = await page.evaluate(() => {
  const v = document.querySelector(".hero__video");
  return v ? { rs: v.readyState, paused: v.paused } : null;
});
const vA = await videoState(0.28);
const vB = await videoState(0.42);
console.log("HERO_VIDEO:", JSON.stringify(heroVid));
console.log("WALK_VIDEO@28%:", JSON.stringify(vA), "@42%:", JSON.stringify(vB));

async function scrollTo(frac, wait = 1100) {
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(total * frac));
  await page.waitForTimeout(wait);
}

await scrollTo(0.14);
await page.screenshot({ path: "/tmp/shot-statement.png" });
await scrollTo(0.34);
await page.screenshot({ path: "/tmp/shot-fly1.png" });
await scrollTo(0.46);
await page.screenshot({ path: "/tmp/shot-fly2.png" });
await scrollTo(0.66);
await page.screenshot({ path: "/tmp/shot-process.png" });
await scrollTo(0.82);
await page.screenshot({ path: "/tmp/shot-gallery.png" });
await scrollTo(0.97);
await page.screenshot({ path: "/tmp/shot-cta.png" });

console.log("SECTIONS:", JSON.stringify(present));
console.log("SCROLL_HEIGHT:", total);
console.log("CONSOLE_ERRORS:", errors.length);
errors.slice(0, 25).forEach((e) => console.log("  -", e.slice(0, 180)));
await browser.close();
