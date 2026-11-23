import { useRef } from 'react';
import { Direction } from '../types';

interface TouchGestureOptions {
  onSwipe: (direction: Direction) => void;
  threshold?: number;
}

export function useTouchGesture({ onSwipe, threshold = 12 }: TouchGestureOptions) {
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

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.touches.length !== 1) return;

    const touch = e.touches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    // Fire immediately during movement as soon as threshold is met (matches play2048.co)
    if (Math.max(absX, absY) >= threshold) {
      touchStartRef.current = null; // Consume gesture immediately

      if (absX > absY) {
        onSwipe(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        onSwipe(dy > 0 ? 'DOWN' : 'UP');
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    touchStartRef.current = null;

    if (Math.max(absX, absY) < threshold) {
      return;
    }

    if (absX > absY) {
      onSwipe(dx > 0 ? 'RIGHT' : 'LEFT');
    } else {
      onSwipe(dy > 0 ? 'DOWN' : 'UP');
    }
  };

  // Mouse drag support for PC with immediate move detection
  const mouseStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    mouseStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mouseStartRef.current) return;
    if (e.buttons !== 1) {
      mouseStartRef.current = null;
      return;
    }

    const dx = e.clientX - mouseStartRef.current.x;
    const dy = e.clientY - mouseStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) >= threshold) {
      mouseStartRef.current = null;
      if (absX > absY) {
        onSwipe(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        onSwipe(dy > 0 ? 'DOWN' : 'UP');
      }
    }
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
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
    },
  };
}
