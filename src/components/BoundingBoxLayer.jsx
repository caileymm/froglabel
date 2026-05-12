import { useState, useRef } from 'react';

const BoundingBoxLayer = ({ children, code, boxes, setBoxes, currSelectedBox, setCurrSelectedBox}) => {
    const [activeBox, setActiveBox] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const resizeState = useRef(null);

    const handleMouseDown = (e) => {
        if ((code.length < 3)) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const clickedIndex = boxes.findLastIndex((box) =>
            x >= box.left && x <= box.left + box.width &&
            y >= box.top && y <= box.top + box.height
        ); 

        if (clickedIndex !== -1) {
            setCurrSelectedBox(clickedIndex);
            return;
        }

        setActiveBox({ startX: x, startY: y, currentX: x, currentY: y });
        setIsDrawing(true);
    };

    const handleCornerMouseDown = (e, corner, boxIndex) => {
        e.stopPropagation(); // don't trigger the container's mousedown
        resizeState.current = {
            corner,
            boxIndex,
            startX: e.clientX,
            startY: e.clientY,
            originalBox: { ...boxes[boxIndex] },
        };
    };

    const handleMouseMove = (e) => {
        // Handle resize
        if (resizeState.current) {
            const { corner, boxIndex, startX, startY, originalBox } = resizeState.current;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            setBoxes((prev) => {
                const updated = [...prev];
                const box = { ...originalBox };

                if (corner === 'tl') {
                    box.left = originalBox.left + dx;
                    box.top = originalBox.top + dy;
                    box.width = originalBox.width - dx;
                    box.height = originalBox.height - dy;
                } else if (corner === 'tr') {
                    box.top = originalBox.top + dy;
                    box.width = originalBox.width + dx;
                    box.height = originalBox.height - dy;
                } else if (corner === 'bl') {
                    box.left = originalBox.left + dx;
                    box.width = originalBox.width - dx;
                    box.height = originalBox.height + dy;
                } else if (corner === 'br') {
                    box.width = originalBox.width + dx;
                    box.height = originalBox.height + dy;
                }

                // Minimum size
                if (box.width < 20) { box.width = 20; if (corner === 'tl' || corner === 'bl') box.left = originalBox.left + originalBox.width - 20; }
                if (box.height < 20) { box.height = 20; if (corner === 'tl' || corner === 'tr') box.top = originalBox.top + originalBox.height - 20; }

                updated[boxIndex] = box;
                return updated;
            });
            return;
        }
        
        if (!isDrawing || (code.length < 3)) return;

        const rect = e.currentTarget.getBoundingClientRect();
        setActiveBox((prev) => ({
        ...prev,
        currentX: e.clientX - rect.left,
        currentY: e.clientY - rect.top,
        }));
    };

    const handleMouseUp = () => {
        if (resizeState.current) {
            resizeState.current = null;
            return;
        }
        if (!isDrawing || !activeBox || (code.length < 3)) return;

        const width = Math.abs(activeBox.currentX - activeBox.startX);
        const height = Math.abs(activeBox.currentY - activeBox.startY);

        if (width < 20 || height < 20) {
            setActiveBox(null);
            setIsDrawing(false);
            return;
        }

        const newBox = {
            id: Date.now(),
            left: Math.min(activeBox.startX, activeBox.currentX),
            top: Math.min(activeBox.startY, activeBox.currentY),
            width: Math.abs(activeBox.currentX - activeBox.startX),
            height: Math.abs(activeBox.currentY - activeBox.startY),
            code: code,
        };
        setBoxes((prev) => [...prev, newBox]);
        setActiveBox(null);
        setIsDrawing(false);
    };

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none ${code ? 'cursor-crosshair' : 'cursor-default'}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {children}

      {boxes.map((box, index) => (
        <div
            key={box.id}
            className="absolute border-2 z-40 border-[#C8D9A3] bg-[#C8D9A3]/20 cursor-pointer"
            style={{ left: box.left, top: box.top, width: box.width, height: box.height }}
        >
            {/* Selection outline + corner dots */}
            {currSelectedBox === index && (
            <div className="absolute -inset-[3px] border-2 border-[#60B2D5] pointer-events-none">
                {/* Corner dots */}
                {[
                    { pos: '-top-1 -left-1', corner: 'tl', cursor: 'cursor-nwse-resize' },
                    { pos: '-top-1 -right-1', corner: 'tr', cursor: 'cursor-nesw-resize' },
                    { pos: '-bottom-1 -left-1', corner: 'bl', cursor: 'cursor-nesw-resize' },
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
                <div className='font-display text-xs px-1 bg-[#C8D9A3]'>
                {index + 1}
                </div>
                <div className='font-display text-xs bg-[#C8D9A3] px-1'>
                {box.code}
                </div>
            </div>
            )}
        </div>
        ))}

      {isDrawing && activeBox && (
        <div
          className='absolute border-2 border-[#C8D9A3] bg-[#C8D9A3]/20 pointer-events-none z-50'
          style={{
            left: Math.min(activeBox.startX, activeBox.currentX),
            top: Math.min(activeBox.startY, activeBox.currentY),
            width: Math.abs(activeBox.currentX - activeBox.startX),
            height: Math.abs(activeBox.currentY - activeBox.startY),
          }}
        >
          {(code.length < 3) && (
            <div className='flex justify-between items-center'>
                <div className='font-display text-xs bg-[#C8D9A3] px-1'>
                    {boxes.length + 1}
                </div>
                <div className='font-display text-xs bg-[#C8D9A3] px-1'>
                    {code}
                </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BoundingBoxLayer;