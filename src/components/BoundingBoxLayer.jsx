import { useState, useRef, useEffect } from 'react';

const BoundingBoxLayer = ({ code, boxes, setBoxes, currSelectedBox, setCurrSelectedBox, setDrawingBox, canvasWidth }) => {
    const [activeBox, setActiveBox] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [localWidth, setLocalWidth] = useState(0);
    const resizeState = useRef(null);
    const containerRef = useRef(null);

    // Track container width in state so it's safe to use during render
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

    // Use canvasWidth when available, otherwise fall back to localWidth
    const effectiveWidth = canvasWidth > 0 ? canvasWidth : localWidth > 0 ? localWidth : 1;

    const toPixels = (box) => ({
        ...box,
        left:   (box.leftPct  ?? 0) * effectiveWidth,
        width:  (box.widthPct ?? 0) * effectiveWidth,
        top:    box.top,
        height: box.height,
    });

    const toNorm = (left, width) => ({
        leftPct:  effectiveWidth > 0 ? left  / effectiveWidth : 0,
        widthPct: effectiveWidth > 0 ? width / effectiveWidth : 0,
    });

    // ─── Mouse down ───────────────────────────────────────────────────────────
    const handleMouseDown = (e) => {
        if (code.length < 3) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const clickedIndex = boxes.findLastIndex((box) => {
            const px = toPixels(box);
            return x >= px.left && x <= px.left + px.width &&
                   y >= px.top  && y <= px.top  + px.height;
        });

        if (clickedIndex !== -1) {
            setCurrSelectedBox(clickedIndex);
            setDrawingBox?.(null);
            return;
        }

        setActiveBox({ startX: x, startY: y, currentX: x, currentY: y });
        setIsDrawing(true);
    };

    const handleCornerMouseDown = (e, corner, boxIndex) => {
        e.stopPropagation();
        setCurrSelectedBox(boxIndex);
        resizeState.current = {
            corner,
            boxIndex,
            startX: e.clientX,
            startY: e.clientY,
            originalPx:  toPixels(boxes[boxIndex]),
            originalBox: { ...boxes[boxIndex] },
        };
    };

    // ─── Mouse move ───────────────────────────────────────────────────────────
    const handleMouseMove = (e) => {
        // Resize
        if (resizeState.current) {
            const { corner, boxIndex, startX, startY, originalPx, originalBox } = resizeState.current;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            let { left, top, width, height } = originalPx;

            if (corner === 'tl') { left += dx; top += dy; width -= dx; height -= dy; }
            if (corner === 'tr') {              top += dy; width += dx; height -= dy; }
            if (corner === 'bl') { left += dx;             width -= dx; height += dy; }
            if (corner === 'br') {                          width += dx; height += dy; }

            if (width  < 20) { width  = 20; if (corner === 'tl' || corner === 'bl') left = originalPx.left + originalPx.width  - 20; }
            if (height < 20) { height = 20; if (corner === 'tl' || corner === 'tr') top  = originalPx.top  + originalPx.height - 20; }

            const norm = toNorm(left, width);
            setDrawingBox?.({ ...norm, top, height, code: originalBox.code });
            setBoxes((prev) => {
                const updated = [...prev];
                updated[boxIndex] = { ...originalBox, ...norm, top, height };
                return updated;
            });
            return;
        }

        // Draw
        if (!isDrawing || code.length < 3 || !activeBox) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const newX = e.clientX - rect.left;
        const newY = e.clientY - rect.top;

        setActiveBox((prev) => ({ ...prev, currentX: newX, currentY: newY }));

        const left   = Math.min(activeBox.startX, newX);
        const width  = Math.abs(newX - activeBox.startX);
        const top    = Math.min(activeBox.startY, newY);
        const height = Math.abs(newY - activeBox.startY);
        setDrawingBox?.({ ...toNorm(left, width), top, height, code });
    };

    // ─── Mouse up ─────────────────────────────────────────────────────────────
    const handleMouseUp = () => {
        if (resizeState.current) {
            resizeState.current = null;
            setDrawingBox?.(null);
            return;
        }

        if (!isDrawing || !activeBox || code.length < 3) return;

        const width  = Math.abs(activeBox.currentX - activeBox.startX);
        const height = Math.abs(activeBox.currentY - activeBox.startY);

        if (width < 20 || height < 20) {
            setActiveBox(null);
            setIsDrawing(false);
            return;
        }

        const left = Math.min(activeBox.startX, activeBox.currentX);
        const top  = Math.min(activeBox.startY, activeBox.currentY);

        setBoxes((prev) => [...prev, {
            id: Date.now(),
            ...toNorm(left, width),
            top,
            height,
            code,
        }]);

        setActiveBox(null);
        setIsDrawing(false);
        setDrawingBox?.(null);
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full overflow-hidden select-none ${code ? 'cursor-crosshair' : 'cursor-default'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {boxes.map((box, index) => {
                const px = toPixels(box);
                return (
                    <div
                        key={box.id}
                        className="absolute border-2 z-40 border-[#C8D9A3] bg-[#C8D9A3]/20 cursor-pointer"
                        style={{ left: px.left, top: px.top, width: px.width, height: px.height }}
                    >
                        {currSelectedBox === index && (
                            <div className="absolute -inset-[3px] border-2 border-[#60B2D5] pointer-events-none">
                                {[
                                    { pos: '-top-1 -left-1',     corner: 'tl', cursor: 'cursor-nwse-resize' },
                                    { pos: '-top-1 -right-1',    corner: 'tr', cursor: 'cursor-nesw-resize' },
                                    { pos: '-bottom-1 -left-1',  corner: 'bl', cursor: 'cursor-nesw-resize' },
                                    { pos: '-bottom-1 -right-1', corner: 'br', cursor: 'cursor-nwse-resize' },
                                ].map(({ pos, corner, cursor }) => (
                                    <div
                                        key={corner}
                                        className={`absolute ${pos} ${cursor} w-2 h-2 bg-[#60B2D5] rounded-full pointer-events-auto`}
                                        onMouseDown={(e) => handleCornerMouseDown(e, corner, index)}
                                    />
                                ))}
                            </div>
                        )}

                        {box.code && (
                            <div className='flex justify-between items-center'>
                                <div className='font-display text-xs px-1 bg-[#C8D9A3]'>{index + 1}</div>
                                <div className='font-display text-xs bg-[#C8D9A3] px-1'>{box.code}</div>
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
                    <div className='flex justify-between items-center'>
                        <div className='font-display text-xs bg-[#C8D9A3] px-1'>{boxes.length + 1}</div>
                        <div className='font-display text-xs bg-[#C8D9A3] px-1'>{code}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BoundingBoxLayer;