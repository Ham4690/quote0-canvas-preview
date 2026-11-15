import assert from "node:assert/strict";
import { test } from "node:test";
import { extractDefault } from "../src/core/payload.js";

const nodes = [{ type: "div", props: { children: "x" } }];

test("default 配列そのもの", () => {
  assert.equal(extractDefault(nodes), nodes);
});

test("windowData 単体", () => {
  assert.equal(extractDefault({ default: nodes }), nodes);
});

test("CanvasPayload 全体", () => {
  assert.equal(extractDefault({ windowData: { default: nodes }, refreshNow: true }), nodes);
});

test("どの形式でもなければ例外", () => {
  assert.throws(() => extractDefault({ foo: 1 }), /windowData\.default/);
  assert.throws(() => extractDefault(null), /windowData\.default/);
});
