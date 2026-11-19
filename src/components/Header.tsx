import React, { useState } from 'react';
import {
  RotateCcw,
  Undo2,
  Palette,
  Volume2,
  VolumeX,
  HelpCircle,
} from 'lucide-react';
import { ScorePopup, ThemeId } from '../types';
import { ScoreBubble } from './ScoreBubble';
import { THEMES } from '../themes/themes';
import { sound } from '../utils/sound';

interface HeaderProps {
  score: number;
  bestScore: number;
  scorePopups: ScorePopup[];
  currentTheme: ThemeId;
  canUndo: boolean;
  onOpenTheme: () => void;
  onOpenHelp: () => void;
  onRestart: () => void;
  onUndo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  bestScore,
  scorePopups,
  currentTheme,
  canUndo,
  onOpenTheme,
  onOpenHelp,
  onRestart,
  onUndo,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getMuted());

  const handleToggleSound = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  const activeTheme = THEMES[currentTheme];

  return (
    <header className="game-header">
      {/* Upper row: Title & Score Boards */}
      <div className="header-top-row">
        <div className="brand-section">
          <h1 className="brand-title">2048</h1>
          <span className="brand-badge" style={{ backgroundColor: activeTheme.previewColors[3] }}>
            {activeTheme.name}
          </span>
        </div>

        <div className="scores-wrapper">
          <div className="score-card current-score">
            <span className="score-label">SCORE</span>
            <span className="score-value">{score.toLocaleString()}</span>
            <ScoreBubble popups={scorePopups} />
          </div>

          <div className="score-card best-score">
            <span className="score-label">BEST</span>
            <span className="score-value">{bestScore.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Action Controls Bar */}
      <div className="header-actions-row">
        <div className="actions-group-left">
          <button
            className="btn btn-action"
            onClick={onOpenTheme}
            title="Change Theme"
            aria-label="Change Theme"
          >
            <Palette size={17} />
            <span className="btn-label-desktop">Theme</span>
          </button>

          <button
            className="btn btn-action"
            onClick={handleToggleSound}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>

          <button
            className="btn btn-action"
            onClick={onOpenHelp}
            title="How to play"
            aria-label="How to play"
          >
            <HelpCircle size={17} />
          </button>
        </div>

        <div className="actions-group-right">
          <button
            className="btn btn-action"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo last move (Z)"
            aria-label="Undo last move"
          >
            <Undo2 size={17} />
            <span className="btn-label-desktop">Undo</span>
          </button>

          <button
            className="btn btn-primary"
            onClick={onRestart}
            title="Start new game (R)"
            aria-label="Start new game"
          >
            <RotateCcw size={17} />
            <span>New Game</span>
          </button>
        </div>
      </div>
    </header>
  );
};
