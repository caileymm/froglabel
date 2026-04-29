// function Spectrogram() {
//     return (
//         <div className='p-3 my-2 bg-[#82A062] rounded-xl h-100'>
//             <div className='bg-white w-h-[100%]'>hi</div>
//         </div>
//     )
// }

// export default Spectrogram



import { useEffect, useRef, useState, forwardRef } from "react";


const SAMPLE_RATE = 44100;
const FFT_SIZE = 512;
const HOP_SIZE = 1024;
const FREQ_BINS = FFT_SIZE / 2;
const ONE_MINUTE_SAMPLES = SAMPLE_RATE * 60;




const workerCode = `
class ComplexNumber {
 constructor(re, im) { this.re = re; this.im = im; }
 add(other) { return new ComplexNumber(this.re + other.re, this.im + other.im); }
 subtract(other) { return new ComplexNumber(this.re - other.re, this.im - other.im); }
 multiply(other) {
   return new ComplexNumber(
     this.re * other.re - this.im * other.im,
     this.re * other.im + this.im * other.re
   );
 }
}


class DFT {
 computeDFT(signal) {
   const paddedSignal = this.padSignal(signal);
   const fftResult = this.fft(paddedSignal);
   const fftSize = fftResult.length / 2;
   const spectrum = [];
   for (let i = 0; i < fftSize; i++) {
     const { re, im } = fftResult[i];
     spectrum.push(Math.sqrt(re * re + im * im));
   }
   return spectrum;
 }


 fft(signal) {
   const N = signal.length;
   if (N <= 1) return signal.map(v => new ComplexNumber(v, 0));
   const even = this.fft(signal.filter((_, i) => i % 2 === 0));
   const odd = this.fft(signal.filter((_, i) => i % 2 === 1));
   const spectrum = [];
   for (let k = 0; k < N / 2; k++) {
     const angle = -2 * Math.PI * k / N;
     const twiddle = new ComplexNumber(Math.cos(angle), Math.sin(angle));
     const term = twiddle.multiply(odd[k]);
     spectrum[k] = even[k].add(term);
     spectrum[k + N / 2] = even[k].subtract(term);
   }
   return spectrum;
 }


 padSignal(signal) {
   const N = signal.length;
   const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(N)));
   const padded = [...signal];
   for (let i = N; i < nextPowerOf2; i++) padded.push(0);
   return padded;
 }
}


const dft = new DFT();


self.onmessage = function (e) {
 const { channelData, fftSize, hopSize } = e.data;
 const freqBins = fftSize / 2;
 const numFrames = Math.floor(channelData.length / hopSize);


 const window = new Float32Array(fftSize);
 for (let i = 0; i < fftSize; i++) {
   window[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (fftSize - 1)));
 }


 const pixels = new Uint8ClampedArray(numFrames * freqBins * 4);


 for (let f = 0; f < numFrames; f++) {
   const frame = [];
   const offset = f * hopSize;
   for (let i = 0; i < fftSize; i++) {
     frame.push((channelData[offset + i] || 0) * window[i]);
   }


   const spectrum = dft.computeDFT(frame);


   for (let b = 0; b < freqBins && b < spectrum.length; b++) {
     const db = 20 * Math.log10(spectrum[b] + 1e-10);
     const intensity = Math.max(0, Math.min(255, ((db + 80) / 80) * 255));
     const y = freqBins - b - 1;
     const idx = (y * numFrames + f) * 4;
     pixels[idx] = intensity;
     pixels[idx + 1] = Math.floor(intensity * 0.3);
     pixels[idx + 2] = 255 - intensity;
     pixels[idx + 3] = 255;
   }
 }


 self.postMessage({ pixels, numFrames, freqBins }, [pixels.buffer]);
};
`;


function createWorker() {
 const blob = new Blob([workerCode], { type: "application/javascript" });
 return new Worker(URL.createObjectURL(blob));
}


export const useAudioEngine = (src) => {
 const audioRef = useRef(null);
 const numFramesRef = useRef(0);
 const waveformDataRef = useRef(null);
 const [ready, setReady] = useState(false);


 useEffect(() => {
   if (!src) return;
   fetch(src)
     .then(res => res.arrayBuffer())
     .then(buf => new AudioContext().decodeAudioData(buf))
     .then(audioBuffer => {
       const fullData = audioBuffer.getChannelData(0);
       const totalFrames = Math.floor(fullData.length / HOP_SIZE);
       numFramesRef.current = totalFrames;
       waveformDataRef.current = fullData;
       setReady(true);
     });
 }, [src]);


 return { audioRef, numFramesRef, waveformDataRef, ready };
};


