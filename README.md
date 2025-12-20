# 🤖 Search Faces - Extensión de Chrome con IA Local (Ollama)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Ollama](https://img.shields.io/badge/AI-Ollama-orange.svg)

Esta extensión de Chrome permite analizar imágenes en cualquier página web utilizando modelos de Inteligencia Artificial locales a través de **Ollama**. Es una herramienta educativa diseñada para enseñar cómo integrar modelos de visión (LMs) en el navegador de forma privada y segura.

Con un simple clic, puedes detectar rostros, identificar celebridades o evaluar contenido, todo procesado en tu propia máquina.

## ✨ Características Principales

- **Privacidad Total**: Las imágenes se analizan localmente en tu ordenador usando Ollama. Ningún dato sale a la nube.
- **3 Modos de Análisis**:
  - **👤 Faces**: Detecta todos los rostros en una imagen y estima características (edad, género, etc.).
  - **🌟 Celebrities**: Identifica personas famosas o reconocidas públicamente.
  - **🔞 Nopor**: Filtro de seguridad para detectar contenido adulto o inapropiado.
- **Configuración Flexible**:
  - **Selector de Modelos**: Elige qué modelo de visión usar (ej. `qwen3-vl:8b`, `llava`) directamente desde el popup.
  - **Endpoint Personalizable**: Conéctate a cualquier instancia de Ollama (por defecto `localhost:11434`).
- **Interfaz Reactiva**:
  - Botón "Analyze" que se inyecta discretamente en las imágenes.
  - Indicadores visuales de carga y errores.
  - Resultados visualizados como etiquetas o cajas sobre la imagen.
  - Resultados visualizados como etiquetas o cajas sobre la imagen.

## 💡 Casos de Uso

- **Educación**: Aprende cómo funcionan los LLMs multimodales y la visión por computador.
- **Privacidad**: Analiza fotos personales sin subirlas a la nube (Google Photos, Facebook, etc.).
- **Accesibilidad**: Genera descripciones automáticas para imágenes en la web.
- **Desarrollo**: Úsalo como plantilla para crear tus propias extensiones con IA local.
- **Seguridad**: Filtra contenido no deseado en tiempo real mientras navegas.
## 🛠️ Stack Tecnológico

Este proyecto es un ejemplo moderno de desarrollo de extensiones:

- **JavaScript (ES6+)**:
  - Uso de `async/await` para operaciones asíncronas limpias.
  - `MutationObserver` para detectar cambios dinámicos en webs modernas (SPA).
- **Chrome Extensions API (Manifest V3)**:
  - **Background Script** (Service Worker): Centraliza la comunicación con Ollama para manejar CORS y procesar imágenes en Base64.
  - **Popup**: Interfaz de configuración que persiste las preferencias del usuario.
  - **Content Scripts**: Inyecta la UI y maneja la interacción con las imágenes.
- **Ollama**: Plataforma para ejecutar modelos LLM multimodales localmente.

## 📂 Estructura del Proyecto

El código ha sido refactorizado para mayor claridad:

```text
/src
├── /background    # 🧠 CEREBRO: Comunicación con API de Ollama y manejo de imágenes.
│   └── index.js
├── /config        # ⚙️ CONFIG: Prompts y constantes globales.
│   └── constants.js
├── /content       # 👁️ OJOS: Interacción con el DOM y renderizado de resultados.
│   ├── index.js
│   └── style.css
├── /popup         # 🎛️ CONTROL: Selector de modelos y configuración.
│   ├── index.html
│   └── index.js
├── /utils         # 🔧 ÚTILES: Funciones auxiliares (ej. blobToBase64).
│   └── index.js
└── manifest.json  # 📄 DNI: Definición de permisos y scripts.
```

## 🚀 Guía de Inicio Rápido

### 1. Preparar Ollama (Local AI)

Esta extensión necesita un "cerebro" local.

1.  Descarga e instala [Ollama](https://ollama.com).
2.  Abre tu terminal y descarga un modelo de visión. Recomendamos **Qwen-VL** por su rapidez:
    ```bash
    ollama pull qwen3-vl:8b
    ```
3.  **IMPORTANTE**: Configura Ollama para aceptar peticiones desde el navegador (CORS).
    - **Windows (PowerShell)**:
      ```powershell
      $env:OLLAMA_ORIGINS="*"; ollama serve
      ```
    - **Mac/Linux**:
      ```bash
      OLLAMA_ORIGINS="*" ollama serve
      ```

### 2. Instalar en Chrome

1.  Clona este repositorio o descarga el ZIP.
2.  Abre Chrome y ve a `chrome://extensions/`.
3.  Activa el **"Modo de desarrollador"** (arriba a la derecha).
4.  Haz clic en **"Cargar descomprimida"** y selecciona la carpeta de este proyecto.

### 3. Usar la Extensión

1.  Haz clic en el icono de la extensión (puzzle) y fíjalo en tu barra.
2.  **Configuración Inicial**:
    - Abre el popup de la extensión.
    - Asegúrate de que el **Endpoint** sea correcto.
    - **Selecciona el modelo** que descargaste (ej. `qwen3-vl:8b`) en la lista desplegable.
    - Elige el modo por defecto (Faces, Celebrities, Nopor).
3.  Navega a una web con imágenes (ej. Google Imágenes, Pinterest).
4.  Pasa el ratón sobre una imagen y haz clic en el botón **Analyze**.

---

## 📚 Notas de Desarrollo

- **Prompts**: Los prompts utilizados para cada modo se encuentran en `src/config/constants.js`. Puedes modificarlos para alterar el comportamiento del análisis.
- **Depuración**: Si algo falla, revisa la consola de la extensión (click derecho en el popup -> Inspeccionar) o la consola de la página web.

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar la extensión, añadir nuevos modelos o corregir errores:

1.  Haz un Fork del repositorio.
2.  Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`).
3.  Commit a tus cambios (`git commit -m 'Add some AmazingFeature'`).
4.  Push a la rama (`git push origin feature/AmazingFeature`).
5.  Abre un Pull Request.

## 📄 Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

---
Hecho con ❤️ por [ivanheral](https://github.com/ivanheral)
