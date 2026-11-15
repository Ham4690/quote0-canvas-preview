import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { extractDefault } from "../src/core/payload.js";

const dir = new URL("../samples/", import.meta.url);
const readJSON = async (name) => JSON.parse(await readFile(new URL(name, dir), "utf8"));

test("samples/index.json の全ファイルが存在し、Canvas ペイロードとして解釈できる", async () => {
  const { samples, default: defaultId } = await readJSON("index.json");
  assert.ok(samples.length > 0);
  assert.ok(samples.some((s) => s.id === defaultId), "default が samples に存在する");
  assert.equal(new Set(samples.map((s) => s.id)).size, samples.length, "id が重複しない");

  for (const sample of samples) {
    const payload = await readJSON(sample.file);
    assert.ok(extractDefault(payload).length > 0, `${sample.file} に描画ノードがある`);
  }
});
