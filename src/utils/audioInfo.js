import { fetchAuthenticatedAudioBuffer } from '../api/labelStudio';

export async function getAudioInfo(audioSrc) {
  const buf = await fetchAuthenticatedAudioBuffer(audioSrc);
  const bytes = new Uint8Array(buf);

  let sampleRate = null, channels = null, bitrate = null, version = null,  maxFrequency = null;
  
  let start = 0;
  if (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) { // "ID3"
    const id3Size = ((bytes[6] & 0x7F) << 21) | ((bytes[7] & 0x7F) << 14) |
                    ((bytes[8] & 0x7F) << 7)  |  (bytes[9] & 0x7F);
    start = 10 + id3Size;
  }

  for (let i = start; i < bytes.length - 3; i++) {
    if (bytes[i] === 0xFF && (bytes[i + 1] & 0xE0) === 0xE0) {
      const b1 = bytes[i + 1];
      const b2 = bytes[i + 2];
      const b3 = bytes[i + 3];

      const layer = (b1 >> 1) & 0x03;
      const bitrateIdx = (b2 >> 4) & 0x0F;
      const sampleIdx = (b2 >> 2) & 0x03;
      if (layer === 0 || bitrateIdx === 0 || bitrateIdx === 15 || sampleIdx === 3) continue;

      const versionBits = (b1 >> 3) & 0x03;
      version = versionBits === 3 ? 'MPEG1' : versionBits === 2 ? 'MPEG2' : 'MPEG2.5';

      const bitrates = [0,32,40,48,56,64,80,96,112,128,160,192,224,256,320,0];
      bitrate = bitrates[bitrateIdx];

      const sampleRates = [[44100,48000,32000],[22050,24000,16000],[11025,12000,8000]];
      const vIdx = versionBits === 3 ? 0 : versionBits === 2 ? 1 : 2;
      sampleRate = sampleRates[vIdx][sampleIdx];
      maxFrequency = sampleRate ? sampleRate / 2 : null;// nyquist theorem

      const channelMode = (b3 >> 6) & 0x03;
      channels = channelMode === 3 ? 'mono' : 'stereo';
      break;
    }
  }

  return { sampleRate, channels, bitrate, version, maxFrequency };
}