import React from 'react';
import { Trophy, Play, RotateCcw } from 'lucide-react';

interface WinModalProps {
  score: number;
  onContinue: () => void;
  onRestart: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({ score, onContinue, onRestart }) => {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="win-title">
      <div className="modal-card modal-pop">
        <div className="modal-icon-badge win-glow">
          <Trophy size={42} className="trophy-icon" />
        </div>

        <h2 id="win-title" className="modal-title">
          You Reached 2048!
        </h2>

        <p className="modal-subtitle">
          Outstanding work! You&apos;ve conquered the golden tile with a score of{' '}
          <strong className="modal-highlight">{score.toLocaleString()}</strong>!
        </p>

        <p className="modal-question">
          Would you like to keep going to chase <strong>4096</strong> and beyond, or start a fresh round?
        </p>

        <div className="modal-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={onContinue}
            autoFocus
          >
            <Play size={18} />
            <span>Keep Playing</span>
          </button>

          <button
            className="btn btn-secondary btn-lg"
            onClick={onRestart}
          >
            <RotateCcw size={18} />
            <span>New Game</span>
          </button>
        </div>
      </div>
    </div>
  );
};
