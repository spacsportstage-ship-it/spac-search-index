import { gzipSync } from "node:zlib";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const rootDir = process.cwd();
const workerPath = path.resolve(process.env.SPAC_WORKER_FILE || path.join(rootDir, "cloudflare-spac-search-index-worker.js"));
const outPath = path.resolve(process.env.SPAC_PREPARED_OUT || path.join(rootDir, "dist", "prepared.json"));
const buildFlag = "const PREPARED_BUILD_ENABLED = false;";
const enabledFlag = "const PREPARED_BUILD_ENABLED = true;";

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function main() {
  const started = Date.now();
  const source = await readFile(workerPath, "utf8");

  if (!source.includes(buildFlag)) {
    throw new Error(`Could not find "${buildFlag}" in ${workerPath}`);
  }

  const buildSource = source.replace(buildFlag, enabledFlag);
  const tempWorkerPath = path.join(tmpdir(), `spac-search-worker-build-${process.pid}-${Date.now()}.mjs`);

  try {
    await writeFile(tempWorkerPath, buildSource, "utf8");
    const workerModule = await import(`${pathToFileURL(tempWorkerPath).href}?t=${Date.now()}`);
    const worker = workerModule.default;

    if (!worker || typeof worker.fetch !== "function") {
      throw new Error("Worker module did not expose a fetch handler.");
    }

    const response = await worker.fetch(
      new Request("https://builder.local/prepared.json", {
        headers: { Origin: "https://www.spacsport.nl" },
      }),
      {},
      { waitUntil() {} },
    );

    const body = await response.text();
    if (!response.ok) {
      throw new Error(`Prepared build failed with HTTP ${response.status}: ${body.slice(0, 1000)}`);
    }

    const parsed = JSON.parse(body);
    if (!parsed || !Array.isArray(parsed.products)) {
      throw new Error("Prepared build did not return a products array.");
    }

    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, body, "utf8");

    const gzipBytes = gzipSync(Buffer.from(body)).byteLength;
    const elapsed = Date.now() - started;

    console.log(`Prepared index written: ${outPath}`);
    console.log(`Products: ${parsed.products.length}`);
    console.log(`Version: ${parsed.version || "unknown"}`);
    console.log(`Raw size: ${formatBytes(Buffer.byteLength(body))}`);
    console.log(`Gzip size: ${formatBytes(gzipBytes)}`);
    console.log(`Build time: ${elapsed} ms`);
  } finally {
    await rm(tempWorkerPath, { force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
