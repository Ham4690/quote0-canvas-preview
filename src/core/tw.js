// tw(Tailwind 風ユーティリティ)文字列を CSS プロパティ(camelCase)のオブジェクトへ変換する。
// 主要な flex / spacing 系のみ簡易解釈する。未対応クラスは無視する。
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./screen.js";

const NUM = "(\\d+(?:\\.\\d+)?)";
const spacing = (n) => `${parseFloat(n) * 4}px`;

const JUSTIFY = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
};
const ALIGN = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
  baseline: "baseline",
};
const SIDE = { t: "Top", b: "Bottom", l: "Left", r: "Right" };

// [正規表現, マッチ結果 → スタイル] の表。上から最初に一致したものを採用する。
const RULES = [
  [/^flex$/, () => ({ display: "flex" })],
  [/^flex-col$/, () => ({ flexDirection: "column" })],
  [/^flex-row$/, () => ({ flexDirection: "row" })],
  [/^flex-wrap$/, () => ({ flexWrap: "wrap" })],
  [/^(?:grow|flex-grow)$/, () => ({ flexGrow: "1" })],
  [/^shrink-0$/, () => ({ flexShrink: "0" })],
  [/^w-full$/, () => ({ width: "100%" })],
  [/^h-full$/, () => ({ height: "100%" })],
  [/^w-screen$/, () => ({ width: `${SCREEN_WIDTH}px` })],
  [/^h-screen$/, () => ({ height: `${SCREEN_HEIGHT}px` })],
  [/^w-\[(.+)\]$/, (m) => ({ width: m[1] })],
  [/^h-\[(.+)\]$/, (m) => ({ height: m[1] })],
  [/^justify-(start|center|end|between|around|evenly)$/, (m) => ({ justifyContent: JUSTIFY[m[1]] })],
  [/^items-(start|center|end|stretch|baseline)$/, (m) => ({ alignItems: ALIGN[m[1]] })],
  [/^self-(start|center|end|stretch|auto)$/, (m) => ({ alignSelf: m[1] === "auto" ? "auto" : ALIGN[m[1]] })],
  [new RegExp(`^gap-x-${NUM}$`), (m) => ({ columnGap: spacing(m[1]) })],
  [new RegExp(`^gap-y-${NUM}$`), (m) => ({ rowGap: spacing(m[1]) })],
  [new RegExp(`^gap-${NUM}$`), (m) => ({ gap: spacing(m[1]) })],
  [new RegExp(`^p-${NUM}$`), (m) => ({ padding: spacing(m[1]) })],
  [new RegExp(`^px-${NUM}$`), (m) => ({ paddingLeft: spacing(m[1]), paddingRight: spacing(m[1]) })],
  [new RegExp(`^py-${NUM}$`), (m) => ({ paddingTop: spacing(m[1]), paddingBottom: spacing(m[1]) })],
  [new RegExp(`^p([tblr])-${NUM}$`), (m) => ({ [`padding${SIDE[m[1]]}`]: spacing(m[2]) })],
  [new RegExp(`^m-${NUM}$`), (m) => ({ margin: spacing(m[1]) })],
  [new RegExp(`^mx-${NUM}$`), (m) => ({ marginLeft: spacing(m[1]), marginRight: spacing(m[1]) })],
  [new RegExp(`^my-${NUM}$`), (m) => ({ marginTop: spacing(m[1]), marginBottom: spacing(m[1]) })],
  [new RegExp(`^m([tblr])-${NUM}$`), (m) => ({ [`margin${SIDE[m[1]]}`]: spacing(m[2]) })],
  [/^text-(left|center|right)$/, (m) => ({ textAlign: m[1] })],
  [/^rounded$/, () => ({ borderRadius: "4px" })],
  [new RegExp(`^rounded-${NUM}$`), (m) => ({ borderRadius: spacing(m[1]) })],
  [/^overflow-hidden$/, () => ({ overflow: "hidden" })],
];

export function twToStyle(tw) {
  const out = {};
  if (!tw) return out;
  for (const cls of tw.split(/\s+/).filter(Boolean)) {
    for (const [re, toStyle] of RULES) {
      const m = cls.match(re);
      if (m) {
        Object.assign(out, toStyle(m));
        break;
      }
    }
  }
  return out;
}
