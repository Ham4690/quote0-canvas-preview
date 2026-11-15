import assert from "node:assert/strict";
import { test } from "node:test";
import { twToStyle } from "../src/core/tw.js";

test("空・未指定は空オブジェクト", () => {
  assert.deepEqual(twToStyle(""), {});
  assert.deepEqual(twToStyle(undefined), {});
});

test("flex 系クラス", () => {
  assert.deepEqual(twToStyle("flex flex-col w-full h-full"), {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
  });
});

test("justify / items / self", () => {
  assert.deepEqual(twToStyle("justify-between items-center self-end"), {
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "flex-end",
  });
});

test("spacing は 1 単位 = 4px", () => {
  assert.deepEqual(twToStyle("p-4 gap-1 gap-x-2 gap-y-0.5"), {
    padding: "16px",
    gap: "4px",
    columnGap: "8px",
    rowGap: "2px",
  });
});

test("方向別 padding / margin", () => {
  assert.deepEqual(twToStyle("px-2 py-1 pt-3 mb-2 mx-1"), {
    paddingLeft: "8px",
    paddingRight: "8px",
    paddingTop: "12px",
    paddingBottom: "4px",
    marginBottom: "8px",
    marginLeft: "4px",
    marginRight: "4px",
  });
});

test("任意値 w-[..] / h-[..]", () => {
  assert.deepEqual(twToStyle("w-[25%] h-[40px]"), { width: "25%", height: "40px" });
});

test("w-screen / h-screen は実機サイズ", () => {
  assert.deepEqual(twToStyle("w-screen h-screen"), { width: "296px", height: "152px" });
});

test("未対応クラスは無視する", () => {
  assert.deepEqual(twToStyle("flex text-[20px]-NotoSans bogus"), { display: "flex" });
});

test("後勝ちで上書きされる", () => {
  assert.deepEqual(twToStyle("p-2 p-4"), { padding: "16px" });
});
