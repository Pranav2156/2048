import { useRef } from 'react';
import { Direction } from '../types';

interface TouchGestureOptions {
  onSwipe: (direction: Direction) => void;
  threshold?: number;
}

export function useTouchGesture({ onSwipe, threshold = 35 }: TouchGestureOptions) {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    if (e.changedTouches.length === 0) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    touchStartRef.current = null;

    // Must exceed minimum distance
    if (Math.max(absX, absY) < threshold) {
      return;
    }

    // Determine primary direction
    if (absX > absY) {
      onSwipe(dx > 0 ? 'RIGHT' : 'LEFT');
    } else {
      onSwipe(dy > 0 ? 'DOWN' : 'UP');
    }
  };

  // Optional mouse drag swipe support for PC testing or desktop touchscreens
  const mouseStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only primary mouse button
    if (e.button !== 0) return;
    mouseStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!mouseStartRef.current) return;
    const dx = e.clientX - mouseStartRef.current.x;
    const dy = e.clientY - mouseStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    mouseStartRef.current = null;

    if (Math.max(absX, absY) < threshold) {
      return;
    }

    if (absX > absY) {
      onSwipe(dx > 0 ? 'RIGHT' : 'LEFT');
    } else {
      onSwipe(dy > 0 ? 'DOWN' : 'UP');
    }
  };

  return {
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
    },
  };
}
