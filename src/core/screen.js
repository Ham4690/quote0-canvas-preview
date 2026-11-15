// 実機画面サイズ。Image API ドキュメント記載値を転用(Canvas API ドキュメントには寸法記載なし。未検証)。
export const SCREEN_WIDTH = 296;
export const SCREEN_HEIGHT = 152;

// 描画結果の scrollWidth / scrollHeight から、画面枠をはみ出す px を求める。
export function calcOverflow({ scrollWidth, scrollHeight }) {
  return {
    width: Math.max(0, Math.round(scrollWidth - SCREEN_WIDTH)),
    height: Math.max(0, Math.round(scrollHeight - SCREEN_HEIGHT)),
  };
}
