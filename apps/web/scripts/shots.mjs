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

const PAGES = ["/", "/welcome", "/pdf", "/pdf/merge", "/pdf/split", "/jobs"];
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
 * The AI surfaces only exist once something is opened, so a plain page load
 * never sees them. Each of these opens one and shoots the viewport.
 */
const STATES = [
  {
    name: "palette",
    open: async (page) => {
      await page.keyboard.down("Meta");
      await page.keyboard.press("k");
      await page.keyboard.up("Meta");
      await page.type(".aio-cmd-input input", "pdf");
      await page.waitForSelector(".aio-cmd-item");
    },
  },
  {
    name: "assistant",
    // On the home page at 1440 the assistant is already docked in the rail,
    // so the launcher only exists on the marketing page at that width.
    path: "/welcome",
    open: async (page) => {
      await page.click(".aio-p-launcher");
      await page.waitForSelector(".aio-assist-foot");
    },
  },
  {
    name: "drawer",
    // The sidebar is the navigation, and below 1024 it only exists after a
    // tap, so it never gets looked at otherwise.
    open: async (page) => {
      await page.click(".aio-p-drawerclose");
      await page.waitForFunction(
        () =>
          document.querySelector(".aio-shell")?.getAttribute("data-drawer") ===
          "open",
      );
      await new Promise((resolve) => setTimeout(resolve, 300));
    },
  },
  {
    name: "mega",
    path: "/welcome",
    open: async (page) => {
      // Hover, never click: a click on the trigger navigates to /pdf.
      await page.hover(".aio-nav-links a");
      await page.waitForSelector(".aio-p-mega", { timeout: 5000 });
    },
  },
];

for (const width of [390, 1440]) {
  for (const state of STATES) {
    // The mega menu is desktop-only; the drawer is the opposite.
    if (state.name === "mega" && width < 1024) continue;
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
