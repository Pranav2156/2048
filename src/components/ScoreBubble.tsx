import React from 'react';
import { ScorePopup } from '../types';

interface ScoreBubbleProps {
  popups: ScorePopup[];
}

export const ScoreBubble: React.FC<ScoreBubbleProps> = ({ popups }) => {
  return (
    <div className="score-popups-container" aria-hidden="true">
      {popups.map((popup) => (
        <span key={popup.id} className="score-popup-item">
          +{popup.value}
        </span>
      ))}
    </div>
  );
};
