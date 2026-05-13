import audioSrc from "../assets/audio.mp3";
import BoundingBoxLayer from "./BoundingBoxLayer";
import { useEffect, useState, useRef, useCallback } from "react";
import Spectrogram from "wavesurfer.js/dist/plugins/spectrogram.esm.js";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js';
import { WAVEFORM_HEIGHT, SPECTROGRAM_HEIGHT, SCALE, FREQUENCY_MIN, FREQUENCY_MAX, FFT_SAMPLES, FREQ_LABELS } from "../utils/spectrogramConfig"
import { freqToY } from '../utils/spectrogramScale';
import { audioInfoReady, sampleRate } from '../utils/audioInfo';

export const wavesurferRef = { current: null };

function WaveformSpectrogram({ code, boxes, setBoxes, currSelectedBox, setCurrSelectedBox, setDuration, setDrawingBox }) {
  const containerRef = useRef(null);
  const overlayRef = useRef(null); // Ref to move the boxes during pan
  const [spectroTop] = useState(WAVEFORM_HEIGHT);
  const [spectroHeight] = useState(SPECTROGRAM_HEIGHT);
  const [canvasWidth, setCanvasWidth] = useState(0);

  // Helper to sync the overlay position with WaveSurfer's scroll
  const syncOverlayPosition = useCallback(() => {
    const scrollContainer = containerRef.current?.querySelector('div');
    if (scrollContainer && overlayRef.current) {
      // Move the overlay horizontally to match the scroll position
      overlayRef.current.style.transform = `translateX(-${scrollContainer.scrollLeft}px)`;
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    let ws = null;
    let cancelled = false;

    audioInfoReady.then(() => {
      if (cancelled) return;

      ws = WaveSurfer.create({
        container: containerRef.current,
        height: WAVEFORM_HEIGHT,
        url: audioSrc,
        waveColor: '#1E1E1E',
        cursorColor: '#CAE4EF',
        progressColor: '#F3F3E4',
        cursorWidth: 3,
        sampleRate: sampleRate,
        dragToSeek: true,
        plugins: [
          Spectrogram.create({
            labels: false,
            height: SPECTROGRAM_HEIGHT,
            splitChannels: false,
            scale: SCALE,
            frequencyMax: FREQUENCY_MAX,
            frequencyMin: FREQUENCY_MIN,
            fftSamples: FFT_SAMPLES,
            labelsBackground: 'rgba(0, 0, 0, 0.1)',
            useWebWorker: true,
          }),
          TimelinePlugin.create({
            style: { fontSize: '12px', color: '#1E1E1E', fontFamily: 'Afacad, sans-serif' },
            formatTimeCallback: (seconds) => `${seconds.toFixed(1)} s`,
          }),
        ],
      });

      // Update state when audio is loaded
      ws.on('ready', () => {
        const duration = ws.getDuration();
        setDuration(duration);
        
        const wrapper = containerRef.current.querySelector('div');
        if (wrapper) {
          setCanvasWidth(wrapper.scrollWidth);
          // Listen for manual scrolls (panning)
          wrapper.addEventListener('scroll', syncOverlayPosition);
        }
      });

      // Update width and position whenever zoom changes
      ws.on('zoom', () => {
        const wrapper = containerRef.current.querySelector('div');
        if (wrapper) {
          setCanvasWidth(wrapper.scrollWidth);
          // Recalculate position immediately after zoom
          requestAnimationFrame(syncOverlayPosition);
        }
      });

      wavesurferRef.current = ws;
    });

    return () => {
      cancelled = true;
      if (wavesurferRef.current) {
        const wrapper = containerRef.current?.querySelector('div');
        wrapper?.removeEventListener('scroll', syncOverlayPosition);
        wavesurferRef.current.destroy();
      }
      wavesurferRef.current = null;
    };
  }, [setDuration, syncOverlayPosition]);

  return (
    <div className="bg-[#82A062] p-6 rounded-xl my-2 overflow-hidden">
      <div className="flex">

        {/* Frequency labels (Fixed Left) */}
        <div
          className="relative shrink-0 w-11 items-end pr-1"
          style={{ marginTop: spectroTop, height: spectroHeight }}
        >
          {FREQ_LABELS.map((freq) => (
            <span
              key={freq}
              className="absolute right-1 text-right text-[12px] text-[#1E1E1E] font-display leading-none"
              style={{ top: Math.min(freqToY(freq), spectroHeight - 1), transform: 'translateY(-50%)' }}
            >
              {freq} Hz
            </span>
          ))}
        </div>

        {/* Main Viewing Area */}
        <div className="relative w-full overflow-hidden">
          {/* WaveSurfer UI */}
          <div ref={containerRef} className="relative z-10" />

          {/* Bounding Box Overlay Layer */}
          <div
            ref={overlayRef}
            className="absolute z-50 left-0 top-0"
            style={{ 
              top: spectroTop, 
              height: spectroHeight, 
              width: canvasWidth, // Crucial: Same width as zoomed audio
              pointerEvents: 'none',
              willChange: 'transform' // Performance optimization for panning
            }}
          >
            {/* Wrapper to re-enable mouse interactions on boxes */}
            <div className="w-full h-full relative" style={{ pointerEvents: 'auto' }}>
              <BoundingBoxLayer
                code={code}
                boxes={boxes}
                setBoxes={setBoxes}
                currSelectedBox={currSelectedBox}
                setCurrSelectedBox={setCurrSelectedBox}
                setDrawingBox={setDrawingBox}
                canvasWidth={canvasWidth}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default WaveformSpectrogram;