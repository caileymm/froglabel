// src/domain/frogBox.js

export function createFrogBox({
  id,
  startTime,
  endTime,
  lowFreqHz,
  highFreqHz,
  code = '',
  codeName = null,
  source = 'manual',
  metadata = {},
}) {
  return {
    id: id ?? crypto.randomUUID(),
    startTime,
    endTime,
    lowFreqHz,
    highFreqHz,
    code,
    codeName,
    source,
    metadata,
  };
}

/** Convert a screen-coordinate box (from BoundingBoxLayer) to a FrogBox.
 *  Requires the current spectrogram frequency bounds and pixel height. */
export function screenBoxToFrogBox(box, { lowCutoff, highCutoff, yScale }) {
  const lowFreqHz  = yToFreq(box.top + box.height, lowCutoff, highCutoff, yScale);
  const highFreqHz = yToFreq(box.top,               lowCutoff, highCutoff, yScale);
  return createFrogBox({ ...box, lowFreqHz, highFreqHz });
}

/** Convert a FrogBox back to screen coordinates for rendering. */
export function frogBoxToScreenBox(frogBox, { lowCutoff, highCutoff, yScale }) {
  const top    = freqToY(frogBox.highFreqHz, lowCutoff, highCutoff, yScale);
  const bottom = freqToY(frogBox.lowFreqHz,  lowCutoff, highCutoff, yScale);
  return { ...frogBox, top, height: bottom - top };
}

// --- helpers (mirrors what App.jsx already does in boxToRow) ---
function yToFreq(y, lowCutoff, highCutoff, yScale) {
  return lowCutoff + ((yScale - y) / yScale) * (highCutoff - lowCutoff);
}
function freqToY(freq, lowCutoff, highCutoff, yScale) {
  return yScale - ((freq - lowCutoff) / (highCutoff - lowCutoff)) * yScale;
}