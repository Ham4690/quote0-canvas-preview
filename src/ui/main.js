import { extractDefault } from "../core/payload.js";
import { measureOverflow, renderInto } from "../render/dom.js";

const input = document.getElementById("input");
const errorBox = document.getElementById("error");
const screen = document.getElementById("screen");
const sampleList = document.getElementById("samples");
const sampleHint = document.getElementById("sample-hint");
const btnDebug = document.getElementById("btn-debug");
const btnClip = document.getElementById("btn-clip");
const stats = {
  w: { box: document.getElementById("stat-w"), value: document.querySelector("#stat-w .v") },
  h: { box: document.getElementById("stat-h"), value: document.querySelector("#stat-h .v") },
};

function showStat(stat, px) {
  stat.value.textContent = px > 0 ? `+${px}px` : "0px";
  stat.box.className = `stat ${px > 0 ? "bad" : "ok"}`;
}

function resetStats() {
  for (const stat of Object.values(stats)) {
    stat.value.textContent = "—";
    stat.box.className = "stat";
  }
}

function render() {
  const raw = input.value.trim();
  screen.innerHTML = "";
  if (!raw) {
    errorBox.classList.remove("show");
    resetStats();
    return;
  }

  let defaultArr;
  try {
    defaultArr = extractDefault(JSON.parse(raw));
  } catch (e) {
    errorBox.textContent = `JSON parse エラー: ${e.message}`;
    errorBox.classList.add("show");
    return;
  }
  errorBox.classList.remove("show");

  const root = renderInto(screen, defaultArr);
  requestAnimationFrame(() => {
    const overflow = measureOverflow(root);
    showStat(stats.w, overflow.width);
    showStat(stats.h, overflow.height);
  });
}

function setMode(debug) {
  screen.setAttribute("data-debug", String(debug));
  btnDebug.classList.toggle("active", debug);
  btnClip.classList.toggle("active", !debug);
}

async function loadSamples() {
  const res = await fetch("samples/index.json");
  if (!res.ok) throw new Error(`samples/index.json: HTTP ${res.status}`);
  return res.json();
}

async function selectSample(sample) {
  const res = await fetch(`samples/${sample.file}`);
  if (!res.ok) throw new Error(`samples/${sample.file}: HTTP ${res.status}`);
  input.value = JSON.stringify(await res.json(), null, 2);
  sampleHint.textContent = sample.description || "";
  render();
}

function addChip(label, kind, onClick) {
  const chip = document.createElement("button");
  chip.className = `chip ${kind || ""}`.trim();
  chip.textContent = label;
  chip.addEventListener("click", () => {
    onClick().catch(showLoadError);
  });
  sampleList.appendChild(chip);
}

function showLoadError(e) {
  errorBox.textContent = `サンプル読み込みエラー: ${e.message}\n(file:// では動かない。\`npm start\` 等でローカルサーバー経由で開くこと)`;
  errorBox.classList.add("show");
}

async function init() {
  input.addEventListener("input", render);
  btnDebug.addEventListener("click", () => setMode(true));
  btnClip.addEventListener("click", () => setMode(false));

  try {
    const { samples, default: defaultId } = await loadSamples();
    for (const sample of samples) {
      addChip(sample.label, sample.kind, () => selectSample(sample));
    }
    addChip("クリア", "", async () => {
      input.value = "";
      sampleHint.textContent = "";
      render();
    });
    const initial = samples.find((s) => s.id === defaultId) || samples[0];
    if (initial) await selectSample(initial);
  } catch (e) {
    showLoadError(e);
  }
}

init();
