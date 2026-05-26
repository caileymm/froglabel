// src/api/labelStudio.js

const BASE_URL   = import.meta.env.VITE_LS_URL;
const TOKEN  = import.meta.env.VITE_LS_TOKEN;
const PROJECT_ID = import.meta.env.VITE_LS_PROJECT_ID;

console.log("BASE_URL:", BASE_URL);
console.log("PROJECT_ID:", PROJECT_ID);

async function getAccessToken() {
  const res = await fetch(`${BASE_URL}/api/token/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh: TOKEN,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to refresh access token');
  }

  const data = await res.json();
  return data.access;
}

async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  console.log("TOKEN BEING USED:", TOKEN);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${TOKEN}`,
  };

  console.log("FINAL HEADERS:", headers);

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const text = await res.text();
  console.log("RAW RESPONSE:", text);

  if (!res.ok) {
    throw new Error(`LS ${res.status} on ${path}: ${text}`);
  }

  return JSON.parse(text);
}

export async function getNextTask() {
  const res = await apiFetch(`/api/projects/${PROJECT_ID}/next`);

  console.log("RAW /next response:", res);

  if (!res || (Array.isArray(res) && res.length === 0)) {
    return null;
  }

  const task = Array.isArray(res) ? res[0] : res;

  if (!task?.id) {
    console.log("Invalid task shape:", task);
    return null;
  }

  return {
    taskId: task.id,
    audioUrl: `${BASE_URL}${task.data.audio}`,
    existingAnnotationId: task.annotations?.[0]?.id ?? null,
    existingBoxes: [],
    meta: task,
  };
}

export async function submitAnnotation(taskId, annotationId, results) {
  if (annotationId) {
    return apiFetch(`/api/annotations/${annotationId}`, {
      method: 'PATCH',
      body: JSON.stringify({ result: results }),
    });
  }
  return apiFetch(`/api/tasks/${taskId}/annotations`, {
    method: 'POST',
    body: JSON.stringify({ result: results }),
  });
}