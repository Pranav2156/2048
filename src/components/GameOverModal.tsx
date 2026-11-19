import React from 'react';
import { RotateCcw, Undo2, Frown } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  bestScore: number;
  canUndo: boolean;
  onRestart: () => void;
  onUndo: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  bestScore,
  canUndo,
  onRestart,
  onUndo,
}) => {
  const isNewBest = score >= bestScore && score > 0;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="game-over-title">
      <div className="modal-card modal-pop">
        <div className="modal-icon-badge game-over-badge">
          <Frown size={40} />
        </div>

        <h2 id="game-over-title" className="modal-title">
          Game Over!
        </h2>

        <p className="modal-subtitle">
          No more legal moves left on the grid.
          {isNewBest && (
            <span className="modal-new-best"> 🏆 That&apos;s a brand new high score!</span>
          )}
        </p>

        <div className="modal-stats">
          <div className="modal-stat-box">
            <span className="modal-stat-label">Final Score</span>
            <span className="modal-stat-val">{score.toLocaleString()}</span>
          </div>
          <div className="modal-stat-box">
            <span className="modal-stat-label">Best Score</span>
            <span className="modal-stat-val">{bestScore.toLocaleString()}</span>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-primary btn-lg" onClick={onRestart} autoFocus>
            <RotateCcw size={18} />
            <span>Try Again</span>
          </button>

          {canUndo && (
            <button className="btn btn-secondary btn-lg" onClick={onUndo}>
              <Undo2 size={18} />
              <span>Undo Last Move</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
