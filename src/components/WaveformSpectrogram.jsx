// import { useEffect, useRef, useState, useCallback } from "react";
import audioSrc from "../assets/frogsounds.mp3";
import BoundingBoxLayer from "./BoundingBoxLayer";

// import createWaveform from "./wavesurfercode.js"

// // CONFIG - Lower HOP_SIZE = Wider Scroll
// const HOP_SIZE = 256;
// const WAVEFORM_HEIGHT = 100;
// const SPECTROGRAM_HEIGHT = 400;

// const workerCode = `
// class ComplexNumber {
//   constructor(re, im) { this.re = re; this.im = im; }
//   add(other) { return new ComplexNumber(this.re + other.re, this.im + other.im); }
//   subtract(other) { return new ComplexNumber(this.re - other.re, this.im - other.im); }
//   multiply(other) {
//     return new ComplexNumber(this.re * other.re - this.im * other.im, this.re * other.im + this.im * other.re);
//   }
// }
// class DFT {
//   computeDFT(signal) {
//     const N = signal.length;
//     const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(N)));
//     const padded = [...signal];
//     for (let i = N; i < nextPowerOf2; i++) padded.push(0);
//     const fftResult = this.fft(padded.map(v => new ComplexNumber(v, 0)));
//     return fftResult.slice(0, fftResult.length / 2).map(c => Math.sqrt(c.re * c.re + c.im * c.im));
//   }
//   fft(signal) {
//     const N = signal.length;
//     if (N <= 1) return signal;
//     const even = this.fft(signal.filter((_, i) => i % 2 === 0));
//     const odd = this.fft(signal.filter((_, i) => i % 2 === 1));
//     const result = new Array(N);
//     for (let k = 0; k < N / 2; k++) {
//       const angle = -2 * Math.PI * k / N;
//       const twiddle = new ComplexNumber(Math.cos(angle), Math.sin(angle)).multiply(odd[k]);
//       result[k] = even[k].add(twiddle);
//       result[k + N / 2] = even[k].subtract(twiddle);
//     }
//     return result;
//   }
// }
// const dft = new DFT();
// self.onmessage = function(e) {
//   const { channelData, fftSize, hopSize } = e.data;
//   const numFrames = Math.floor(channelData.length / hopSize);
//   const freqBins = fftSize / 2;
//   const pixels = new Uint8ClampedArray(numFrames * freqBins * 4);
//   for (let f = 0; f < numFrames; f++) {
//     const offset = f * hopSize;
//     const frame = channelData.slice(offset, offset + fftSize);
//     const spectrum = dft.computeDFT(frame);
//     for (let b = 0; b < freqBins; b++) {
//       const val = spectrum[b] || 0;
//       const db = 20 * Math.log10(val + 1e-10);
//       const intensity = Math.max(0, Math.min(255, ((db + 80) / 80) * 255));
//       const y = freqBins - b - 1;
//       const idx = (y * numFrames + f) * 4;
//       pixels[idx] = intensity;
//       pixels[idx+1] = intensity * 0.3;
//       pixels[idx+2] = 255 - intensity;
//       pixels[idx+3] = 255;
//     }
//   }
//   self.postMessage({ pixels, numFrames, freqBins });
// };
// `;

// function WaveformSpectrogram({ code, boxes, setBoxes, currSelectedBox, setCurrSelectedBox, zoomX, zoomY, scrollRef }) {
//   const [data, setData] = useState(null);
//   const waveformRef = useRef(null);
//   const spectroRef = useRef(null);
//   const containerRef = useRef(null);


//   useEffect(() => {
//     fetch(audioSrc)
//       .then((res) => res.arrayBuffer())
//       .then((buf) => new AudioContext().decodeAudioData(buf))
//       .then((audioBuffer) => setData(audioBuffer.getChannelData(0)));
//   }, []);

//   useEffect(() => {
//     if (!data) return;

//     const totalFrames = Math.floor(data.length / HOP_SIZE);
//     const fftSize = 512;
//     const freqBins = fftSize / 2;

//     waveformRef.current.width = totalFrames;
//     waveformRef.current.height = WAVEFORM_HEIGHT;
//     spectroRef.current.width = totalFrames;
//     spectroRef.current.height = freqBins;

//     const wCtx = waveformRef.current.getContext("2d");
//     const sCtx = spectroRef.current.getContext("2d");

