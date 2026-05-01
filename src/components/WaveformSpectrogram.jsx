import { useEffect, useRef, useState } from "react";
import audioSrc from "../assets/frogsounds.mp3";
import BoundingBoxLayer from "./BoundingBoxLayer";

// CONFIG - Lower HOP_SIZE = Wider Scroll
const HOP_SIZE = 256;
const WAVEFORM_HEIGHT = 100;
const SPECTROGRAM_HEIGHT = 400;

const workerCode = `
class ComplexNumber {
  constructor(re, im) { this.re = re; this.im = im; }
  add(other) { return new ComplexNumber(this.re + other.re, this.im + other.im); }
  subtract(other) { return new ComplexNumber(this.re - other.re, this.im - other.im); }
  multiply(other) {
    return new ComplexNumber(this.re * other.re - this.im * other.im, this.re * other.im + this.im * other.re
    );
  }
}
class DFT {
  computeDFT(signal) {
    const N = signal.length;
    const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(N)));
    const padded = [...signal];
    for (let i = N; i < nextPowerOf2; i++) padded.push(0);
    const fftResult = this.fft(padded.map(v => new ComplexNumber(v, 0)));
    return fftResult.slice(0, fftResult.length / 2).map(c => Math.sqrt(c.re * c.re + c.im * c.im));
  }
  fft(signal) {
    const N = signal.length;
    if (N <= 1) return signal;
    const even = this.fft(signal.filter((_, i) => i % 2 === 0));
    const odd = this.fft(signal.filter((_, i) => i % 2 === 1));
    const result = new Array(N);
    for (let k = 0; k < N / 2; k++) {
      const angle = -2 * Math.PI * k / N;
      const twiddle = new ComplexNumber(Math.cos(angle), Math.sin(angle)).multiply(odd[k]);
      result[k] = even[k].add(twiddle);
      result[k + N / 2] = even[k].subtract(twiddle);
    }
    return result;
  }
}
const dft = new DFT();
self.onmessage = function(e) {
  const { channelData, fftSize, hopSize } = e.data;
  const numFrames = Math.floor(channelData.length / hopSize);
  const freqBins = fftSize / 2;
  const pixels = new Uint8ClampedArray(numFrames * freqBins * 4);
  
  for (let f = 0; f < numFrames; f++) {
    const offset = f * hopSize;
    const frame = channelData.slice(offset, offset + fftSize);
    const spectrum = dft.computeDFT(frame);
    
    for (let b = 0; b < freqBins; b++) {
      const val = spectrum[b] || 0;
      const db = 20 * Math.log10(val + 1e-10);
      const intensity = Math.max(0, Math.min(255, ((db + 80) / 80) * 255));
      const y = freqBins - b - 1;
      const idx = (y * numFrames + f) * 4;
      pixels[idx] = intensity;
      pixels[idx+1] = intensity * 0.3;
      pixels[idx+2] = 255 - intensity;
      pixels[idx+3] = 255;
    }
  }
  self.postMessage({ pixels, numFrames, freqBins });
};
`;

function WaveformSpectrogram() {
  const [data, setData] = useState(null);
  const waveformRef = useRef(null);
  const spectroRef = useRef(null);

  useEffect(() => {
    fetch(audioSrc)
      .then((res) => res.arrayBuffer())
      .then((buf) => new AudioContext().decodeAudioData(buf))
      .then((audioBuffer) => setData(audioBuffer.getChannelData(0)));
  }, []);

  useEffect(() => {
    if (!data) return;

    const totalFrames = Math.floor(data.length / HOP_SIZE);
    const fftSize = 512;
    const freqBins = fftSize / 2;

    waveformRef.current.width = totalFrames;
    waveformRef.current.height = WAVEFORM_HEIGHT;
    spectroRef.current.width = totalFrames;
    spectroRef.current.height = freqBins;

    const wCtx = waveformRef.current.getContext("2d");
    const sCtx = spectroRef.current.getContext("2d");

    wCtx.fillStyle = "#1E1E1E";
    for (let f = 0; f < totalFrames; f++) {
      let max = 0;
      for (let s = 0; s < HOP_SIZE; s++) {
        const val = Math.abs(data[f * HOP_SIZE + s] || 0);
        if (val > max) max = val;
      }
      const h = max * WAVEFORM_HEIGHT;
      wCtx.fillRect(f, (WAVEFORM_HEIGHT - h) / 2, 1, h);
    }

    const blob = new Blob([workerCode], { type: "application/javascript" });
    const worker = new Worker(URL.createObjectURL(blob));

    worker.postMessage({ channelData: data, fftSize, hopSize: HOP_SIZE });

    worker.onmessage = (e) => {
      const { pixels, numFrames, freqBins } = e.data;
      sCtx.putImageData(new ImageData(pixels, numFrames, freqBins), 0, 0);
      worker.terminate();
    };

    return () => worker.terminate();
  }, [data]);

  const dynamicWidth = data ? Math.floor(data.length / HOP_SIZE) : "100%";

  return (
    <div className="bg-[#82A062] p-6 rounded-xl my-2">
      <div className="overflow-x-auto">
        <div 
          className="flex flex-col gap-1" 
          style={{ width: dynamicWidth }}
        >
          {/* Waveform Canvas */}
          <canvas
            ref={waveformRef}
            className="rounded-lg"
            style={{ height: WAVEFORM_HEIGHT }}
          />

          {/* Spectrogram Canvas */}
          <BoundingBoxLayer>
            <div className='relative w-full'>
              <canvas
                ref={spectroRef}
                className="image-pixelated w-full"
                style={{ 
                    height: SPECTROGRAM_HEIGHT,
                    imageRendering: 'pixelated'
                }}
              />
            </div>
          </BoundingBoxLayer>
        </div>
      </div>
    </div>
  );
}

export default WaveformSpectrogram;