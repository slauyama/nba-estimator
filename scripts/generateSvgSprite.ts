import { globSync } from "glob";
import fs from "fs";
import { HTMLElement, parse } from "node-html-parser";
import path from "path";

const svgFiles = globSync("src/svg/*.svg");
const symbols: string[] = [];
const ids: string[] = [];

svgFiles.forEach((file) => {
  const code = fs.readFileSync(file, "utf-8");

  const svgElement = parse(code).querySelector("svg");
  const symbolElement = parse("<symbol/>").querySelector("symbol");

  const fileName = path.basename(file, ".svg");
  ids.push(fileName);

  svgElement?.childNodes.forEach((child) => symbolElement.appendChild(child));

  symbolElement?.setAttribute("id", fileName);

  if (svgElement?.attributes.viewBox) {
    symbolElement?.setAttribute("viewBox", svgElement?.attributes.viewBox);
  }

  symbols.push(symbolElement?.toString() ?? "");
});

const svgSprite = `<svg xmlns="http://www.w3.org/2000/svg"><defs>${symbols.join(
  ""
)}</defs></svg>`;
fs.writeFileSync("public/sprite.svg", svgSprite);

const svgTypes = `export type SvgIds = ${ids
  .map((id) => `"${id}"`)
  .join(" | ")};`;
fs.writeFileSync("app/types/svg.ts", svgTypes);
