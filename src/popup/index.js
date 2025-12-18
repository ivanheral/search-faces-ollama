"use strict";

/**
 * ======================================================================================
 * UTILIDADES DE INTERFAZ (UI UTILS)
 * ======================================================================================
 */

/**
 * Obtiene referencias a los elementos clave del DOM.
 * @returns {Object} Diccionario con los elementos HTML.
 */
function getUIElements() {
  return {
    modelName: document.getElementById("modelName"),
    apiEndpoint: document.getElementById("apiEndpoint"),
    selectApi: document.getElementById("selectApi"),
    modelList: document.getElementById("modelList"),
  };
}

/**
 * ======================================================================================
 * GESTIÓN DE CONFIGURACIÓN (STORAGE)
 * ======================================================================================
 */

/**
 * Guarda los valores actuales del formulario en chrome.storage.sync.
 * Se llama cada vez que el usuario modifica un campo.
 */
function saveSettings() {
  const ui = getUIElements();
  chrome.storage.sync.set({
    modelName: ui.modelName.value,
    apiEndpoint: ui.apiEndpoint.value,
    mode: ui.selectApi.value,
  });
  console.log("[Popup] Settings saved", {
    model: ui.modelName.value,
    endpoint: ui.apiEndpoint.value,
    mode: ui.selectApi.value,
  });
}

/**
 * Carga la configuración guardada y restablece los valores del formulario.
 * Si no hay valores guardados, usa valores por defecto razonables.
 */
function loadSettings(ui) {
  chrome.storage.sync.get(["modelName", "apiEndpoint", "mode"], (result) => {
    console.log("[Popup] Settings loaded:", result);
    ui.modelName.value = result.modelName || "qwen3-vl:8b";
    ui.apiEndpoint.value = result.apiEndpoint || "http://localhost:11434";
    if (result.mode) {
      ui.selectApi.value = result.mode;
    }

    // Una vez cargada la config (es decir, tenemos el endpoint), buscamos modelos.
    refreshModelList();
  });
}

/**
 * ======================================================================================
 * COMUNICACIÓN CON BACKGROUND (MESSAGE PASSING)
 * ======================================================================================
 */

/**
 * Pide al Background Script la lista de modelos disponibles en Ollama.
 * Filtra y puebla el <datalist> para autocompletado.
 */
function refreshModelList() {
  console.log("[Popup] requesting listModels...");
  chrome.runtime.sendMessage({ action: "listModels" }, (response) => {
    console.log("[Popup] listModels response:", response);
    // Verificamos respuesta válida
    if (response && response.success && response.models) {
      const ui = getUIElements();
      ui.modelList.innerHTML = ""; // Limpiar lista anterior

      response.models.forEach((modelName) => {
        const option = document.createElement("option");
        option.value = modelName;
        ui.modelList.appendChild(option);
      });
    }
  });
}

/**
 * ======================================================================================
 * CICLO DE VIDA (INIT)
 * ======================================================================================
 */

window.onload = function () {
  console.log("[Popup] window.onload");
  const ui = getUIElements();

  // 1. Cargar configuración inicial
  loadSettings(ui);

  // 2. Establecer listeners para guardar automáticamente al escribir
  ui.modelName.addEventListener("input", saveSettings);
  ui.apiEndpoint.addEventListener("input", saveSettings);
  ui.selectApi.addEventListener("change", saveSettings);
};
