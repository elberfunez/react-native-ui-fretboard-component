import { useCallback } from 'react';
import type { FingerPosition, Barre, EditMode, FingerNumber } from '../types';
import { generateBarreId } from '../utils';

interface UseFretboardEditProps {
  mode: 'display' | 'edit';
  currentEditMode: EditMode;
  positions: FingerPosition[];
  barres: Barre[];
  barreStartPosition: { fret: number; string: number } | null;
  setPositions: React.Dispatch<React.SetStateAction<FingerPosition[]>>;
  setBarres: React.Dispatch<React.SetStateAction<Barre[]>>;
  setBarreStartPosition: React.Dispatch<
    React.SetStateAction<{ fret: number; string: number } | null>
  >;
}

export const useFretboardEdit = ({
  mode,
  currentEditMode,
  positions,
  barres,
  barreStartPosition,
  setPositions,
  setBarres,
  setBarreStartPosition,
}: UseFretboardEditProps) => {
  const handleBarreCreation = useCallback(
    (string: number, fret: number) => {
      if (mode !== 'edit' || currentEditMode !== 'barres') return;

      if (!barreStartPosition) {
        setBarreStartPosition({ fret, string });
        return;
      }

      if (barreStartPosition.fret === fret) {
        const minString = Math.min(barreStartPosition.string, string);
        const maxString = Math.max(barreStartPosition.string, string);

        if (minString !== maxString) {
          const newBarre: Barre = {
            id: generateBarreId(),
            fret,
            fromString: minString,
            toString: maxString,
          };

          setPositions((prev) =>
            prev.filter(
              (p) =>
                p.fret !== fret || p.string < minString || p.string > maxString
            )
          );

          setBarres((prev) => [...prev, newBarre]);
        }
      }

      setBarreStartPosition(null);
    },
    [
      mode,
      currentEditMode,
      barreStartPosition,
      setPositions,
      setBarres,
      setBarreStartPosition,
    ]
  );

  const handleBarrePress = useCallback(
    (barreId: string) => {
      if (mode !== 'edit') return;

      if (currentEditMode === 'barres') {
        setBarres((prev) => prev.filter((b) => b.id !== barreId));
      } else if (currentEditMode === 'fingers') {
        const barre = barres.find((b) => b.id === barreId);
        if (barre) {
          const fingerOptions: FingerNumber[] = [1, 2, 3, 4];
          const currentFingerIndex = barre.finger
            ? fingerOptions.indexOf(barre.finger)
            : -1;
          const nextFingerIndex =
            (currentFingerIndex + 1) % (fingerOptions.length + 1);
          const nextFinger =
            nextFingerIndex === fingerOptions.length
              ? undefined
              : fingerOptions[nextFingerIndex];

          setBarres((prev) =>
            prev.map((b) =>
              b.id === barreId ? { ...b, finger: nextFinger } : b
            )
          );
        }
      }
    },
    [mode, currentEditMode, barres, setBarres]
  );

  const handlePositionPress = useCallback(
    (string: number, fret: number) => {
      if (mode !== 'edit') return;

      if (currentEditMode === 'barres') {
        handleBarreCreation(string, fret);
        return;
      }

      const coveredByBarre = barres.find(
        (b) => b.fret === fret && string >= b.fromString && string <= b.toString
      );

      if (currentEditMode === 'fingers' && coveredByBarre) {
        handleBarrePress(coveredByBarre.id);
        return;
      }

      if (currentEditMode === 'dots' && !coveredByBarre) {
        setPositions((prev) => {
          const existingIndex = prev.findIndex(
            (p) => p.string === string && p.fret === fret
          );

          if (existingIndex !== -1) {
            return prev.filter((_, i) => i !== existingIndex);
          } else {
            return [...prev, { string, fret }];
          }
        });
      } else if (currentEditMode === 'fingers') {
        const position = positions.find(
          (p) => p.string === string && p.fret === fret
        );
        if (position) {
          const fingerOptions: FingerNumber[] = [1, 2, 3, 4];
          const currentFingerIndex = position.finger
            ? fingerOptions.indexOf(position.finger)
            : -1;
          const nextFingerIndex =
            (currentFingerIndex + 1) % (fingerOptions.length + 1);
          const nextFinger =
            nextFingerIndex === fingerOptions.length
              ? undefined
              : fingerOptions[nextFingerIndex];

          setPositions((prev) =>
            prev.map((p) =>
              p.string === string && p.fret === fret
                ? { ...p, finger: nextFinger }
                : p
            )
          );
        }
      }
    },
    [
      mode,
      currentEditMode,
      positions,
      barres,
      handleBarrePress,
      handleBarreCreation,
      setPositions,
    ]
  );

  return {
    handlePositionPress,
    handleBarrePress,
    handleBarreCreation,
  };
};
