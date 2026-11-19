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

  const animationClass = isNew
    ? 'tile-appear'
    : isMerged
    ? 'tile-pop'
    : deleted
    ? 'tile-deleted'
    : '';

  const positionClass = `tile-pos-${row}-${col}`;

  return (
    <div
      className={`tile ${valueClass} ${fontScaleClass} ${animationClass} ${positionClass}`}
      style={{
        transform: `translate3d(
          calc(var(--gap) + ${col} * (var(--cell-size) + var(--gap))),
          calc(var(--gap) + ${row} * (var(--cell-size) + var(--gap))),
          0
        )`,
      }}
      data-value={value}
      aria-label={`Tile ${value}`}
    >
      <div className="tile-inner">{value}</div>
    </div>
  );
});

TileView.displayName = 'TileView';
