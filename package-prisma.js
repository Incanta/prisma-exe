/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync } = require("child_process");

const rootPath = path.resolve(__dirname);
const distPath = path.join(rootPath, "dist");
const outPath = distPath;

const prismaPackageJsonPath = path.join(
  rootPath,
  "node_modules",
  "prisma",
  "package.json"
);
let prismaPackageJson = fs.readFileSync(prismaPackageJsonPath, "utf-8");

try {
  fs.rmSync(
    path.join(outPath, `prisma${os.platform() === "win32" ? ".exe" : ""}`)
  );
} catch (e) {
  //
}

if (!prismaPackageJson.includes(`,"pkg":`)) {
  prismaPackageJson = prismaPackageJson.replace(
    /^}/m,
    `  ,"pkg": {
    "targets": ["node22-x64"],
    "outputPath": "${path
      .relative(process.cwd(), outPath)
      .replace(/\\/g, "/")}",
    "assets": [
      "../@prisma/engines/*.node",
      "../@prisma/engines/schema-engine*",
      "./build/prisma_schema_build_bg.wasm"
    ]
  }
}`
  );
  fs.writeFileSync(prismaPackageJsonPath, prismaPackageJson);
}

execSync("npx pkg node_modules/prisma", { stdio: "inherit" });
