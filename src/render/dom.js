// Canvas ノード木 → DOM 生成。ブラウザの flexbox による近似描画。
import { calcOverflow } from "../core/screen.js";
import { normalizeStyle } from "../core/style.js";
import { twToStyle } from "../core/tw.js";

function applyStyles(el, styles) {
  for (const key of Object.keys(styles)) {
    try {
      el.style[key] = styles[key];
    } catch {
      // 未知の style キーは無視する。
    }
  }
}

export function renderNode(node) {
  if (node == null) return document.createTextNode("");
  if (typeof node === "string" || typeof node === "number") {
    return document.createTextNode(String(node));
  }
  if (Array.isArray(node)) {
    const frag = document.createDocumentFragment();
    node.forEach((n) => frag.appendChild(renderNode(n)));
    return frag;
  }

  const el = document.createElement(node.type === "span" ? "span" : "div");
  const props = node.props || {};
  applyStyles(el, twToStyle(props.tw));
  applyStyles(el, normalizeStyle(props.style));

  if (node.type === "img") {
    el.style.border = "1px dashed #999";
    el.style.fontSize = "10px";
    el.style.color = "#999";
    el.textContent = "[img: 本プレビュー未対応]";
  } else if (props.children != null) {
    el.appendChild(renderNode(props.children));
  }
  return el;
}

// default 配列を screen 要素内に描画し、ルート要素を返す。
export function renderInto(screen, defaultArr) {
  screen.innerHTML = "";
  const root = document.createElement("div");
  root.className = "root-el";
  root.style.width = "100%";
  root.style.height = "100%";
  defaultArr.forEach((n) => root.appendChild(renderNode(n)));
  screen.appendChild(root);
  return root;
}

export function measureOverflow(root) {
  return calcOverflow({ scrollWidth: root.scrollWidth, scrollHeight: root.scrollHeight });
}
