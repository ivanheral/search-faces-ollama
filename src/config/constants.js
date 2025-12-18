export const MODES_PROMPTS = {
  faces:
    'Detect all faces in the image. Return a JSON object with a key \'faces\' containing a list of objects, each with \'box\' (array [xmin, ymin, xmax, ymax] in 0-1000 coordinates) and \'label\' (estimated age/gender or description). Example: {"faces": [{"box": [200, 100, 400, 300], "label": "25 year old male"}]}',
  celebrities:
    "Identify any celebrities in this image. Return a JSON object with a key 'faces' containing a list, each with 'box' (array [xmin, ymin, xmax, ymax] in 0-1000 coordinates) and 'name'. If no celebrities, return empty list.",
  nopor:
    "Analyze this image for adult content. Return a JSON object with keys 'isAdultContent' (boolean) and 'adultScore' (0.0 to 1.0).",
};

export const DEFAULT_CONFIG = {
  modelName: "qwen3-vl:8b",
  apiEndpoint: "http://localhost:11434",
};
