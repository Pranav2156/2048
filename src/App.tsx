import React, { useState, useEffect } from 'react';
import { useGame } from './hooks/useGame';
import { useKeyboard } from './hooks/useKeyboard';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { WinModal } from './components/WinModal';
import { GameOverModal } from './components/GameOverModal';
import { ThemeSelector } from './components/ThemeSelector';
import { HowToPlayModal } from './components/HowToPlayModal';
import { MobileControls } from './components/MobileControls';
import { THEMES } from './themes/themes';
import { ThemeId } from './types';
import { Smartphone } from 'lucide-react';

const STORAGE_KEY_THEME = '2048_theme_id_v1';

export const App: React.FC = () => {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME) as ThemeId;
    return saved && THEMES[saved] ? saved : 'classic';
  });

  const [isThemeOpen, setIsThemeOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [showDpad, setShowDpad] = useState<boolean>(false);

  const {
    tiles,
    score,
    bestScore,
    status,
    scorePopups,
    canUndo,
    move,
    continueGame,
    restart,
    undo,
  } = useGame();

  // Apply theme CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const themeConfig = THEMES[themeId] || THEMES.classic;

    Object.entries(themeConfig.variables).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });

    localStorage.setItem(STORAGE_KEY_THEME, themeId);
  }, [themeId]);

  // Keyboard navigation
  useKeyboard({
    onMove: move,
    onUndo: undo,
    onRestart: restart,
    enabled: !isThemeOpen && !isHelpOpen,
  });

  return (
    <div className="game-wrapper" data-theme={themeId}>
      <div className="game-container">
        {/* Header with Title, Scores & Actions */}
        <Header
          score={score}
          bestScore={bestScore}
          scorePopups={scorePopups}
          currentTheme={themeId}
          canUndo={canUndo}
          onOpenTheme={() => setIsThemeOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
          onRestart={restart}
          onUndo={undo}
        />

        {/* The 2048 Board */}
        <main className="board-area">
          <Board tiles={tiles} onSwipe={move} />

          {/* Win Modal: Greet the user when reaching 2048 and ask to continue or restart */}
          {status === 'WON' && (
            <WinModal
              score={score}
              onContinue={continueGame}
              onRestart={restart}
            />
          )}

          {/* Game Over Modal */}
          {status === 'GAME_OVER' && (
            <GameOverModal
              score={score}
              bestScore={bestScore}
              canUndo={canUndo}
              onRestart={restart}
              onUndo={undo}
            />
          )}
        </main>

        {/* Footer controls & hints */}
        <footer className="game-footer">
          <div className="footer-tips">
            <span className="tip-desktop">
              Tip: Use <strong>Arrow keys</strong>, <strong>WASD</strong>, or <strong>Vim (HJKL)</strong> to move • <strong>Z</strong> to undo
            </span>
            <span className="tip-mobile">
              Swipe on the board in any direction to move tiles
            </span>
          </div>

          <div className="footer-tools">
            <button
              className={`btn btn-toggle-dpad ${showDpad ? 'active' : ''}`}
              onClick={() => setShowDpad((prev) => !prev)}
              aria-label="Toggle on-screen D-pad buttons"
            >
              <Smartphone size={15} />
              <span>{showDpad ? 'Hide Touch D-Pad' : 'Show Touch D-Pad'}</span>
            </button>
          </div>

          {showDpad && <MobileControls onMove={move} />}
        </footer>
      </div>

      {/* Theme Selector Modal */}
      <ThemeSelector
        currentTheme={themeId}
        onSelectTheme={setThemeId}
        isOpen={isThemeOpen}
        onClose={() => setIsThemeOpen(false)}
      />

      {/* How to Play Modal */}
      <HowToPlayModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
};

export default App;
