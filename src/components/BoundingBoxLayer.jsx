import { useState, useRef, useEffect } from 'react';

const BoundingBoxLayer = ({ 
    code,
    boxes,
    setBoxes, 
    currSelectedBoxId, 
    setCurrSelectedBoxId, 
    setDrawingBox, 
    canvasWidth, 
    visibleTime, // ADDED: Must be in props to react to zoom/scroll
}) => {
    const [activeBox, setActiveBox] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [localWidth, setLocalWidth] = useState(0);
    const resizeState = useRef(null);
    const containerRef = useRef(null);

    // Track width for responsiveness
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        setLocalWidth(el.clientWidth);
        const ro = new ResizeObserver(([entry]) => {
            setLocalWidth(entry.contentRect.width);
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const effectiveWidth = canvasWidth > 0 ? canvasWidth : localWidth > 0 ? localWidth : 1;

    // ─── Converters ──────────────────────────────────────────────────────────
    
    // Calculate the duration of the current "window" (e.g., 5 seconds visible)
    const viewDuration = visibleTime.end - visibleTime.start;

    // Time -> Pixels (relative to the left edge of the visible window)
    const timeToPx = (time) => {
        const offsetTime = time - visibleTime.start;
        return (offsetTime / viewDuration) * effectiveWidth;
    };
    
    // Pixels -> Time (converts a click on the screen to an absolute timestamp)
    const pxToTime = (px) => {
        const timeOffset = (px / effectiveWidth) * viewDuration;
        return visibleTime.start + timeOffset;
    };

    const toPixels = (box) => ({
        ...box,
        left:   timeToPx(box.startTime),
        width:  timeToPx(box.endTime) - timeToPx(box.startTime),
        top:    box.top,
        height: box.height,
    });

    // ─── Mouse Handlers ──────────────────────────────────────────────────────

    const handleMouseDown = (e) => {
        if (!code || code.length < 3) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const clickedBox = boxes.findLast((box) => {
            const px = toPixels(box);
            return x >= px.left && x <= px.left + px.width &&
                   y >= px.top  && y <= px.top  + px.height;
        });

        if (clickedBox) {
            setCurrSelectedBoxId(clickedBox.id);
            setDrawingBox?.(null);
            return;
        }

        setActiveBox({ startX: x, startY: y, currentX: x, currentY: y });
        setIsDrawing(true);
    };

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (resizeState.current) {
            const { corner, boxId, startX, startY, originalPx, originalBox } = resizeState.current;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            let { left, top, width, height } = originalPx;

            if (corner === 'tl') { left += dx; top += dy; width -= dx; height -= dy; }
            if (corner === 'tr') {              top += dy; width += dx; height -= dy; }
            if (corner === 'bl') { left += dx;             width -= dx; height += dy; }
            if (corner === 'br') {                          width += dx; height += dy; }

            width = Math.max(20, width);
            height = Math.max(20, height);

            const startTime = pxToTime(left);
            const endTime = pxToTime(left + width);

            setDrawingBox?.({ startTime, endTime, top, height, code: originalBox.code });
            
            setBoxes((prev) => prev.map(b => 
                b.id === boxId ? { ...originalBox, startTime, endTime, top, height } : b
            ));
            return;
        }

        if (!isDrawing || !activeBox) return;

        setActiveBox((prev) => ({ ...prev, currentX: x, currentY: y }));

        const left   = Math.min(activeBox.startX, x);
        const width  = Math.abs(x - activeBox.startX);
        const top    = Math.min(activeBox.startY, y);
        const height = Math.abs(y - activeBox.startY);
        
        setDrawingBox?.({ 
            startTime: pxToTime(left), 
            endTime: pxToTime(left + width), 
            top, 
            height, 
            code 
        });
    };

    const handleMouseUp = (e) => {
        if (resizeState.current) {
            resizeState.current = null;
            setDrawingBox?.(null);
            return;
        }

        if (!isDrawing || !activeBox) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const finalX = e.clientX - rect.left;
        const finalY = e.clientY - rect.top;

        const width  = Math.abs(finalX - activeBox.startX);
        const height = Math.abs(finalY - activeBox.startY);

        if (width >= 10 && height >= 10) {
            const left = Math.min(activeBox.startX, finalX);
            const top  = Math.min(activeBox.startY, finalY);

            setBoxes((prev) => [...prev, {
                id: Date.now(),
                startTime: pxToTime(left),
                endTime: pxToTime(left + width),
                top,
                height,
                code,
            }]);
        }

        setActiveBox(null);
        setIsDrawing(false);
        setDrawingBox?.(null);
    };

    const handleCornerMouseDown = (e, corner, boxId) => {
        e.stopPropagation();
        setCurrSelectedBoxId(boxId);
        
        const masterBox = boxes.find(b => b.id === boxId);
        if (!masterBox) return;

        resizeState.current = {
            corner,
            boxId,
            startX: e.clientX,
            startY: e.clientY,
            originalPx:  toPixels(masterBox),
            originalBox: { ...masterBox },
        };
    };

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 z-40 select-none ${code ? 'cursor-crosshair' : 'cursor-default'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {boxes.map((box) => {
                const px = toPixels(box);
                const isSelected = box.id === currSelectedBoxId;
                
                // Optimization: Don't render if completely out of view
                if (px.left + px.width < 0 || px.left > effectiveWidth) return null;

                return (
                    <div
                        key={box.id}
                        className={`absolute border-2 z-40 bg-[#C8D9A3]/20 cursor-pointer 
                                   ${isSelected ? 'border-[#60B2D5]' : 'border-[#C8D9A3]'}`}
                        style={{ left: px.left, top: px.top, width: px.width, height: px.height }}
                    >
                        {isSelected && (
                            <div className="absolute -inset-[3px] border-2 border-[#60B2D5] pointer-events-none">
                                {[
                                    { pos: '-top-1 -left-1',     corner: 'tl', cursor: 'cursor-nwse-resize' },
                                    { pos: '-top-1 -right-1',    corner: 'tr', cursor: 'cursor-nesw-resize' },
                                    { pos: '-bottom-1 -left-1',  corner: 'bl', cursor: 'cursor-nesw-resize' },
                                    { pos: '-bottom-1 -right-1', corner: 'br', cursor: 'cursor-nwse-resize' },
                                ].map(({ pos, corner, cursor }) => (
                                    <div
                                        key={corner}
                                        className={`absolute ${pos} ${cursor} w-2.5 h-2.5 bg-[#60B2D5] rounded-full pointer-events-auto shadow-sm`}
                                        onMouseDown={(e) => handleCornerMouseDown(e, corner, box.id)}
                                    />
                                ))}
                            </div>
                        )}

                        {box.code && (
                            <div className='flex justify-between items-center pointer-events-none'>
                                <div className='font-display text-[10px] px-1 bg-[#C8D9A3] text-black'>
                                    {box.code}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            {isDrawing && activeBox && (
                <div
                    className='absolute border-2 border-[#C8D9A3] bg-[#C8D9A3]/20 pointer-events-none z-50'
                    style={{
                        left:   Math.min(activeBox.startX, activeBox.currentX),
                        top:    Math.min(activeBox.startY, activeBox.currentY),
                        width:  Math.abs(activeBox.currentX - activeBox.startX),
                        height: Math.abs(activeBox.currentY - activeBox.startY),
                    }}
                >
                    <div className='font-display text-[10px] bg-[#C8D9A3] w-fit px-1'>{code}</div>
                </div>
            )}
        </div>
    );
};

export default BoundingBoxLayer;