function Spectrogram({ src, audioRef, numFramesRef }) {
 const canvasRef = useRef(null);
 const overlayRef = useRef(null);
 const animRef = useRef(null);
 const [loading, setLoading] = useState(true);
 const [progress, setProgress] = useState(0);


 useEffect(() => {
   const canvas = canvasRef.current;
   if (!canvas) return;
   const ctx = canvas.getContext("2d");


   fetch(src)
     .then(res => res.arrayBuffer())
     .then(buf => new AudioContext().decodeAudioData(buf))
     .then(audioBuffer => {
       const fullData = audioBuffer.getChannelData(0);
       const totalSamples = fullData.length;
       const totalFrames = Math.floor(totalSamples / HOP_SIZE);


       canvas.width = totalFrames;
       canvas.height = FREQ_BINS;
       overlayRef.current.width = totalFrames;
       overlayRef.current.height = FREQ_BINS;


       const chunk1 = fullData.slice(0, Math.min(ONE_MINUTE_SAMPLES, totalSamples));
       const chunk2 = totalSamples > ONE_MINUTE_SAMPLES ? fullData.slice(ONE_MINUTE_SAMPLES) : null;


       const worker1 = createWorker();
       worker1.postMessage({ channelData: chunk1, fftSize: FFT_SIZE, hopSize: HOP_SIZE }, [chunk1.buffer]);


       worker1.onmessage = (e) => {
         const { pixels, numFrames } = e.data;
         ctx.putImageData(new ImageData(pixels, numFrames, FREQ_BINS), 0, 0);
         setLoading(false);
         setProgress(chunk2 ? 60 : 100);
         worker1.terminate();


         if (chunk2) {
           const worker2 = createWorker();
           worker2.postMessage({ channelData: chunk2, fftSize: FFT_SIZE, hopSize: HOP_SIZE }, [chunk2.buffer]);
           worker2.onmessage = (e) => {
             const { pixels: pixels2, numFrames: numFrames2 } = e.data;
             ctx.putImageData(new ImageData(pixels2, numFrames2, FREQ_BINS), Math.floor(ONE_MINUTE_SAMPLES / HOP_SIZE), 0);
             setProgress(100);
             worker2.terminate();
           };
         }
       };
     });


   return () => cancelAnimationFrame(animRef.current);
 }, [src]);


    // Playhead
 useEffect(() => {
   const audio = audioRef?.current;
   const overlay = overlayRef.current;
   if (!audio || !overlay) return;


   let isDragging = false;
   const HIT_THRESHOLD = 6;


   const getXFraction = (e) => {
     const rect = overlay.getBoundingClientRect();
     return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
   };


   const isNearPlayhead = (e) => {
     const rect = overlay.getBoundingClientRect();
     const cursorX = e.clientX - rect.left;
     const playheadX = audio.duration
       ? (audio.currentTime / audio.duration) * rect.width
       : -1;
     return Math.abs(cursorX - playheadX) <= HIT_THRESHOLD;
   };


   const drawPlayhead = () => {
     const ctx = overlay.getContext("2d");
     ctx.clearRect(0, 0, overlay.width, overlay.height);
     if (audio.duration && numFramesRef?.current) {
       const x = Math.floor((audio.currentTime / audio.duration) * numFramesRef.current);
       ctx.strokeStyle = "white";
       ctx.lineWidth = 10;
       ctx.beginPath();
       ctx.moveTo(x, 0);
       ctx.lineTo(x, overlay.height);
       ctx.stroke();
     }
     animRef.current = requestAnimationFrame(drawPlayhead);
   };


   const onMouseDown = (e) => {
     if (isNearPlayhead(e)) isDragging = true;
   };


   const onMouseMove = (e) => {
     if (!isDragging) return;
     audio.currentTime = getXFraction(e) * audio.duration;
   };


   const onMouseUp = () => { isDragging = false; };


   overlay.style.pointerEvents = "all";


   overlay.addEventListener("mousedown", onMouseDown);
   window.addEventListener("mousemove", onMouseMove);
   window.addEventListener("mouseup", onMouseUp);


   // Start drawing immediately and keep running always
   drawPlayhead();


   return () => {
     overlay.removeEventListener("mousedown", onMouseDown);
     window.removeEventListener("mousemove", onMouseMove);
     window.removeEventListener("mouseup", onMouseUp);
     cancelAnimationFrame(animRef.current);
   };
 }, []);


 return (
   <div className="p-3 my-2 bg-[#82A062] rounded-xl">
     {loading && (
       <div className="text-white text-sm mb-2 animate-pulse">Computing spectrogram...</div>
     )}
     {!loading && progress < 100 && (
       <div className="text-white text-xs mb-1">Loading remaining audio... {progress}%</div>
     )}
     <div className="overflow-x-auto">
       <div className="relative" style={{ height: FREQ_BINS }}>
         <canvas ref={canvasRef} className="absolute top-0 left-0" />
         <canvas ref={overlayRef} className="absolute top-0 left-0 w-full h-full" />
       </div>
     </div>
   </div>
 );
}


export default Spectrogram;

