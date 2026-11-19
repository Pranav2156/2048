import React, { useEffect, useRef } from 'react';
import { X, Smartphone, Keyboard } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="help-title">
      <div className="modal-card modal-pop help-card" ref={modalRef}>
        <div className="help-header">
          <h3 id="help-title" className="modal-title">How to Play 2048</h3>
          <button className="icon-btn-round" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="help-content">
          <p className="help-intro">
            Use your <strong>arrow keys</strong>, <strong>WASD</strong>, or <strong>swipe</strong> to move the tiles.
            When two tiles with the same number touch, they <strong>merge into one!</strong>
          </p>

          <div className="help-illustration">
            <div className="help-tile-mini">2</div>
            <span className="help-plus">+</span>
            <div className="help-tile-mini">2</div>
            <span className="help-arrow">➔</span>
            <div className="help-tile-mini help-tile-target">4</div>
          </div>

          <div className="help-section">
            <div className="help-section-title">
              <Keyboard size={16} />
              <span>Keyboard Controls</span>
            </div>
            <ul className="help-list">
              <li>
                <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> or <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> or <kbd>H</kbd> <kbd>J</kbd> <kbd>K</kbd> <kbd>L</kbd> to slide tiles
              </li>
              <li>
                <kbd>Z</kbd> or <kbd>Ctrl+Z</kbd> to Undo last move
              </li>
              <li>
                <kbd>R</kbd> to quickly Restart
              </li>
            </ul>
          </div>

          <div className="help-section">
            <div className="help-section-title">
              <Smartphone size={16} />
              <span>Mobile Gestures</span>
            </div>
            <p className="help-desc">
              Swipe in any direction across the board. The game is optimized for smooth, lag-free touch gestures on any phone or tablet!
            </p>
          </div>

          <div className="help-goal-note">
            🏆 Reach the <strong>2048</strong> tile to win! Once you reach 2048, you can choose to keep going for an even higher record!
          </div>
        </div>

        <button className="btn btn-primary btn-block" onClick={onClose}>
          Got it!
        </button>
      </div>
    </div>
  );
};
