import { SPECTROGRAM_HEIGHT, FREQUENCY_MAX, FREQUENCY_MIN, FFT_SAMPLES } from "./spectrogramConfig"

const melFromHz = (hz) => 2595 * Math.log10(1 + hz / 700);
const hzFromMel = (mel) => 700 * (Math.pow(10, mel / 2595) - 1);

export function freqToY(hz, freqMin, freqMax, scale = 'mel') {
    const fraction = (() => {
        if (scale === 'mel') {
            const melMin = melFromHz(freqMin);
            const melMax = melFromHz(freqMax);
            return 1 - (melFromHz(hz) - melMin) / (melMax - melMin);
        } else if (scale === 'log') {
            return 1 - (Math.log10(hz) - Math.log10(freqMin)) / (Math.log10(freqMax) - Math.log10(freqMin));
        } else {
            return 1 - (hz - freqMin) / (freqMax - freqMin);
        }
    })();
    return fraction * SPECTROGRAM_HEIGHT;
}

export function yToFreq(y, freqMin, freqMax, scale = 'mel') {
    const fraction = 1 - y / SPECTROGRAM_HEIGHT;
    if (scale === 'mel') {
        const melMin = melFromHz(freqMin);
        const melMax = melFromHz(freqMax);
        return Math.max(freqMin, Math.min(freqMax, hzFromMel(melMin + fraction * (melMax - melMin))));
    } else if (scale === 'log') {
        const logMin = Math.log10(freqMin);
        const logMax = Math.log10(freqMax);
        return Math.max(freqMin, Math.min(freqMax, Math.pow(10, logMin + fraction * (logMax - logMin))));
    } else {
        return Math.max(freqMin, Math.min(freqMax, freqMin + fraction * (freqMax - freqMin)));
    }
}