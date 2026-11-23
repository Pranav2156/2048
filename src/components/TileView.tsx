import React, { memo } from 'react';
import { Tile } from '../types';

interface TileViewProps {
  tile: Tile;
}

export const TileView: React.FC<TileViewProps> = memo(({ tile }) => {
  const { value, row, col, isNew, isMerged, deleted } = tile;

  // Determine styling class based on value
  const valueClass = value <= 2048 ? `tile-${value}` : 'tile-super';

  // Determine dynamic font scaling based on digit length
  const digits = value.toString().length;
  let fontScaleClass = 'tile-font-lg';
  if (digits === 3) fontScaleClass = 'tile-font-md';
  else if (digits === 4) fontScaleClass = 'tile-font-sm';
  else if (digits >= 5) fontScaleClass = 'tile-font-xs';

  const statusClass = isNew
    ? 'tile-new tile-appear'
    : isMerged
    ? 'tile-merged tile-pop'
    : deleted
    ? 'tile-deleted'
    : '';

  const positionClass = `tile-position-${row + 1}-${col + 1} tile-pos-${row}-${col}`;

  return (
    <div
      className={`tile ${valueClass} ${fontScaleClass} ${positionClass} ${statusClass}`}
      data-value={value}
      aria-label={`Tile ${value}`}
    >
      <div className="tile-inner">{value}</div>
    </div>
  );
});

TileView.displayName = 'TileView';
