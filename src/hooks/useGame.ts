import { useState, useEffect, useRef, useCallback } from 'react';
import { Direction, GameSnapshot, GameStatus, ScorePopup, Tile } from '../types';
import {
  canMove,
  executeMove,
  initBoard,
  purgeDeletedTiles,
} from '../game/board';
import { sound } from '../utils/sound';
import { fireWinConfetti } from '../utils/confetti';

const STORAGE_KEY_STATE = '2048_game_state_v1';
const STORAGE_KEY_BEST = '2048_best_score_v1';

export function useGame() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [nextId, setNextId] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BEST);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [status, setStatus] = useState<GameStatus>('PLAYING');
  const [wonAcknowledged, setWonAcknowledged] = useState<boolean>(false);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  const [undoSnapshot, setUndoSnapshot] = useState<GameSnapshot | null>(null);

  // Animation lock to ensure smooth 120ms sliding
  const isAnimatingRef = useRef<boolean>(false);
  const animationTimerRef = useRef<number | null>(null);

  // Initialize board or restore from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY_STATE);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.tiles && Array.isArray(parsed.tiles) && parsed.tiles.length > 0) {
          setTiles(parsed.tiles);
          setScore(parsed.score || 0);
          setStatus(parsed.status || 'PLAYING');
          setWonAcknowledged(parsed.wonAcknowledged || false);
          setNextId(parsed.nextId || 100);
          return;
        }
      } catch {
        // Fallback to fresh board if corrupted
      }
    }

    // Fresh start
    const initial = initBoard();
    setTiles(initial.tiles);
    setNextId(initial.nextId);
  }, []);

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    if (tiles.length === 0) return;
    const cleanTiles = purgeDeletedTiles(tiles);
    const stateToSave = {
      tiles: cleanTiles,
      score,
      status,
      wonAcknowledged,
      nextId,
    };
    localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(stateToSave));
  }, [tiles, score, status, wonAcknowledged, nextId]);

  // Sync best score
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem(STORAGE_KEY_BEST, score.toString());
    }
  }, [score, bestScore]);

  // Remove expired score popups after 800ms
  const addScorePopup = useCallback((value: number) => {
    const id = Date.now() + Math.random();
    setScorePopups((prev) => [...prev, { id, value }]);
    setTimeout(() => {
      setScorePopups((prev) => prev.filter((p) => p.id !== id));
    }, 750);
  }, []);

  // Execute a directional move
  const move = useCallback(
    (direction: Direction) => {
      // Don't move if animating or game over
      if (isAnimatingRef.current) return;
      if (status === 'GAME_OVER') return;

      // Clean any remaining deleted tiles immediately before calculating next move
      const currentCleanTiles = purgeDeletedTiles(tiles);

      // Snapshot for undo
      const snapshot: GameSnapshot = {
        tiles: currentCleanTiles,
        score,
        status,
        wonAcknowledged,
        nextId,
      };

      const outcome = executeMove(currentCleanTiles, direction, nextId);

      if (!outcome.moved) {
        return;
      }

      // Lock animations for transition
      isAnimatingRef.current = true;
      setUndoSnapshot(snapshot);

      // Sound and score
      if (outcome.scoreGained > 0) {
        sound.playMerge(outcome.scoreGained);
        addScorePopup(outcome.scoreGained);
        setScore((prev) => prev + outcome.scoreGained);
      } else {
        sound.playMove();
      }

      // Update tiles with sliding and new tiles
      setTiles(outcome.tiles);
      setNextId(outcome.nextId);

      // Check win condition (2048 reached)
      if (outcome.has2048 && !wonAcknowledged) {
        setStatus('WON');
        sound.playWin();
        fireWinConfetti();
      } else {
        // Check game over
        const remainingMoves = canMove(outcome.tiles);
        if (!remainingMoves) {
          setStatus('GAME_OVER');
          sound.playGameOver();
        }
      }

      // After 140ms (matching slide duration), purge deleted tiles and release lock
      if (animationTimerRef.current) {
        window.clearTimeout(animationTimerRef.current);
      }
      animationTimerRef.current = window.setTimeout(() => {
        setTiles((prev) => purgeDeletedTiles(prev));
        isAnimatingRef.current = false;
      }, 140);
    },
    [tiles, status, wonAcknowledged, nextId, score, addScorePopup]
  );

  // Continue playing after reaching 2048
  const continueGame = useCallback(() => {
    setWonAcknowledged(true);
    setStatus('PLAYING');
  }, []);

  // Restart new game
  const restart = useCallback(() => {
    if (animationTimerRef.current) {
      window.clearTimeout(animationTimerRef.current);
    }
    isAnimatingRef.current = false;
    const initial = initBoard();
    setTiles(initial.tiles);
    setNextId(initial.nextId);
    setScore(0);
    setStatus('PLAYING');
    setWonAcknowledged(false);
    setUndoSnapshot(null);
    localStorage.removeItem(STORAGE_KEY_STATE);
  }, []);

  // Undo move
  const undo = useCallback(() => {
    if (!undoSnapshot || isAnimatingRef.current) return;
    if (animationTimerRef.current) {
      window.clearTimeout(animationTimerRef.current);
    }
    isAnimatingRef.current = false;

    setTiles(undoSnapshot.tiles);
    setScore(undoSnapshot.score);
    setStatus(undoSnapshot.status);
    setWonAcknowledged(undoSnapshot.wonAcknowledged);
    setNextId(undoSnapshot.nextId);
    setUndoSnapshot(null);
  }, [undoSnapshot]);

  return {
    tiles,
    score,
    bestScore,
    status,
    wonAcknowledged,
    scorePopups,
    canUndo: !!undoSnapshot && status !== 'GAME_OVER',
    move,
    continueGame,
    restart,
    undo,
  };
}
