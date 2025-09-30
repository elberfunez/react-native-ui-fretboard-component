import { useMemo } from 'react';
import { detect } from '@tonaljs/chord-detect';
import { getAllNotesFromFretboard } from '../utils/noteCalculator';
import type { FingerPosition } from '../types/FingerPosition';
import type { Barre } from '../types/Barre';

export interface ChordDetectionResult {
  notes: string[];
  chordNames: string[];
  primaryChord: string | null;
}

/**
 * Hook to detect chord names based on fretboard state
 * @param selectedDots - Array of fretted positions
 * @param stringStates - Array of string states ('X' for muted, 'O' for open)
 * @param barres - Array of barre chord positions
 * @returns Chord detection results including notes and detected chord names
 */
export function useChordDetection(
  selectedDots: FingerPosition[],
  stringStates: Array<'X' | 'O'>,
  barres: Barre[] = []
): ChordDetectionResult {
  const result = useMemo(() => {
    // Get all notes being played
    const notes = getAllNotesFromFretboard(selectedDots, stringStates, barres);

    // If no notes, return empty result
    if (notes.length === 0) {
      return {
        notes: [],
        chordNames: [],
        primaryChord: null,
      };
    }

    // Remove duplicate notes and keep them in order from lowest to highest string
    // The first (bass) note is typically the root, which helps Tonal.js detection
    const uniqueNotes: string[] = [];
    const seenNotes = new Set<string>();

    for (const note of notes) {
      if (!seenNotes.has(note)) {
        uniqueNotes.push(note);
        seenNotes.add(note);
      }
    }

    // Debug logging
    console.log('[useChordDetection] All notes:', notes);
    console.log('[useChordDetection] Unique notes:', uniqueNotes);

    // Detect chord names from the unique notes
    const chordNames = detect(uniqueNotes);

    console.log('[useChordDetection] Detected chords:', chordNames);

    return {
      notes: uniqueNotes,
      chordNames,
      primaryChord: chordNames.length > 0 ? chordNames[0]! : null,
    };
  }, [selectedDots, stringStates, barres]);

  return result;
}
