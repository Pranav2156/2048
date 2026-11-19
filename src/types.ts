export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Tile {
  id: number;
  value: number;
  row: number; // 0 to 3
  col: number; // 0 to 3
  isNew?: boolean;
  isMerged?: boolean;
  deleted?: boolean;
}

export type ThemeId =
  | 'classic'
  | 'cyberpunk'
  | 'nordic'
  | 'matcha'
  | 'sunset'
  | 'coffee'
  | 'synthwave';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  subtitle: string;
  previewColors: [string, string, string, string]; // 4 colors for swatch preview
  variables: Record<string, string>;
}

export type GameStatus = 'PLAYING' | 'WON' | 'GAME_OVER';

export interface ScorePopup {
  id: number;
  value: number;
}

export interface GameSnapshot {
  tiles: Tile[];
  score: number;
  status: GameStatus;
  wonAcknowledged: boolean;
  nextId: number;
}
