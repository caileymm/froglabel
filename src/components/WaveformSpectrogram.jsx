import BoundingBoxLayer from "./BoundingBoxLayer";
import { useEffect, useState, useRef } from "react";
import Spectrogram from "wavesurfer.js/dist/plugins/spectrogram.esm.js";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js';
import { WAVEFORM_HEIGHT, SPECTROGRAM_HEIGHT, SCALE, FREQUENCY_MIN, FREQUENCY_MAX, FFT_SAMPLES, FREQ_LABELS } from "../utils/spectrogramConfig"
import { freqToY } from '../utils/spectrogramScale';
import { getAudioInfo } from '../utils/audioInfo';

export const wavesurferRef = { current: null };

function WaveformSpectrogram({
    selectedAudio,
    setSampleRate,
    code,
    boxes,
    setBoxes,
    currSelectedBoxId,
    setCurrSelectedBoxId,
    duration,
    setDuration,
    setDrawingBox,
    visibleTime,
    setVisibleTime,
    theme,
}) {
    const [localSampleRate, setLocalSampleRate] = useState(null);
    
    const containerRef = useRef(null);
    const [spectroTop] = useState(WAVEFORM_HEIGHT);
    const [spectroHeight] = useState(SPECTROGRAM_HEIGHT);
    const [viewWidth, setViewWidth] = useState(0);

    useEffect(() => {
        if (!containerRef.current) return;

        const ro = new ResizeObserver(([entry]) => {
            setViewWidth(entry.contentRect.width);
        });
        ro.observe(containerRef.current);

        let ws = null;
        let cancelled = false;

        getAudioInfo(selectedAudio).then(({ sampleRate }) => {
            if (cancelled) return;
            setLocalSampleRate(sampleRate);
            setSampleRate(sampleRate);

            ws = WaveSurfer.create({
                container: containerRef.current,
                height: WAVEFORM_HEIGHT,
                url: selectedAudio,
                minPxPerSec: 0,
                fillParent: true,
                autoCenter: false,
                hideScrollbar: true,
                waveColor: theme.waveform,
                cursorColor: theme.cursor,
                progressColor: theme.progress,
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
                        style: { fontSize: '12px', color: theme.text, fontFamily: 'Afacad, sans-serif' },
                        formatTimeCallback: (seconds) => `${seconds.toFixed(1)} s`,
                    }),
                ],
            });

            ws.on('ready', () => {
                const totalDur = ws.getDuration();
                setDuration(totalDur);
                setVisibleTime({ start: 0, end: totalDur });
            });

            wavesurferRef.current = ws;
        }, [setDuration, selectedAudio]);

        return () => {
            cancelled = true;
            ro.disconnect();
            if (wavesurferRef.current) {
                wavesurferRef.current.destroy();
            }
            wavesurferRef.current = null;
        };
    }, [setDuration, selectedAudio]);

    return (
        <div style={{ backgroundColor: theme.panels }} className="p-6 rounded-xl my-2 overflow-hidden">
            <div className="flex">

                {/* Frequency Labels */}
                <div
                    className="relative shrink-0 w-11 items-end pr-1"
                    style={{ marginTop: spectroTop, height: spectroHeight }}
                >
                    {localSampleRate && FREQ_LABELS.map((freq) => (
                        <span
                            key={freq}
                            className="absolute right-1 text-right text-[12px] font-display leading-none"
                            style={{
                                top: Math.min(freqToY(freq, localSampleRate), spectroHeight - 1),
                                transform: 'translateY(-50%)',
                                color: 'white',
                            }}
                        >
                            {freq} Hz
                        </span>
                    ))}
                </div>

                {/* Waveform + Spectrogram + Bounding Box Overlay */}
                <div className="relative w-full overflow-hidden">
                    <div ref={containerRef} className="relative z-10" />

                    <div
                        className="absolute z-50 left-0 right-0"
                        style={{ top: spectroTop, height: spectroHeight, pointerEvents: 'none' }}
                    >
                        <div className="w-full h-full relative" style={{ pointerEvents: 'auto' }}>
                            <BoundingBoxLayer
                                code={code}
                                boxes={boxes}
                                setBoxes={setBoxes}
                                currSelectedBoxId={currSelectedBoxId}
                                setCurrSelectedBoxId={setCurrSelectedBoxId}
                                setDrawingBox={setDrawingBox}
                                canvasWidth={viewWidth}
                                visibleTime={visibleTime}
                                theme={theme}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WaveformSpectrogram;