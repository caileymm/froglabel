// src/adapters/labelStudioCeApiAdapter.js
import { lsResultsToFrogBoxes, frogBoxesToLsResults } from '../serializers/labelStudioCeResults.js';

export function createLabelStudioCeAdapter({ baseUrl, token, projectId }) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
  };

  async function apiFetch(path, options = {}) {
    const res = await fetch(`${baseUrl}${path}`, { ...options, headers });
    if (!res.ok) throw new Error(`LS API error ${res.status} on ${path}`);
    return res.json();
  }

  return {
    kind: 'label-studio-ce',
    capabilities: {
      managesQueue: true,
      hostOwnsSubmit: false,
      hostAssignsRegionIds: false,
    },

    /** Fetch the next task assigned to the current user. */
    async nextTask() {
      const data = await apiFetch(
        `/api/projects/${projectId}/next`
      );
      return {
        taskId: data.id,
        audioUrl:`${baseUrl}${data.data.audio}`,        // adjust key to match your LS data config
        existingAnnotationId: data.annotations?.[0]?.id ?? null,
        existingBoxes: lsResultsToFrogBoxes(data.annotations?.[0]?.result ?? []),
        meta: data,
      };
    },

    /** Submit (or update) a completed annotation. */
    async submit({ taskId, annotationId, frogBoxes, audioDurationSec }) {
      const result = frogBoxesToLsResults(frogBoxes, audioDurationSec);

      if (annotationId) {
        // update existing
        return apiFetch(`/api/annotations/${annotationId}`, {
          method: 'PATCH',
          body: JSON.stringify({ result }),
        });
      } else {
        // create new
        return apiFetch(`/api/tasks/${taskId}/annotations`, {
          method: 'POST',
          body: JSON.stringify({ result }),
        });
      }
    },

    /** Skip the current task. */
    async skip({ taskId }) {
      return apiFetch(`/api/tasks/${taskId}/annotations`, {
        method: 'POST',
        body: JSON.stringify({ result: [], was_cancelled: true }),
      });
    },
  };
}