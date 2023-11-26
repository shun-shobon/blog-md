import * as crypto from "node:crypto";
import * as fs from "node:fs/promises";
import * as path from "node:path";

import sharp from "sharp";
import type { Plugin } from "unified";

import { unreachable } from "../error.js";
import { isLocalPath } from "../is-local-path.js";
import type { Image, LocalImage, Parent, Root } from "./ast.js";
import { isImage } from "./check.js";
import { visit } from "./visit.js";

export type AstarLocalAssetLoaderOptions = {
  assetOutputDir: string;
};

export const astarLocalImageLoader: Plugin<
  [AstarLocalAssetLoaderOptions],
  Root
> = function (option) {
  return async (tree, file) => {
    const dirname = file.dirname;
    if (dirname === undefined) {
      throw new Error("Must have a dirname to load local assets");
    }

    const matches: Array<[node: Image, idx: number, parent: Parent]> = [];
    visit(tree, isImage, (node, idx, parent) => {
      if (idx === undefined || !parent) unreachable();
      matches.push([node, idx, parent]);
    });

    const promises = matches.map(async ([node, idx, parent]) => {
      if (!isLocalPath(node.url)) return;

      const imagePath = path.join(dirname, node.url);

      if (!(await fs.exists(imagePath))) return;

      const ext = path.extname(imagePath);
      const id = await getHash(imagePath);
      const size = await getSize(imagePath);

      const filename = `${id}.${ext}`;
      const outputPath = path.join(option.assetOutputDir, filename);
      await fs.mkdir(option.assetOutputDir, { recursive: true });
      await fs.copyFile(imagePath, outputPath);

      const localImage: LocalImage = {
        type: "localImage",
        id,
        ext,
        size,
        alt: node.alt,
        title: node.title,
        position: node.position,
      };

      parent.children[idx] = localImage;
    });

    await Promise.all(promises);
  };
};

async function getHash(filepath: string): Promise<string> {
  const file = await fs.readFile(filepath);
  const hash = crypto.createHash("sha256").update(file);

  return hash.digest("hex");
}

async function getSize(
  filepath: string,
): Promise<[number, number] | undefined> {
  try {
    const { width, height } = await sharp(filepath).metadata();
    if (width === undefined || height === undefined) return undefined;

    return [width, height];
  } catch {
    /* noop */
  }
}
