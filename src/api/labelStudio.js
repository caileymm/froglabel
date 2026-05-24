const BASE = import.meta.env.VITE_LS_URL + "/api";
const TOKEN = import.meta.env.VITE_LS_TOKEN;
const PROJECT_ID = import.meta.env.VITE_LS_PROJECT_ID;

const headers = {
  Authorization: `Token ${TOKEN}`,
  "Content-Type": "application/json",
};

// Get next unlabeled task (next audio file to annotate)
export const getNextTask = () =>
  fetch(`${BASE}/projects/${PROJECT_ID}/next/`, { headers })
    .then((r) => r.json());

// Submit your boxes as an annotation
export const submitAnnotation = (taskId, boxes) =>
  fetch(`${BASE}/tasks/${taskId}/annotations/`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      result: boxes.map((box) => ({
        type: "rectanglelabels",
        value: {
          start: box.startTime,
          end: box.endTime,
          startFreq: box.startFreq,
          endFreq: box.endFreq,
          labels: [box.code],
        },
      })),
    }),
  }).then((r) => r.json());