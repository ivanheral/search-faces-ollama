import { DEFAULT_CONFIG } from "/src/config/constants.js";

export const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

export const normalizeEndpoint = (url) =>
  (url || DEFAULT_CONFIG.apiEndpoint).replace(/\/$/, "");
