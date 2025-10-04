"use client";

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OSWindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onFocus: (id: string) => void;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: string; height: string };
  zIndex: number;
  isActive: boolean;
}

const OSWindow: React.FC<OSWindowProps> = ({
  id,
  title,
  children,
  onClose,
  onMinimize,
  onFocus,
  initialPosition = { x: window.innerWidth / 2 - 250, y: window.innerHeight / 2 - 150 },
  initialSize = { width: '500px', height: '300px' },
  zIndex,
  isActive,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const windowRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (windowRef.current) {
      windowRef.current.style.left = `${position.x}px`;
      windowRef.current.style.top = `${position.y}px`;
      windowRef.current.style.width = size.width;
      windowRef.current.style.height = size.height;
    }
  }, [position, size]);

  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus(id);
    if (!headerRef.current || !windowRef.current) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = windowRef.current.offsetLeft;
    const startTop = windowRef.current.offsetTop;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newX = startLeft + (moveEvent.clientX - startX);
      const newY = startTop + (moveEvent.clientY - startY);
      setPosition({ x: newX, y: newY });
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation(); // Prevent dragging when resizing
    onFocus(id);
    if (!windowRef.current) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = windowRef.current.offsetWidth;
    const startHeight = windowRef.current.offsetHeight;
    const startLeft = windowRef.current.offsetLeft;
    const startTop = windowRef.current.offsetTop;

    const onMouseMove = (moveEvent: MouseEvent) => {
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newLeft = startLeft;
      let newTop = startTop;

      if (direction.includes('right')) {
        newWidth = startWidth + (moveEvent.clientX - startX);
      }
      if (direction.includes('left')) {
        newWidth = startWidth - (moveEvent.clientX - startX);
        newLeft = startLeft + (moveEvent.clientX - startX);
      }
      if (direction.includes('bottom')) {
        newHeight = startHeight + (moveEvent.clientY - startY);
      }
      if (direction.includes('top')) {
        newHeight = startHeight - (moveEvent.clientY - startY);
        newTop = startTop + (moveEvent.clientY - startY);
      }

      // Apply minimum size constraints
      newWidth = Math.max(300, newWidth);
      newHeight = Math.max(200, newHeight);

      setSize({ width: `${newWidth}px`, height: `${newHeight}px` });
      setPosition({ x: newLeft, y: newTop });
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div
      ref={windowRef}
      className={cn(
        "absolute bg-[#1a2033] rounded-xl shadow-2xl overflow-hidden min-w-[300px] min-h-[200px] flex flex-col",
        isActive ? "ring-2 ring-indigo-500" : "ring-1 ring-gray-700"
      )}
      style={{ zIndex }}
      onMouseDown={() => onFocus(id)}
    >
      <div
        ref={headerRef}
        className="flex justify-between items-center p-3 bg-[#2d3748] rounded-t-xl cursor-grab"
        onMouseDown={handleMouseDown}
      >
        <span className="text-sm font-semibold text-white">{title}</span>
        <div className="flex space-x-2">
          <button
            className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400"
            onClick={() => onMinimize(id)}
            aria-label="Minimize"
          ></button>
          <button
            className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400"
            onClick={() => onClose(id)}
            aria-label="Close"
          ></button>
        </div>
      </div>
      <div className="flex-grow p-4 overflow-y-auto text-gray-300 custom-scrollbar">
        {children}
      </div>

      {/* Resize Handles */}
      <div className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'top-left')} />
      <div className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'top-right')} />
      <div className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-left')} />
      <div className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-right')} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-2 cursor-n-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'top')} />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-2 cursor-s-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'bottom')} />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1/2 w-2 cursor-w-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'left')} />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-1/2 w-2 cursor-e-resize" onMouseDown={(e) => handleResizeMouseDown(e, 'right')} />
    </div>
  );
};

export default OSWindow;