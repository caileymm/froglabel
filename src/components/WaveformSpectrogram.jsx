import audioSrc from "../assets/frogsounds.mp3";
import BoundingBoxLayer from "./BoundingBoxLayer";
import { useEffect, useState, useRef, useImperativeHandle } from "react";
import Spectrogram from "wavesurfer.js/dist/plugins/spectrogram.esm.js";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js';
import { WAVEFORM_HEIGHT, SPECTROGRAM_HEIGHT, SCALE, FREQUENCY_MIN, FREQUENCY_MAX, FFT_SAMPLES, FREQ_LABELS } from "../utils/spectrogramConfig"
import { freqToY } from '../utils/spectrogramScale';
import { audioInfoReady, sampleRate } from '../utils/audioInfo';
import { usePanels } from './PanelContext';

export const wavesurferRef = { current: null };

function WaveformSpectrogram({ code, boxes, setBoxes, currSelectedBox, setCurrSelectedBox, setDuration, setContainerWidth, setDrawingBox }) {
  const containerRef = useRef(null);
  const [spectroTop, setSpectroTop] = useState(WAVEFORM_HEIGHT);
  const [spectroHeight, setSpectroHeight] = useState(SPECTROGRAM_HEIGHT);

  const { brightness, setBrightness, contrast, setContrast, rightPanel } = usePanels();
  const {handleSpectroMouseDown, handleSpectroMouseMove, handleSpectroMouseUp,} = usePanels();

  const spectroPluginRef = useRef(null);
  const spectroCanvasRef = useRef(null);



  useEffect(() => {
    if (!containerRef.current) return;

    let ws = null;
    let cancelled = false;
    
    spectroPluginRef.current = Spectrogram.create({
            labels: false,
            height: SPECTROGRAM_HEIGHT,
            splitChannels: false,
            scale: SCALE,
            frequencyMax: FREQUENCY_MAX,
            frequencyMin: FREQUENCY_MIN,
            fftSamples: FFT_SAMPLES,
            labelsBackground: 'rgba(0, 0, 0, 0.1)',
            useWebWorker: true,
          });

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
          spectroPluginRef.current,
          TimelinePlugin.create({
            style: { fontSize: '12px', color: '#1E1E1E', fontFamily: 'Afacad, sans-serif' },
            formatTimeCallback: (seconds) => `${seconds.toFixed(1)} s`,
          }),
        ],
      });

      ws.on('ready', () => {
        setDuration(ws.getDuration());
        setContainerWidth(containerRef.current.clientWidth);
        const canvases = containerRef.current.querySelectorAll('canvas');
        if (canvases.length > 1) {
          const spectroCanvas = canvases[1];
          spectroCanvasRef.current = spectroCanvas;
          const containerTop = containerRef.current.getBoundingClientRect().top;
          const canvasTop = spectroCanvas.getBoundingClientRect().top;
          setSpectroTop(canvasTop - containerTop);
          setSpectroHeight(spectroCanvas.getBoundingClientRect().height);
        }
        });

      wavesurferRef.current = ws;
    });

    return () => {
      cancelled = true;
      ws?.destroy();
      wavesurferRef.current = null;
    };
  }, []);

  return (
    <div className="bg-[#82A062] p-6 rounded-xl my-2">
      <div className="flex">

        {/* Frequency labels */}
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

        {/* Waveform + Spectrogram + Bounding Box Overlay */}
        <div className="relative w-full">
          <div ref={containerRef} />
          <div
            className="absolute z-50 left-0 right-0"
            style={{ top: spectroTop, height: spectroHeight }}
            onMouseDown={handleSpectroMouseDown}
            onMouseMove={handleSpectroMouseMove}
            onMouseUp={handleSpectroMouseUp}
            onMouseLeave={handleSpectroMouseUp}
          >
            <div
              className="absolute left-0 right-0 pointer-events-none"
              style={{
                top: 0,
                height: spectroHeight,
                backdropFilter: `brightness(${brightness}) contrast(${contrast})`,
                zIndex: 10,
              }}
            />
            <BoundingBoxLayer
              code={code}
              boxes={boxes}
              setBoxes={setBoxes}
              currSelectedBox={currSelectedBox}
              setCurrSelectedBox={setCurrSelectedBox}
              setDrawingBox={setDrawingBox}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default WaveformSpectrogram;