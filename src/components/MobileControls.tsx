import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Direction } from '../types';

interface MobileControlsProps {
  onMove: (dir: Direction) => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({ onMove }) => {
  return (
    <div className="mobile-dpad-container" aria-label="Touch Direction Controls">
      <div className="dpad-grid">
        <button
          className="dpad-btn dpad-up"
          onClick={() => onMove('UP')}
          aria-label="Move Up"
        >
          <ArrowUp size={22} />
        </button>
        <button
          className="dpad-btn dpad-left"
          onClick={() => onMove('LEFT')}
          aria-label="Move Left"
        >
          <ArrowLeft size={22} />
        </button>
        <button
          className="dpad-btn dpad-right"
          onClick={() => onMove('RIGHT')}
          aria-label="Move Right"
        >
          <ArrowRight size={22} />
        </button>
        <button
          className="dpad-btn dpad-down"
          onClick={() => onMove('DOWN')}
          aria-label="Move Down"
        >
          <ArrowDown size={22} />
        </button>
      </div>
    </div>
  );
};
