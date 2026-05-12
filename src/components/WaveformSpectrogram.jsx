import audioSrc from "../assets/frogsounds.mp3";
import BoundingBoxLayer from "./BoundingBoxLayer";
import { useEffect, useRef } from "react";
import Spectrogram from "wavesurfer.js/dist/plugins/spectrogram.esm.js";
import ZoomPlugin from 'wavesurfer.js/dist/plugins/zoom.esm.js';
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js';

const WAVEFORM_HEIGHT = 50;
const SPECTROGRAM_HEIGHT = 400;
const FREQUENCY_MAX = 5000;
const FREQUENCY_MIN = 0;
const FREQ_LABELS = [5000, 3900, 2800, 2000, 1300, 866, 497, 216, 0];

export const wavesurferRef = { current: null };

function WaveformSpectrogram({ code, boxes, setBoxes, currSelectedBox, setCurrSelectedBox, setDuration, setContainerWidth}) {
  const containerRef = useRef(null);

  const melFromHz = (hz) => 2595 * Math.log10(1 + hz / 700);

  const MEL_MIN = melFromHz(FREQUENCY_MIN);
  const MEL_MAX = melFromHz(FREQUENCY_MAX);

  const freqToY = (hz) => {
    const mel = melFromHz(hz);
    // fraction from top (high freq) to bottom (low freq)
    const fraction = 1 - (mel - MEL_MIN) / (MEL_MAX - MEL_MIN);
    return fraction * SPECTROGRAM_HEIGHT;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      height: WAVEFORM_HEIGHT,
      url: audioSrc,
      waveColor: '#1E1E1E',
      cursorColor: '#CAE4EF',
      progressColor: '#F3F3E4',
      cursorWidth: 3,
      sampleRate: 10000,
      dragToSeek: true,
      plugins: [
        Spectrogram.create({
          labels: false,
          height: SPECTROGRAM_HEIGHT,
          splitChannels: false,
          scale: 'mel', // linear, log, mel, bark, erb
          frequencyMax: FREQUENCY_MAX,
          frequencyMin: FREQUENCY_MIN,
          fftSamples: 512,
          labelsBackground: 'rgba(0, 0, 0, 0.1)',
          useWebWorker: true,
          // window fun
          // bandpass (affect audio hear and spectrogram)
          // 1. bin size and hop size ? 
          // 2. overlap or stride ?
          // 3. brightness and contrast -- gainDB (brightless), rangeDB (?)
        }),
        TimelinePlugin.create({
          style: { fontSize: '12px', color: '#1E1E1E', fontFamily: 'Afacad, sans-serif',},
          formatTimeCallback: (seconds) => `${seconds.toFixed(1)} s`,
        }),
      ],
    });

    ws.on('ready', () => {
      const duration = ws.getDuration(); // in seconds
      setDuration(duration)
      setContainerWidth(containerRef.current.clientWidth);
    });

    wavesurferRef.current = ws;

    return () => {
      ws.destroy();
      wavesurferRef.current = null;
    };
  }, []);

  return (
    <div className="bg-[#82A062] p-6 rounded-xl my-2 w">
      <div className="flex">

        <div
          className="relative shrink-0 w-11 items-end pr-1"
          style={{ marginTop: WAVEFORM_HEIGHT, height: SPECTROGRAM_HEIGHT }}
        >
          {FREQ_LABELS.map((freq) => (
            <span
              key={freq}
              className="absolute right-1 text-right text-[12px] text-[#1E1E1E] font-display leading-none"
              style={{ top: freqToY(freq), transform: 'translateY(-50%)' }}
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
            style={{ top: WAVEFORM_HEIGHT, height: SPECTROGRAM_HEIGHT }}
          >
            <BoundingBoxLayer
              code={code}
              boxes={boxes}
              setBoxes={setBoxes}
              currSelectedBox={currSelectedBox}
              setCurrSelectedBox={setCurrSelectedBox}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default WaveformSpectrogram;