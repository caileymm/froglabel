import { SPECTROGRAM_HEIGHT, FREQUENCY_MAX, FREQUENCY_MIN, FFT_SAMPLES } from "./spectrogramConfig"

const melFromHz = (hz) => 2595 * Math.log10(1 + hz / 700);
const hzFromMel = (mel) => 700 * (Math.pow(10, mel / 2595) - 1);

function getScale(sampleRate) {
    const FREQ_EFF_MIN = sampleRate / FFT_SAMPLES / 2;
    const MEL_EFF_MIN = melFromHz(FREQ_EFF_MIN);
    const MEL_MAX = melFromHz(FREQUENCY_MAX);
    return { MEL_EFF_MIN, MEL_MAX };
}

export function freqToY(hz, sampleRate) {
    const { MEL_EFF_MIN, MEL_MAX } = getScale(sampleRate);
    const mel = melFromHz(hz);
    const fraction = 1 - (mel - MEL_EFF_MIN) / (MEL_MAX - MEL_EFF_MIN);
    return fraction * SPECTROGRAM_HEIGHT;
}

export function yToFreq(y, sampleRate) {
    const { MEL_EFF_MIN, MEL_MAX } = getScale(sampleRate);
    const fraction = 1 - y / SPECTROGRAM_HEIGHT;
    const mel = MEL_EFF_MIN + fraction * (MEL_MAX - MEL_EFF_MIN);
    return Math.max(FREQUENCY_MIN, Math.min(FREQUENCY_MAX, hzFromMel(mel)));
}