//     wCtx.fillStyle = "#1E1E1E";
//     for (let f = 0; f < totalFrames; f++) {
//       let max = 0;
//       for (let s = 0; s < HOP_SIZE; s++) {
//         const val = Math.abs(data[f * HOP_SIZE + s] || 0);
//         if (val > max) max = val;
//       }
//       const h = max * WAVEFORM_HEIGHT;
//       wCtx.fillRect(f, (WAVEFORM_HEIGHT - h) / 2, 1, h);
//     }

//     const blob = new Blob([workerCode], { type: "application/javascript" });
//     const worker = new Worker(URL.createObjectURL(blob));
//     worker.postMessage({ channelData: data, fftSize, hopSize: HOP_SIZE });
//     worker.onmessage = (e) => {
//       const { pixels, numFrames, freqBins } = e.data;
//       sCtx.putImageData(new ImageData(pixels, numFrames, freqBins), 0, 0);
//       worker.terminate();
//     };

//     return () => worker.terminate();
//   }, [data]);

//   const naturalWidth = data ? Math.floor(data.length / HOP_SIZE) : 0;

//   const xAxisRef = useRef(null);
//   const yAxisRef = useRef(null);


//   // Draw X axis (updates when zoomX changes or scroll changes)
//   const drawXAxis = useCallback(() => {
//     if (!data || !xAxisRef.current) return;
//     const sampleRate = 44100;
//     const totalFrames = Math.floor(data.length / HOP_SIZE);
//     const totalDuration = data.length / sampleRate;
//     const canvas = xAxisRef.current;
//     const visibleWidth = scrollRef.current?.clientWidth || 800;
//     const scrollLeft = scrollRef.current?.scrollLeft || 0;

//     canvas.width = naturalWidth * zoomX;
//     canvas.height = 30;
//     const ctx = canvas.getContext('2d');
//     ctx.fillStyle = '#ffffff00';
//     ctx.fillRect(0, 0, canvas.width, 24);
//     ctx.strokeStyle = '#000000';
//     ctx.lineWidth = 8;
//     ctx.beginPath();
//     ctx.moveTo(0, 0);
//     ctx.lineTo(canvas.width, 0);
//     ctx.stroke();

//     ctx.fillStyle = '#000000';
//     ctx.font = '15px monospace';
//     ctx.textAlign = 'center';

//     const numLabels = Math.floor(canvas.width / 85);
//     for (let i = 0; i <= numLabels; i++) {
//       const x = (i / numLabels) * canvas.width;
//       const time = (i / numLabels) * totalDuration;
//       const label = `${time.toFixed(1)}s`;
//       ctx.fillText(label, x, 20);
//       ctx.lineWidth = 3; 
//       ctx.strokeStyle = '#000000';
//       ctx.beginPath();
//       ctx.moveTo(x, 0);
//       ctx.lineTo(x, 9);
//       ctx.stroke();
//     }
//   }, [data, zoomX, naturalWidth]);

//   useEffect(() => {
//     drawXAxis();
//   }, [drawXAxis]);

//   // Redraw X axis on scroll too
//   useEffect(() => {
//     const el = scrollRef.current;
//     if (!el) return;
//     el.addEventListener('scroll', drawXAxis);
//     return () => el.removeEventListener('scroll', drawXAxis);
//   }, [drawXAxis, scrollRef]);



//   return (
//     <div className="bg-[#82A062] p-6 rounded-xl my-2">


//       {/* Outer scroll container */}
//       <div ref={scrollRef} className="overflow-auto rounded-lg" style={{ maxHeight: "600px" }}>
//         {/* Inner container sized to zoomed dimensions */}
//         <div
//           ref={containerRef}
//           style={{
//             width: naturalWidth * zoomX,
//             // Height accounts for both canvases + gap
//             height: (WAVEFORM_HEIGHT + SPECTROGRAM_HEIGHT + 4) * zoomY,
//             position: "relative",
//           }}
//         >
//           {/* Waveform */}
//           <div
//             style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               width: naturalWidth,
//               height: WAVEFORM_HEIGHT,
//               transformOrigin: "top left",
//               transform: `scale(${zoomX}, ${zoomY})`,
//             }}
//           >
//             <canvas
//               ref={waveformRef}
//               className="rounded-lg"
//               style={{ width: naturalWidth, height: WAVEFORM_HEIGHT, display: "block" }}
//             />
//           </div>
    
