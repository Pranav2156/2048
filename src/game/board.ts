import { Direction, Tile } from '../types';

export const BOARD_SIZE = 4;

export interface MoveOutcome {
  moved: boolean;
  slidingTiles: Tile[];
  mergedTiles: Tile[];
  scoreGained: number;
  nextId: number;
  has2048: boolean;
}

/**
 * Returns a 4x4 matrix of active tiles (excluding deleted ones).
 */
export function getBoardMatrix(tiles: Tile[]): (Tile | null)[][] {
  const matrix: (Tile | null)[][] = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );

  for (const tile of tiles) {
    if (!tile.deleted) {
      matrix[tile.row][tile.col] = tile;
    }
  }

  return matrix;
}

/**
 * Spawns a new tile in a random unoccupied cell.
 */
export function spawnRandomTile(tiles: Tile[], nextId: number): { tile: Tile | null; nextId: number } {
  const matrix = getBoardMatrix(tiles);
  const emptyCells: { r: number; c: number }[] = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (!matrix[r][c]) {
        emptyCells.push({ r, c });
      }
    }
  }

  if (emptyCells.length === 0) {
    return { tile: null, nextId };
  }

  const chosen = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const value = Math.random() < 0.9 ? 2 : 4;

  const newTile: Tile = {
    id: nextId,
    value,
    row: chosen.r,
    col: chosen.c,
    isNew: true,
  };

  return { tile: newTile, nextId: nextId + 1 };
}

/**
 * Initializes a new board with 2 random tiles.
 */
export function initBoard(): { tiles: Tile[]; nextId: number } {
  let nextId = 1;
  const tiles: Tile[] = [];

  const first = spawnRandomTile(tiles, nextId);
  if (first.tile) {
    tiles.push(first.tile);
    nextId = first.nextId;
  }

  const second = spawnRandomTile(tiles, nextId);
  if (second.tile) {
    tiles.push(second.tile);
    nextId = second.nextId;
  }

  return { tiles, nextId };
}

/**
 * Executes a move in the given direction.
 * Accurately tracks positions, animations, merges, and scores.
 */
export function executeMove(
  currentTiles: Tile[],
  direction: Direction,
  initialNextId: number
): MoveOutcome {
  // Only work with active tiles for calculating the move
  const activeTiles = currentTiles.filter((t) => !t.deleted);
  let nextId = initialNextId;
  let scoreGained = 0;
  let moved = false;
  let has2048 = false;

  const slidingResult: Tile[] = [];
  const mergedResult: Tile[] = [];

  // Determine iteration order based on direction
  const isHorizontal = direction === 'LEFT' || direction === 'RIGHT';
  const isForward = direction === 'RIGHT' || direction === 'DOWN';

  for (let primary = 0; primary < BOARD_SIZE; primary++) {
    // Collect tiles in the current line (row or column)
    const lineTiles = activeTiles.filter((t) =>
      isHorizontal ? t.row === primary : t.col === primary
    );

    // Sort by secondary coordinate
    lineTiles.sort((a, b) => {
      const posA = isHorizontal ? a.col : a.row;
      const posB = isHorizontal ? b.col : b.row;
      return isForward ? posB - posA : posA - posB;
    });

    let targetSecondary = isForward ? BOARD_SIZE - 1 : 0;
    const step = isForward ? -1 : 1;

    for (let i = 0; i < lineTiles.length; i++) {
      const current = lineTiles[i];
      const next = lineTiles[i + 1];

      // Check if current tile can merge with next tile
      if (next && current.value === next.value) {
        const targetRow = isHorizontal ? primary : targetSecondary;
        const targetCol = isHorizontal ? targetSecondary : primary;

        if (current.row !== targetRow || current.col !== targetCol || next.row !== targetRow || next.col !== targetCol) {
          moved = true;
        }

        const mergedValue = current.value * 2;
        scoreGained += mergedValue;
        moved = true;

        if (mergedValue === 2048) {
          has2048 = true;
        }

        // Phase 1 (Sliding): current slides to target, next slides into target on top
        slidingResult.push({
          ...current,
          row: targetRow,
          col: targetCol,
          isNew: false,
          isMerged: false,
        });

        slidingResult.push({
          ...next,
          row: targetRow,
          col: targetCol,
          deleted: true,
          isNew: false,
          isMerged: false,
        });

        // Phase 2 (Fused): current retains its identity/DOM node and smoothly upgrades to mergedValue
        // next is absorbed, preventing any blinking or disappearance
        mergedResult.push({
          ...current,
          row: targetRow,
          col: targetCol,
          value: mergedValue,
          isMerged: true,
          isNew: false,
        });

        // Skip the merged tile
        i++;
        targetSecondary += step;
      } else {
        // No merge, just slide to targetSecondary
        const targetRow = isHorizontal ? primary : targetSecondary;
        const targetCol = isHorizontal ? targetSecondary : primary;

        if (current.row !== targetRow || current.col !== targetCol) {
          moved = true;
        }

        const movedTile: Tile = {
          ...current,
          row: targetRow,
          col: targetCol,
          isNew: false,
          isMerged: false,
        };

        slidingResult.push(movedTile);
        mergedResult.push(movedTile);

        targetSecondary += step;
      }
    }
  }

  // If nothing moved, return original state
  if (!moved) {
    return {
      moved: false,
      slidingTiles: currentTiles,
      mergedTiles: currentTiles,
      scoreGained: 0,
      nextId: initialNextId,
      has2048: false,
    };
  }

  // Spawn a new tile into the merged state
  const spawnRes = spawnRandomTile(mergedResult, nextId);
  if (spawnRes.tile) {
    mergedResult.push(spawnRes.tile);
    slidingResult.push(spawnRes.tile);
    nextId = spawnRes.nextId;
  }

  return {
    moved: true,
    slidingTiles: slidingResult,
    mergedTiles: mergedResult,
    scoreGained,
    nextId,
    has2048,
  };
}

/**
 * Clean up deleted tiles and reset animation flags after animation finishes.
 */
export function purgeDeletedTiles(tiles: Tile[]): Tile[] {
  return tiles
    .filter((t) => !t.deleted)
    .map((t) => ({
      ...t,
      isNew: false,
      isMerged: false,
    }));
}

/**
 * Checks if there are any valid moves remaining on the board.
 */
export function canMove(tiles: Tile[]): boolean {
  const active = tiles.filter((t) => !t.deleted);
  if (active.length < BOARD_SIZE * BOARD_SIZE) {
    return true; // There are empty cells
  }

  const matrix = getBoardMatrix(tiles);

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const tile = matrix[r][c];
      if (!tile) return true;

      // Check right neighbor
      if (c < BOARD_SIZE - 1 && matrix[r][c + 1]?.value === tile.value) {
        return true;
      }
      // Check down neighbor
      if (r < BOARD_SIZE - 1 && matrix[r + 1][c]?.value === tile.value) {
        return true;
      }
    }
  }

  return false;
}
