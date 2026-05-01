import { useState } from 'react';

const BoundingBoxLayer = ({ children }) => {
    const [boxes, setBoxes] = useState([]);
    const [activeBox, setActiveBox] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const handleMouseDown = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setActiveBox({ startX: x, startY: y, currentX: x, currentY: y });

        setIsDrawing(true)
    };

    const handleMouseMove = (e) => {
        if (!isDrawing) return;

        const rect = e.currentTarget.getBoundingClientRect();
        setActiveBox((prev) => ({
            ...prev,
            currentX: e.clientX - rect.left,
            currentY: e.clientY - rect.top,
        }));
    };

    const handleMouseUp = () => {
        if (!isDrawing || !activeBox) return;

        const newBox = {
            id: Date.now(),
            left: Math.min(activeBox.startX, activeBox.currentX),
            top: Math.min(activeBox.startY, activeBox.currentY),
            width: Math.abs(activeBox.currentX - activeBox.startX),
            height: Math.abs(activeBox.currentY - activeBox.startY),
        };

        setBoxes((prev) => [...prev, newBox]);
        setActiveBox(null);
        setIsDrawing(false);
    };

    return (
        <div 
            className="relative w-full overflow-hidden select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {children}

            {boxes.map((box) => (
                <div
                    key={box.id}
                    className="absolute border-2 border-[#C8D9A3] bg-[#C8D9A3]/20 z-40"
                    style={{
                        left: box.left,
                        top: box.top,
                        width: box.width,
                        height: box.height,
                    }}
                />
            ))}

            {isDrawing && activeBox && (
                <div
                    className="absolute border-2 border-[#C8D9A3] bg-[#C8D9A3]/20 pointer-events-none z-50"
                    style={{
                        left: Math.min(activeBox.startX, activeBox.currentX),
                        top: Math.min(activeBox.startY, activeBox.currentY),
                        width: Math.abs(activeBox.currentX - activeBox.startX),
                        height: Math.abs(activeBox.currentY - activeBox.startY),
                    }}
                />
            )}
        </div>
    );
};

export default BoundingBoxLayer;