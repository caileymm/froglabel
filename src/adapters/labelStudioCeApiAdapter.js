import { boxesToLsResults } from '../serializers/labelStudioCeResults';
import { getSessionConfig, DEFAULT_LS_URL } from '../utils/sessionConfig';

function apiConfig() {
    const config = getSessionConfig();
    const lsUrl = config?.lsUrl || DEFAULT_LS_URL;
    const token = config?.token || import.meta.env.VITE_LS_TOKEN || '';
    const projectId = config?.projectId || import.meta.env.VITE_LS_PROJECT_ID || '';

    return {
        base: `${lsUrl}/api`,
        projectId,
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
    };
}

export const labelStudioCeAdapter = {
    async getNextTask() {
        const { base, projectId, headers } = apiConfig();
        const response = await fetch(`${base}/projects/${projectId}/next/`, { headers });
        if (response.status === 404 || response.status === 204) return null;
        if (!response.ok) {
            throw new Error(`Failed to fetch next task: ${response.status}`);
        }
        return response.json();
    },

    submitAnnotation(taskId, boxes) {
        const { base, headers } = apiConfig();
        return fetch(`${base}/tasks/${taskId}/annotations/`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ result: boxesToLsResults(boxes) }),
        }).then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to submit annotation: ${response.status}`);
            }
            return response.json();
        });
    },

    updateAnnotation(annotationId, boxes) {
        const { base, headers } = apiConfig();
        return fetch(`${base}/annotations/${annotationId}/`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ result: boxesToLsResults(boxes) }),
        }).then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to update annotation: ${response.status}`);
            }
            return response.json();
        });
    },
};
