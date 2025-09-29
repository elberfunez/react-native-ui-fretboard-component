import { useState, useCallback } from 'react';
import type { FingerPosition, Barre, EditMode } from '../types';

export const useFretboardState = (
  initialPositions: FingerPosition[] = [],
  initialBarres: Barre[] = [],
  initialEditMode: EditMode = 'dots'
) => {
  const [positions, setPositions] =
    useState<FingerPosition[]>(initialPositions);
  const [barres, setBarres] = useState<Barre[]>(initialBarres);
  const [currentEditMode, setCurrentEditMode] =
    useState<EditMode>(initialEditMode);
  const [barreStartPosition, setBarreStartPosition] = useState<{
    fret: number;
    string: number;
  } | null>(null);

  const isPositionActive = useCallback(
    (string: number, fret: number) => {
      return positions.some((p) => p.string === string && p.fret === fret);
    },
    [positions]
  );

  const calculateTotalSpan = useCallback(
    (pos: FingerPosition[], barr: Barre[]): number => {
      const allFrets = [...pos.map((p) => p.fret), ...barr.map((b) => b.fret)];
      if (allFrets.length === 0) return 0;
      return Math.max(...allFrets) - Math.min(...allFrets) + 1;
    },
    []
  );

  const clearFretboard = useCallback(() => {
    setPositions([]);
    setBarres([]);
    setBarreStartPosition(null);
  }, []);

  return {
    positions,
    setPositions,
    barres,
    setBarres,
    currentEditMode,
    setCurrentEditMode,
    barreStartPosition,
    setBarreStartPosition,
    isPositionActive,
    calculateTotalSpan,
    clearFretboard,
  };
};
