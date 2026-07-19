import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["api/handler.ts"],
  bundle: true,
  platform: "node",
  target: "node22",
  format: "cjs",
  outfile: "api/index.js",
  external: [
    "@mongodb-js/zstd",
    "kerberos",
    "snappy",
  ],
  tsconfig: "tsconfig.json",
  sourcemap: false,
  minify: false,
});
