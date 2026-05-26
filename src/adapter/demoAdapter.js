// src/adapters/demoAdapter.js
import greenAudio  from '../assets/green_tree.mp3';
import peronsAudio from '../assets/perons_tree.mp3';
import redEyedAudio from '../assets/red_eyed_tree.mp3';

const DEMO_TASKS = [
  { taskId: 'demo-1', audioUrl: greenAudio,   label: 'Green Tree Frog'   },
  { taskId: 'demo-2', audioUrl: peronsAudio,  label: "Peron's Tree Frog" },
  { taskId: 'demo-3', audioUrl: redEyedAudio, label: 'Red-eyed Tree Frog' },
];

export function createDemoAdapter() {
  let index = 0;

  return {
    kind: 'demo',
    capabilities: {
      managesQueue: true,
      hostOwnsSubmit: false,
      hostAssignsRegionIds: false,
    },

    async nextTask() {
      const task = DEMO_TASKS[index % DEMO_TASKS.length];
      index++;
      return {
        taskId: task.taskId,
        audioUrl: task.audioUrl,
        existingAnnotationId: null,
        existingBoxes: [],
        meta: { label: task.label },
      };
    },

    async submit({ frogBoxes }) {
      console.log('[DemoAdapter] Submitted boxes:', frogBoxes);
      return { ok: true };
    },

    async skip() {
      return { ok: true };
    },
  };
}