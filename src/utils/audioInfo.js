import audioSrc from '../assets/audio.mp3';

export let sampleRate = null;
export let channels = null;
export let bitrate = null;
export let version = null;

export const audioInfoReady = fetch(audioSrc)
  .then(r => r.arrayBuffer())
  .then(buf => {
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.length - 3; i++) {
      if (bytes[i] === 0xFF && (bytes[i + 1] & 0xE0) === 0xE0) {
        const b1 = bytes[i + 1];
        const b2 = bytes[i + 2];
        const b3 = bytes[i + 3];

        const versionBits = (b1 >> 3) & 0x03;
        version = versionBits === 3 ? 'MPEG1' : versionBits === 2 ? 'MPEG2' : 'MPEG2.5';

        const bitrates = [0,32,40,48,56,64,80,96,112,128,160,192,224,256,320,0];
        bitrate = bitrates[(b2 >> 4) & 0x0F];

        const sampleRates = [[44100,48000,32000],[22050,24000,16000],[11025,12000,8000]];
        const vIdx = versionBits === 3 ? 0 : versionBits === 2 ? 1 : 2;
        sampleRate = sampleRates[vIdx][(b2 >> 2) & 0x03];

        const channelMode = (b3 >> 6) & 0x03;
        channels = channelMode === 3 ? 'mono' : 'stereo';
        break;
      }
    }
  });