// src/hooks/useAnnotationSession.js
import { useState, useEffect, useCallback } from 'react';

export function useAnnotationSession(adapter) {
  const [task, setTask]           = useState(null);   // { taskId, audioUrl, ... }
  const [boxes, setBoxes]         = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const loadNext = useCallback(async () => {
  setLoading(true);
  setError(null);

  try {
    const nextTask = await adapter.nextTask();

    if (!nextTask) {
      setTask(null);
      setBoxes([]);
      return;
    }

    setTask(nextTask);
    setBoxes(nextTask.existingBoxes);
  } catch (e) {
    setError(e.message);
  } finally {
    setLoading(false);
  }
}, [adapter]);

  // Load first task on mount
  useEffect(() => { loadNext(); }, [loadNext]);

  const submit = useCallback(async (audioDurationSec) => {
    if (!task) return;
    setLoading(true);
    try {
      await adapter.submit({
        taskId: task.taskId,
        annotationId: task.existingAnnotationId,
        frogBoxes: boxes,
        audioDurationSec,
      });
      await loadNext();     // advance queue
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [adapter, task, boxes, loadNext]);

  const skip = useCallback(async () => {
    if (!task) return;
    await adapter.skip({ taskId: task.taskId });
    await loadNext();
  }, [adapter, task, loadNext]);

  return { task, boxes, setBoxes, loading, error, submit, skip, loadNext };
}