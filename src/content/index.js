/**
 * ======================================================================================
 * SCRIPT DE CONTENIDO (OPTIMIZADO)
 * ======================================================================================
 */

let typeDetect = "faces";
chrome.storage.sync.get(["mode"], ({ mode }) => (typeDetect = mode || "faces"));
chrome.storage.onChanged.addListener(
  ({ mode }) => mode && (typeDetect = mode.newValue)
);

console.log("[Content] Script loaded. Initial mode:", typeDetect);

// --- UTILIDADES MINIMALISTAS ---
const createElement = (tag, cls, txt = "") => {
  const el = document.createElement(tag);
  el.className = cls;
  if (txt) el.textContent = txt;
  return el;
};

const clearResults = (parent) =>
  parent
    .querySelectorAll(".faces, .face-tags-container, .nopor-overlay")
    .forEach((el) => el.remove());

// --- VISUALIZACIÓN ---
function renderResults(parent, data, isAdultMode) {
  console.log("[Content] renderResults data:", data, "isAdult:", isAdultMode);
  if (isAdultMode) {
    const infoDiv = parent.querySelector(".info-overlay");
    if (infoDiv) {
      infoDiv.classList.add("nopor-overlay");
      infoDiv.innerHTML = `Likely Adult: ${
        data.isAdultContent ? "SÍ" : "NO"
      } (${(data.adultScore * 100).toFixed(1)}%)`;
    }
    return;
  }

  const faces = data.faces || [];
  if (!faces.length) {
    parent
      .appendChild(createElement("div", "face-tags-container faces"))
      .appendChild(
        createElement("span", "face-tag", data.raw_text ?? "Sin Coincidencias")
      );
    return;
  }

  const tagContainer = createElement("div", "face-tags-container faces");
  let hasGlobalTag = false;

  faces.forEach(({ box = [0, 0, 0, 0], name, label }) => {
    const txt = name || label || "Rostro";
    const [x, y, x2, y2] = box;

    // Etiqueta global (coord 0)
    if (Math.floor(x + y + x2 + y2) === 0) {
      tagContainer.appendChild(createElement("span", "face-tag", txt));
      hasGlobalTag = true;
    } else {
      // Bounding Box
      const el = createElement("div", "faces face-box");
      el.style.cssText = `left:${x / 10}%; top:${y / 10}%; width:${
        (x2 - x) / 10
      }%; height:${(y2 - y) / 10}%;`;
      el.title = txt;
      el.appendChild(createElement("span", "", txt));
      parent.appendChild(el);
    }
  });

  if (hasGlobalTag) parent.appendChild(tagContainer);
}

// --- CONTROLADOR ---
function analyze(img, btn) {
  console.log("[Content] analyze triggered for:", img.currentSrc || img.src);
  clearResults(img.parentElement);
  if (btn) btn.innerHTML = '<div class="button-spinner"></div>';

  chrome.runtime.sendMessage(
    {
      action: "analyzeImage",
      url: img.currentSrc || img.src,
      mode: typeDetect,
    },
    (res) => {
      console.log("[Content] sendMessage response:", res);
      if (chrome.runtime.lastError || !res.success) {
        console.error(chrome.runtime.lastError || res.error);
        if (btn) btn.textContent = "Analyze";
        alert("Error: " + (res?.error || "Conexión fallida"));
        return;
      }
      if (btn) btn.textContent = "Analyze";
      renderResults(img.parentElement, res.data, typeDetect === "nopor");
    }
  );
}

// --- DOM OBSERVER ---
const injectBtn = (img) => {
  if (img.hasAttribute("data-stop") || img.width < 200) return;
  img.setAttribute("data-stop", "1");
  if (getComputedStyle(img.parentElement).position === "static")
    img.parentElement.classList.add("relative-parent");

  console.log("[Content] injectBtn for:", img.src);
  const btn = createElement("div", "info-overlay", "Analyze");
  btn.onclick = (e) => {
    e.stopPropagation();
    analyze(img, btn);
  };
  img.parentElement.appendChild(btn);
};

const processed = new WeakSet(); // Optimización extra
const observer = new MutationObserver((muts) =>
  muts.forEach((m) =>
    m.addedNodes.forEach((n) => {
      if (n.tagName === "IMG") injectBtn(n);
      else if (n.querySelectorAll) n.querySelectorAll("img").forEach(injectBtn);
    })
  )
);

observer.observe(document.body, { childList: true, subtree: true });
document.querySelectorAll("img").forEach(injectBtn);
