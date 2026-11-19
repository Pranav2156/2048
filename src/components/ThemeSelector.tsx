import React, { useRef, useEffect } from 'react';
import { Palette, Check, X } from 'lucide-react';
import { THEMES } from '../themes/themes';
import { ThemeId } from '../types';

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  onSelectTheme: (themeId: ThemeId) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme,
  isOpen,
  onClose,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape or click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const themesList = Object.values(THEMES);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="theme-modal-title">
      <div className="modal-card theme-modal-card modal-pop" ref={panelRef}>
        <div className="theme-modal-header">
          <div className="theme-title-wrap">
            <Palette size={22} className="theme-header-icon" />
            <h3 id="theme-modal-title">Select Color Theme</h3>
          </div>
          <button className="icon-btn-round" onClick={onClose} aria-label="Close theme selector">
            <X size={18} />
          </button>
        </div>

        <p className="theme-modal-desc">
          Choose your favorite visual vibe. Colors adapt across the tiles, board, and glow effects.
        </p>

        <div className="theme-grid">
          {themesList.map((theme) => {
            const isSelected = theme.id === currentTheme;

            return (
              <button
                key={theme.id}
                className={`theme-card-option ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  onSelectTheme(theme.id);
                  onClose();
                }}
              >
                <div className="theme-option-info">
                  <div className="theme-option-title-row">
                    <span className="theme-option-name">{theme.name}</span>
                    {isSelected && <Check size={16} className="theme-check-icon" />}
                  </div>
                  <span className="theme-option-sub">{theme.subtitle}</span>
                </div>

                {/* 4 Swatch color pills */}
                <div className="theme-swatch-pills">
                  {theme.previewColors.map((color, idx) => (
                    <span
                      key={idx}
                      className="swatch-pill"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
