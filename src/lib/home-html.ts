import { readFileSync } from "node:fs";
import { join } from "node:path";

export function getHomeBodyHtml() {
  const html = readFileSync(join(process.cwd(), "src/content/home.html"), "utf8");
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;

  return body
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<link[^>]+styles\.css[^>]*>/gi, "")
    .replaceAll("./assets/", "/assets/")
    .replaceAll('href="#work"', 'href="#life"');
}