//           {/* Spectrogram */}
//           <div
//             style={{
//               position: "absolute",
//               top: WAVEFORM_HEIGHT * zoomY + 4,
//               left: 0,
//               width: naturalWidth,
//               height: SPECTROGRAM_HEIGHT,
//               transformOrigin: "top left",
//               transform: `scale(${zoomX}, ${zoomY})`,
//             }}
//           >
//             <BoundingBoxLayer 
//             code={code}
//             boxes={boxes}
//             setBoxes={setBoxes}
//             currSelectedBox={currSelectedBox}
//             setCurrSelectedBox={setCurrSelectedBox}
//             >
//             <div className='relative w-full pointer-events-none'>
//               <canvas
//                 ref={spectroRef}
//                   className='image-pixelated w-full pointer-events-none'
//                 style={{ 
//                     height: SPECTROGRAM_HEIGHT,
//                     imageRendering: 'pixelated'
//                 }}
//               />
//               </div>
//             </BoundingBoxLayer>

//           </div>
//         </div>
//       </div>
//       {/* X Axis */}
//         <div className="overflow-hidden" style={{ width: '100%' }}>
//           <canvas ref={xAxisRef} style={{ height: 24, display: 'block' }} />
//         </div>
//       </div>
      
//   );
// }

// export default WaveformSpectrogram;


import { useEffect, useRef, useState } from "react";
import Spectrogram from "wavesurfer.js/dist/plugins/spectrogram.esm.js";
import ZoomPlugin from 'wavesurfer.js/dist/plugins/zoom.esm.js'
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'


export const wavesurferRef = { current: null };


function WaveformSpectrogram({ code, boxes, setBoxes, currSelectedBox, setCurrSelectedBox,
}) {
  const containerRef = useRef(null);
  const [wavesurfer, setWavesurfer] = useState(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      height: 50,
      url: audioSrc,
      waveColor: 'rgb(0, 0, 0)',
      cursorColor: 'rgb(221, 213, 233)',
      progressColor: 'rgb(221, 213, 233)',
      cursorWidth: 3,
      sampleRate: 10000,
      plugins: [
        Spectrogram.create({
          labels: true,
          height: 400,
          splitChannels: false,
          scale: 'mel',
          frequencyMax: 5000, // Maximum frequency to show
          frequencyMin: 0, // Minimum frequency to show
          fftSamples: 512, // Number of samples for FFT (must be power of 2),  // Higher values = better frequency resolution, slower rendering
          labelsBackground: 'rgba(0, 0, 0, 0.1)', // Background for frequency labels
          useWebWorker: true, // Use web worker for FFT calculations (improves performance)
        }),
        ZoomPlugin.create({
            scale: 0.5, // the amount of zoom per wheel step, e.g. 0.5 means a 50% magnification per scroll
            maxZoom: 100 // Optionally, specify the maximum pixels-per-second factor while zooming
        }),
        TimelinePlugin.create( {style: {fontSize: '10px',color: '#000000',}
        })],
          
    });

    setWavesurfer(ws);
    wavesurferRef.current=ws;

    // const unsubscribe = [
    //   ws.on("play", () => {
    //     setPlaying(true);
    //   }),
    //   ws.on("pause", () => {
    //     setPlaying(false);
    //   }),
    // ];

    return () => {
      ws.destroy();
      wavesurferRef.current = null;
    };
  }, [
  ]);

  return (
    <div className="bg-[#82A062] p-6 rounded-xl my-2">

      <BoundingBoxLayer
        code={code}
        boxes={boxes}
        setBoxes={setBoxes}
        currSelectedBox={currSelectedBox}
        setCurrSelectedBox={setCurrSelectedBox}
        >

        {/* Shared coordinate system */}
        <div className="relative w-full">
          {/* Spectrogram/player */}
          <div className="player" ref={containerRef}>
            <div className="relative w-full">
            </div>
          </div>
          <div/>
        </div>

      </BoundingBoxLayer>

      <div className="controls mt-4">
        {/* <button onClick={() => wavesurfer.playPause()}>
          {playing ? "Pause" : "Play"}
        </button> */}
      </div>

    </div>  
  );
}



export default WaveformSpectrogram;