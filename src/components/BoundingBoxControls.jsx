// import play from '.././assets/play.png'

// function BoundingBoxControls() {
//   return (
//     <div className='p-3 bg-[#82A062] rounded-xl h-20 flex items-center gap-2'>
//       <button className='bg-[#CAE4EF] rounded-xl w-15 h-12 flex items-center justify-center hover:bg-[#B4D2EF] cursor-pointer flex-shrink-0'>
//         <img src={play} className='w-8 h-8' />
//       </button>
//       <div className='bg-white h-12 w-full rounded-lg'></div>
//     </div>
//   )
// }

// export default BoundingBoxControls



// import play from '.././assets/play.png'


// function BoundingBoxControls() {
//   return (
//     <div className='p-3 bg-[#82A062] rounded-xl h-20 flex items-center gap-2'>
//       <button className='bg-[#CAE4EF] rounded-xl w-15 h-12 flex items-center justify-center hover:bg-[#B4D2EF] cursor-pointer flex-shrink-0'>
//         <img src={play} className='w-8 h-8' />
//       </button>
//       <div className='bg-white h-12 w-full rounded-lg'></div>
//     </div>
//   )
// }


// export default BoundingBoxControls




import { useEffect, useRef, useState } from "react";
import play from '.././assets/play.png';
import pause from '.././assets/pause.png';


const WAVEFORM_HEIGHT = 48;


function BoundingBoxControls({ audioRef, numFramesRef, waveformDataRef }) {
 const waveformRef = useRef(null);
 const waveformOverlayRef = useRef(null);
 const animRef = useRef(null);
 const [isPlaying, setIsPlaying] = useState(false);


 // Draw waveform when data is ready
 useEffect(() => {
   if (!waveformDataRef?.current || !numFramesRef?.current) return;
   const data = waveformDataRef.current;
   const totalFrames = numFramesRef.current;
   const waveform = waveformRef.current;
   const waveformOverlay = waveformOverlayRef.current;
   if (!waveform) return;


   waveform.width = totalFrames;
   waveform.height = WAVEFORM_HEIGHT;
   waveformOverlay.width = totalFrames;
   waveformOverlay.height = WAVEFORM_HEIGHT;


   const ctx = waveform.getContext("2d");
   const samplesPerFrame = Math.floor(data.length / totalFrames);
   const mid = WAVEFORM_HEIGHT / 2;


   ctx.fillStyle = "white";
   ctx.fillRect(0, 0, totalFrames, WAVEFORM_HEIGHT);


   for (let f = 0; f < totalFrames; f++) {
     let min = 0, max = 0;
     for (let s = 0; s < samplesPerFrame; s++) {
       const val = data[f * samplesPerFrame + s] || 0;
       if (val < min) min = val;
       if (val > max) max = val;
     }
     const top = mid - max * mid;
     const bottom = mid - min * mid;
     ctx.fillStyle = "#82A062";
     ctx.fillRect(f, top, 1, Math.max(1, bottom - top));
   }


   // Set up playhead once waveform is drawn and audio is ready
   const audio = audioRef?.current;
   if (!audio) return;


   const drawPlayhead = () => {
     const overlayCtx = waveformOverlay.getContext("2d");
     overlayCtx.clearRect(0, 0, waveformOverlay.width, waveformOverlay.height);
     if (audio.duration && numFramesRef?.current) {
       const x = Math.floor((audio.currentTime / audio.duration) * numFramesRef.current);
       overlayCtx.strokeStyle = "#333";
       overlayCtx.lineWidth = 16;
       overlayCtx.beginPath();
       overlayCtx.moveTo(x, 0);
       overlayCtx.lineTo(x, waveformOverlay.height);
       overlayCtx.stroke();
     }
     animRef.current = requestAnimationFrame(drawPlayhead);
   };


   const start = () => { setIsPlaying(true); drawPlayhead(); };
   const stop = () => { setIsPlaying(false); cancelAnimationFrame(animRef.current); };


   audio.addEventListener("play", start);
   audio.addEventListener("pause", stop);
   audio.addEventListener("ended", stop);


   return () => {
     audio.removeEventListener("play", start);
     audio.removeEventListener("pause", stop);
     audio.removeEventListener("ended", stop);
     cancelAnimationFrame(animRef.current);
   };
 }, [waveformDataRef?.current]);


 const handlePlayPause = () => {
   const audio = audioRef?.current;
   if (!audio) return;
   isPlaying ? audio.pause() : audio.play();
 };


 const handleClick = (e) => {
   const audio = audioRef?.current;
   if (!audio) return;
   const rect = waveformRef.current.getBoundingClientRect();
   audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
 };


 return (
   <div className='p-3 bg-[#82A062] rounded-xl h-20 flex items-center gap-2'>
     <button
       onClick={handlePlayPause}
       className='bg-[#CAE4EF] rounded-xl w-15 h-12 flex items-center justify-center hover:bg-[#B4D2EF] cursor-pointer flex-shrink-0'
     >
       <img src={isPlaying ? pause : play} className='w-8 h-8' />
     </button>
     <div
       className='h-12 w-full rounded-lg overflow-hidden cursor-pointer relative'
       onClick={handleClick}
     >
       <canvas ref={waveformRef} className="absolute top-0 left-0 w-full h-full" />
       <canvas ref={waveformOverlayRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
     </div>
   </div>
 );
}


export default BoundingBoxControls;

