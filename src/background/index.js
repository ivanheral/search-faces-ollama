import { MODES_PROMPTS, DEFAULT_CONFIG } from "/src/config/constants.js";
import { blobToBase64, normalizeEndpoint } from "/src/utils/index.js";

/**
 * ======================================================================================
 * SERVICIOS DE API (OLLAMA)
 * ======================================================================================
 */

async function fetchVisionModels(apiEndpoint) {
  const endpoint = normalizeEndpoint(apiEndpoint);
  console.log("[Background] fetchVisionModels from:", endpoint);
  const response = await fetch(`${endpoint}/api/tags`);
  if (!response.ok) throw new Error("Fallo al obtener modelos");
  const data = await response.json();

  // Filtramos por palabras clave conocidas de modelos visuales
  const filtered = data.models
    .filter((m) => {
      const name = m.name.toLowerCase();
      const families = m.details?.families || [];
      return ["vision"].some((k) => name.includes(k) || families.includes(k));
    })
    .map((m) => m.name);

  console.log("[Background] Models found:", filtered);
  return filtered;
}

async function analyzeImageWithOllama(url, mode, config) {
  const model = config.modelName || DEFAULT_CONFIG.modelName;
  const endpoint = normalizeEndpoint(config.apiEndpoint);
  console.log(
    `[Background] analyzeImageWithOllama | URL: ${url} | Model: ${model} | Mode: ${mode}`
  );

  // 1. Descargar y Codificar
  const imgRes = await fetch(url);
  if (!imgRes.ok) throw new Error(`Error descarga: ${imgRes.statusText}`);
  const base64Image = await blobToBase64(await imgRes.blob());

  // 2. Enviar a Ollama
  const response = await fetch(`${endpoint}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [
        { role: "user", content: MODES_PROMPTS[mode], images: [base64Image] },
      ],
      stream: false,
      format: "json",
    }),
  });

  // 3. Errores y Respuesta
  if (!response.ok)
    throw new Error(
      response.status === 403 ? "Forbidden CORS" : response.statusText
    );

  const content = (await response.json()).message?.content || "{}";
  try {
    const json = JSON.parse(content);
    console.log("[Background] Analysis Result:", json);
    return json;
  } catch (err) {
    console.warn(
      "[Background] JSON parse failed, returning raw text. content:",
      content
    );
    return { raw_text: content };
  }
}

/**
 * ======================================================================================
 * LISTENER PRINCIPAL (MESSAGING)
 * ======================================================================================
 */
chrome.runtime.onMessage.addListener(
  ({ action, url, mode }, _, sendResponse) => {
    console.log("[Background] onMessage received action:", action);
    if (action === "listModels") {
      chrome.storage.sync.get(["apiEndpoint"], ({ apiEndpoint }) =>
        fetchVisionModels(apiEndpoint)
          .then((models) => sendResponse({ success: true, models }))
          .catch((e) => sendResponse({ success: false, error: e.message }))
      );
      return true;
    }

    if (action === "analyzeImage") {
      chrome.storage.sync.get(["modelName", "apiEndpoint"], (cfg) =>
        analyzeImageWithOllama(url, mode, cfg)
          .then((data) => sendResponse({ success: true, data }))
          .catch((e) => sendResponse({ success: false, error: e.message }))
      );
      return true;
    }
  }
);
