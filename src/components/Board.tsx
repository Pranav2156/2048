import React from 'react';
import { Direction, Tile } from '../types';
import { TileView } from './TileView';
import { useTouchGesture } from '../hooks/useTouchGesture';

interface BoardProps {
  tiles: Tile[];
  onSwipe: (dir: Direction) => void;
}

export const Board: React.FC<BoardProps> = ({ tiles, onSwipe }) => {
  const { touchHandlers } = useTouchGesture({ onSwipe });

  // 16 background grid slots
  const backgroundCells = Array.from({ length: 16 }, (_, i) => i);

  return (
    <div
      className="board-container"
      {...touchHandlers}
      tabIndex={0}
      role="region"
      aria-label="2048 Game Board"
    >
      {/* Background empty grid cells */}
      <div className="grid-background">
        {backgroundCells.map((i) => (
          <div key={`cell-${i}`} className="grid-cell" />
        ))}
      </div>

      {/* Dynamic Animated Tiles */}
      <div className="tiles-container">
        {tiles.map((tile) => (
          <TileView key={tile.id} tile={tile} />
        ))}
      </div>
    </div>
  );
};
