/**
 * Screenshots the app and checks nothing overflows sideways.
 *
 * Drives the Chrome already installed on the machine, so there is no browser
 * to download. Start the dev server first, then:
 *
 *   npm run shots --workspace=@aio/web
 *
 * Images land in .shots/ (git-ignored). Looking at them is the only way to
 * catch a layout bug; a passing build says nothing about whether a menu's
 * rows overlap.
 */
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import puppeteer from "puppeteer-core";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", ".shots");

/** Chrome, wherever this platform keeps it. */
const CHROME_PATHS = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];

const PAGES = ["/", "/learn", "/tollwala", "/welcome", "/pdf", "/pdf/merge", "/pdf/split", "/pdf/organise", "/pdf/to-images", "/pdf/from-images", "/tax", "/ats", "/jobs", "/dev/kitchen-sink"];
const WIDTHS = [390, 768, 1440];

async function findChrome() {
  const { existsSync } = await import("node:fs");
  const found = CHROME_PATHS.find((p) => existsSync(p));
  if (!found) {
    throw new Error(
      `No Chrome found. Set CHROME=/path/to/chrome, or install Google Chrome.`,
    );
  }
  return process.env.CHROME ?? found;
}

const browser = await puppeteer.launch({
  executablePath: await findChrome(),
  headless: "new",
  args: ["--no-sandbox", "--force-color-profile=srgb"],
});

await mkdir(OUT, { recursive: true });

let problems = 0;

for (const width of WIDTHS) {
  for (const path of PAGES) {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(String(error)));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    await page.setViewport({ width, height: 900, deviceScaleFactor: 2 });
    await page.goto(BASE + path, { waitUntil: "networkidle0", timeout: 45000 });
    await page.evaluate(() => document.fonts.ready);

    const name = `${path === "/" ? "home" : path.slice(1).replaceAll("/", "-")}-${width}`;
    await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: true });

    // A page wider than its viewport means something is pushing it out.
    const overflows = await page.evaluate(
      (w) => document.documentElement.scrollWidth > w + 1,
      width,
    );

    const notes = [];
    if (overflows) notes.push("⚠️ scrolls sideways");
    if (errors.length) notes.push(`⚠️ ${errors.length} console errors: ${errors[0]}`);
    if (notes.length) problems += 1;

    console.log(`${name.padEnd(22)} ${notes.join("  ") || "ok"}`);
    await page.close();
  }
}

/**
 * The palette, AVTAR and the drawer only exist once opened, so a plain page
 * load never sees them. Each of these opens one and shoots the viewport.
 */
const STATES = [
  {
    name: "palette",
    open: async (page) => {
      await page.click('button[aria-label^="Search tools"]');
      await page.waitForSelector('[role="dialog"] input');
      await page.type('[role="dialog"] input', "pdf");
      await page.waitForSelector('[role="option"]');
    },
  },
  {
    name: "avtar",
    open: async (page) => {
      await page.click('button[aria-label^="Ask AVTAR"]');
      await page.waitForSelector("#avtar-input");
      await page.type("#avtar-input", "How do I merge PDFs?");
      await page.keyboard.press("Enter");
      await new Promise((resolve) => setTimeout(resolve, 300));
    },
  },
  {
    name: "avtar-welcome",
    path: "/welcome",
    open: async (page) => {
      await page.click('button[aria-label^="Ask AVTAR"]');
      await page.waitForSelector("#avtar-input");
    },
  },
  {
    name: "drawer",
    // Below 1024 the sidebar only exists after a tap.
    open: async (page) => {
      await page.click('button[aria-label="Open menu"]');
      await new Promise((resolve) => setTimeout(resolve, 350));
    },
  },
];

for (const width of [390, 1440]) {
  for (const state of STATES) {
    if (state.name === "drawer" && width >= 1024) continue;

    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(String(error)));
    await page.setViewport({ width, height: 900, deviceScaleFactor: 2 });
    await page.goto(BASE + (state.path ?? "/"), {
      waitUntil: "networkidle0",
      timeout: 45000,
    });
    await page.evaluate(() => document.fonts.ready);
    await state.open(page);

    const name = `${state.name}-${width}`;
    await page.screenshot({ path: join(OUT, `${name}.png`) });

    const overflows = await page.evaluate(
      (w) => document.documentElement.scrollWidth > w + 1,
      width,
    );
    const notes = [];
    if (overflows) notes.push("⚠️ scrolls sideways");
    if (errors.length) notes.push(`⚠️ ${errors[0]}`);
    if (notes.length) problems += 1;
    console.log(`${name.padEnd(22)} ${notes.join("  ") || "ok"}`);
    await page.close();
  }
}

await browser.close();
console.log(problems === 0 ? `\nAll clear. Images in ${OUT}` : `\n${problems} page(s) need a look.`);
process.exit(problems === 0 ? 0 : 1);
