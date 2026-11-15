import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizeStyle } from "../src/core/style.js";

test("未指定は空オブジェクト", () => {
  assert.deepEqual(normalizeStyle(undefined), {});
});

test("数値は px を付ける", () => {
  assert.deepEqual(normalizeStyle({ fontSize: 28, width: 10 }), { fontSize: "28px", width: "10px" });
});

test("単位なしキーは数値のまま", () => {
  assert.deepEqual(normalizeStyle({ fontWeight: 700, lineHeight: 1.2, opacity: 0.5, flexGrow: 1 }), {
    fontWeight: 700,
    lineHeight: 1.2,
    opacity: 0.5,
    flexGrow: 1,
  });
});

test("文字列はそのまま", () => {
  assert.deepEqual(normalizeStyle({ width: "48%", alignSelf: "flex-end" }), {
    width: "48%",
    alignSelf: "flex-end",
  });
});
