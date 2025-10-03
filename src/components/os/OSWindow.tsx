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
      <div className="flex-grow p-4 overflow-y-auto text-gray-300">
        {children}
      </div>
    </div>
  );
};

export default OSWindow;