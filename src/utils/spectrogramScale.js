import { SPECTROGRAM_HEIGHT } from "./spectrogramConfig"

const melFromHz  = (hz)  => 2595 * Math.log10(1 + hz / 700);
const hzFromMel  = (mel) => 700 * (Math.pow(10, mel / 2595) - 1);

const barkFromHz = (hz)  => 13 * Math.atan(0.00076 * hz) + 3.5 * Math.atan(Math.pow(hz / 7500, 2));
const hzFromBark = (bark) => {
    let hz = bark * 100;
    for (let i = 0; i < 20; i++) {
        const f = barkFromHz(hz) - bark;
        const df = 13 * 0.00076 / (1 + Math.pow(0.00076 * hz, 2)) + 7 * hz / (7500 * 7500) / (1 + Math.pow(hz / 7500, 2));
        hz -= f / df;
    }
    return hz;
};

const erbFromHz  = (hz)  => 21.4 * Math.log10(1 + 0.00437 * hz);
const hzFromErb  = (erb) => (Math.pow(10, erb / 21.4) - 1) / 0.00437;

function getFraction(hz, freqMin, freqMax, scale) {
    switch (scale) {
        case 'mel':
            return (melFromHz(hz) - melFromHz(freqMin)) / (melFromHz(freqMax) - melFromHz(freqMin));
        case 'log':
        case 'logarithmic':
            return (Math.log10(hz) - Math.log10(freqMin)) / (Math.log10(freqMax) - Math.log10(freqMin));
        case 'bark':
            return (barkFromHz(hz) - barkFromHz(freqMin)) / (barkFromHz(freqMax) - barkFromHz(freqMin));
        case 'erb':
            return (erbFromHz(hz) - erbFromHz(freqMin)) / (erbFromHz(freqMax) - erbFromHz(freqMin));
        default: // linear
            return (hz - freqMin) / (freqMax - freqMin);
    }
}

export function freqToY(hz, freqMin, freqMax, scale = 'mel') {
    return (1 - getFraction(hz, freqMin, freqMax, scale)) * SPECTROGRAM_HEIGHT;
}

export function yToFreq(y, freqMin, freqMax, scale = 'mel') {
    const fraction = 1 - y / SPECTROGRAM_HEIGHT;
    const clamp = (v) => Math.max(freqMin, Math.min(freqMax, v));
    switch (scale) {
        case 'mel': {
            const melMin = melFromHz(freqMin), melMax = melFromHz(freqMax);
            return clamp(hzFromMel(melMin + fraction * (melMax - melMin)));
        }
        case 'log':
        case 'logarithmic': {
            const logMin = Math.log10(freqMin), logMax = Math.log10(freqMax);
            return clamp(Math.pow(10, logMin + fraction * (logMax - logMin)));
        }
        case 'bark': {
            const bMin = barkFromHz(freqMin), bMax = barkFromHz(freqMax);
            return clamp(hzFromBark(bMin + fraction * (bMax - bMin)));
        }
        case 'erb': {
            const eMin = erbFromHz(freqMin), eMax = erbFromHz(freqMax);
            return clamp(hzFromErb(eMin + fraction * (eMax - eMin)));
        }
        default: {
            return clamp(freqMin + fraction * (freqMax - freqMin));
        }
    }
}