import { useEffect } from 'react';
import { Direction } from '../types';

interface KeyboardOptions {
  onMove: (direction: Direction) => void;
  onUndo?: () => void;
  onRestart?: () => void;
  enabled?: boolean;
}

export function useKeyboard({ onMove, onUndo, onRestart, enabled = true }: KeyboardOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is focusing an input or button
      if (
        document.activeElement &&
        ['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)
      ) {
        return;
      }

      // Check undo (Ctrl+Z or Z or U)
      if ((e.ctrlKey && e.key.toLowerCase() === 'z') || e.key.toLowerCase() === 'z' || e.key.toLowerCase() === 'u') {
        if (onUndo) {
          e.preventDefault();
          onUndo();
          return;
        }
      }

      // Check restart (R)
      if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.metaKey) {
        if (onRestart) {
          e.preventDefault();
          onRestart();
          return;
        }
      }

      let direction: Direction | null = null;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
        case 'k':
        case 'K':
          direction = 'UP';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
        case 'j':
        case 'J':
          direction = 'DOWN';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
        case 'h':
        case 'H':
          direction = 'LEFT';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
        case 'l':
        case 'L':
          direction = 'RIGHT';
          break;
        default:
          return;
      }

      if (direction) {
        e.preventDefault();
        onMove(direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onMove, onUndo, onRestart, enabled]);
}
