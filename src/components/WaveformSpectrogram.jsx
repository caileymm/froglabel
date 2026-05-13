import audioSrc from "../assets/frogsounds.mp3";
import BoundingBoxLayer from "./BoundingBoxLayer";
import { useEffect, useRef, useState } from "react";
import Spectrogram from "wavesurfer.js/dist/plugins/spectrogram.esm.js";
import ZoomPlugin from 'wavesurfer.js/dist/plugins/zoom.esm.js'
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'


export const wavesurferRef = { current: null };
export const spectrogramRef = { current: null };



function WaveformSpectrogram({ code, boxes, setBoxes, currSelectedBox, setCurrSelectedBox,
}) {
  const containerRef = useRef(null);
  const [wavesurfer, setWavesurfer] = useState(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const spectroPlugin = Spectrogram.create({
    labels: true,
    height: 400,
    splitChannels: false,
    scale: 'mel',
    frequencyMax: 5000,
    frequencyMin: 0,
    fftSamples: 512,
    labelsBackground: 'rgba(0, 0, 0, 0.1)',
    useWebWorker: true,
    gainDB: 50,
    });
    
    const ws = WaveSurfer.create({
      container: containerRef.current,
      height: 50,
      url: audioSrc,
      waveColor: 'rgb(0, 0, 0)',
      cursorColor: 'rgb(221, 213, 233)',
      progressColor: 'rgb(221, 213, 233)',
      cursorWidth: 3,
      sampleRate: 10000,
      plugins: [ spectroPlugin,
        TimelinePlugin.create( {style: {fontSize: '10px',color: '#000000',}
        })],
          
    });

    ws.on('ready', () => {
      spectrogramRef.current = spectroPlugin; 
    });

    setWavesurfer(ws);
    wavesurferRef.current=ws;

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

    </div>  
  );
}



export default WaveformSpectrogram;