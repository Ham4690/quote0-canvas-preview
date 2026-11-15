import assert from "node:assert/strict";
import { test } from "node:test";
import { calcOverflow } from "../src/core/screen.js";

test("枠内に収まれば 0", () => {
  assert.deepEqual(calcOverflow({ scrollWidth: 296, scrollHeight: 152 }), { width: 0, height: 0 });
  assert.deepEqual(calcOverflow({ scrollWidth: 100, scrollHeight: 100 }), { width: 0, height: 0 });
});

test("はみ出し量を px で返す", () => {
  assert.deepEqual(calcOverflow({ scrollWidth: 300, scrollHeight: 174 }), { width: 4, height: 22 });
});

test("小数は四捨五入", () => {
  assert.deepEqual(calcOverflow({ scrollWidth: 296.4, scrollHeight: 152.6 }), { width: 0, height: 1 });
});
