import { IMPORTANT_URLS } from "../src/data/urlMap";

const baseUrl = process.env.CHECK_BASE_URL || "http://localhost:3000";

async function main() {
  const results = await Promise.all(
    IMPORTANT_URLS.map(async path => {
      const url = new URL(path, baseUrl).toString();
      const res = await fetch(url, { redirect: "manual" });
      return { path, status: res.status };
    })
  );

  let failed = false;
  for (const result of results) {
    const ok = result.status >= 200 && result.status < 400;
    if (!ok) failed = true;
    console.log(`${ok ? "OK" : "FAIL"} ${result.status} ${result.path}`);
  }

  if (failed) process.exit(1);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
