// CanvasPayload / windowData / default 配列のいずれの形式でも default 配列を取り出す。
export function extractDefault(parsed) {
  if (Array.isArray(parsed)) return parsed;
  if (parsed && parsed.windowData && Array.isArray(parsed.windowData.default)) {
    return parsed.windowData.default;
  }
  if (parsed && Array.isArray(parsed.default)) return parsed.default;
  throw new Error(
    "windowData.default 配列が見つからない(CanvasPayload / windowData / default 配列のいずれかの形式を貼ること)",
  );
}
