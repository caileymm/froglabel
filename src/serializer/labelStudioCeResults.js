// src/serializers/labelStudioCeResults.js

export function boxesToLsResults(boxes, audioDurationSec) {
  return boxes.map((box) => ({
    id: box.id,
    type: 'labels',              // ← was 'rectanglelabels', matches your <Labels> tag
    from_name: 'label',          // ← matches name="label" in your XML
    to_name: 'audio',            // ← matches name="audio" in your XML
    original_length: audioDurationSec,
    value: {
      start:     box.startTime,
      end:       box.endTime,
      channel:   0,
      labels:    [box.code],     // ← was 'rectanglelabels', now 'labels'
      lowFreqHz:  box.startFreq,
      highFreqHz: box.endFreq,
    },
  }));
}

export function lsResultsToBoxes(results = []) {
  return results
    .filter((r) => r.type === 'labels')   // ← matches 'labels'
    .map((r) => ({
      id:        r.id ?? crypto.randomUUID(),
      startTime: r.value.start,
      endTime:   r.value.end,
      startFreq: r.value.lowFreqHz  ?? 0,
      endFreq:   r.value.highFreqHz ?? 20000,
      code:      r.value.labels?.[0] ?? '',   // ← was 'rectanglelabels'
    }));
}