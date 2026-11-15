// props.style の値をそのまま適用するための正規化。数値は単位なし扱いのキーを除き px にする。
const UNITLESS = new Set([
  "fontWeight",
  "lineHeight",
  "opacity",
  "zIndex",
  "flex",
  "flexGrow",
  "flexShrink",
  "order",
]);

export function normalizeStyle(style) {
  const out = {};
  if (!style) return out;
  for (const key of Object.keys(style)) {
    const val = style[key];
    out[key] = typeof val === "number" && !UNITLESS.has(key) ? `${val}px` : val;
  }
  return out;
}
