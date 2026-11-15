# quote0-canvas-preview

Quote/0 の Canvas API に送る `windowData` JSON を、実機画面サイズ(296×152px)の枠でプレビューし、レイアウトの見切れを送信前に確認するツール。

- 公開 URL: `https://<owner>.github.io/quote0-canvas-preview/`(GitHub Pages 有効化後)
- 関連: [quote0-batch](https://github.com/Ham4690/quote0-batch)(Quote/0 連携バッチ本体)

## 使い方

1. 左の入力欄に JSON を貼る。以下のいずれの形式も認識する。
   - `CanvasPayload` 全体(`{"windowData":{"default":[...]}, ...}`)
   - `windowData` 単体(`{"default":[...]}`)
   - `default` 配列単体(`[...]`)
2. 右のプレビューで赤点線(画面境界)をまたぐ要素がないか確認する。縦横のオーバーフロー量(px)も表示する。
3. 「実機想定(クリップ)」に切り替えると、枠外を切り落とした見え方になる。

## ローカル実行

`fetch` と ES Modules を使うため、`file://` では動かない。ローカルサーバー経由で開く。

```sh
npm start        # http://localhost:8000/
npm test         # core/ の単体テスト (node --test)
```

Node.js 20 以上が必要。外部依存パッケージはない。

## 構成

```
index.html
src/
  core/      # DOM 非依存の純粋ロジック(単体テスト対象)
    payload.js   入力形式の判別・default 配列の抽出
    tw.js        tw 文字列 → CSS 変換
    style.js     props.style の正規化
    screen.js    画面サイズ定数・オーバーフロー計算
  render/
    dom.js       ノード木 → DOM 生成、オーバーフロー計測
  ui/
    main.js      イベント配線・サンプル切替
    styles.css
samples/         # プレビュー用サンプル JSON
  index.json     一覧(id / label / kind / file / description)
test/            # core/ とサンプルの node --test
```

依存方向は `ui → render → core`。`core` は何にも依存しない。

## サンプルの追加

1. `samples/` に JSON ファイルを置く(上記 3 形式のいずれか)。
2. `samples/index.json` の `samples` に `{ id, label, kind, file, description }` を追加する。`kind` は `good` / `bad` / 空文字(チップの色)。
3. `npm test` で存在確認・形式確認が通ることを確かめる。

## 制約・注意

- ブラウザの flexbox による**近似**であり、実機での表示を保証しない。送信前の大まかな見切れ検知用。
- 画面解像度 296×152px は Image API ドキュメントの記載値を転用した未検証値(Canvas API ドキュメントには寸法の記載がない)。
- `tw` は主要な flex / spacing 系のみ簡易解釈する。未対応クラスは無視する。
- `img` ノードはプレースホルダ表示のみ。

## デプロイ

`main` への push で GitHub Actions がテストを実行し、通れば GitHub Pages へ公開する(`.github/workflows/pages.yml`)。
初回のみ、リポジトリの Settings → Pages → Source を **GitHub Actions** に設定する。

## ライセンス

[MIT](LICENSE)
