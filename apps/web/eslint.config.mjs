// eslint-config-next 16 ships flat config directly, so the FlatCompat bridge
// the Next starter used is no longer needed.
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const config = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: [
      "node_modules/**",
      // A vendored, minified pdf.js worker. Not our code to lint.
      "public/pdf.worker.min.mjs",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default config;
