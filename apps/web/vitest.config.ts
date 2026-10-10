import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // These tests cover the PDF logic, which is plain TypeScript over
    // pdf-lib and runs the same in Node as it does in the browser.
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
