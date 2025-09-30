/**
 * Guitar note calculator utility
 * Converts fret positions to musical note names for standard tuning (E A D G B E)
 */

// Standard guitar tuning - open string notes (from string 6 to string 1)
const OPEN_STRING_NOTES = ['E', 'A', 'D', 'G', 'B', 'E'];

// Chromatic scale starting from C
const CHROMATIC_SCALE = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

/**
 * Gets the musical note name for a given string and fret position
 * @param string - Guitar string number (1-6, where 6 is the thickest low E string)
 * @param fret - Fret number (0 for open string, 1-24 for fretted notes)
 * @returns Note name (e.g., "E", "F#", "A")
 */
export function getNoteFromPosition(string: number, fret: number): string {
  // Convert string number to index (string 6 → index 0, string 1 → index 5)
  const stringIndex = 6 - string;

  // Get the open string note
  const openNote = OPEN_STRING_NOTES[stringIndex];

  if (!openNote) {
    throw new Error(`Invalid string number: ${string}`);
  }

  // Find the starting position in the chromatic scale
  const startIndex = CHROMATIC_SCALE.indexOf(openNote);

  if (startIndex === -1) {
    throw new Error(`Invalid open string note: ${openNote}`);
  }

  // Calculate the final note by moving up 'fret' semitones
  const noteIndex = (startIndex + fret) % 12;

  return CHROMATIC_SCALE[noteIndex]!;
}

/**
 * Gets all notes being played on the fretboard
 * @param dots - Array of finger positions with string and fret
 * @param stringStates - Array of string states ('X' for muted, 'O' for open)
 * @param barres - Array of barre positions
 * @returns Array of note names being played
 */
export function getAllNotesFromFretboard(
  dots: Array<{ string: number; fret: number }>,
  stringStates: Array<'X' | 'O'>,
  barres: Array<{ fret: number; startString: number; endString: number }> = []
): string[] {
  const notes: string[] = [];

  console.log('[getAllNotesFromFretboard] dots:', dots);
  console.log('[getAllNotesFromFretboard] stringStates:', stringStates);
  console.log('[getAllNotesFromFretboard] barres:', barres);

  // Process each string (from 6 to 1)
  for (let stringNum = 6; stringNum >= 1; stringNum--) {
    const stringIndex = 6 - stringNum; // Convert to array index
    const stringState = stringStates[stringIndex];

    // Skip muted strings
    if (stringState === 'X') {
      continue;
    }

    // Find all fretted notes on this string and get the highest fret
    const frettedNotesOnString = dots.filter((dot) => dot.string === stringNum);
    const highestFrettedNote =
      frettedNotesOnString.length > 0
        ? frettedNotesOnString.reduce((highest, current) =>
            current.fret > highest.fret ? current : highest
          )
        : null;

    // Find if there's a barre covering this string
    const barreForString = barres.find(
      (barre) =>
        stringNum >= Math.min(barre.startString, barre.endString) &&
        stringNum <= Math.max(barre.startString, barre.endString)
    );

    // Priority: highest fret dot > barre > open string
    if (highestFrettedNote) {
      // Add the highest fretted note (highest priority)
      const note = getNoteFromPosition(stringNum, highestFrettedNote.fret);
      console.log(
        `[getAllNotesFromFretboard] String ${stringNum}, fret ${highestFrettedNote.fret} → ${note}`
      );
      notes.push(note);
    } else if (barreForString) {
      // Add the barre note (second priority)
      const note = getNoteFromPosition(stringNum, barreForString.fret);
      console.log(
        `[getAllNotesFromFretboard] String ${stringNum}, barre fret ${barreForString.fret} → ${note}`
      );
      notes.push(note);
    } else if (stringState === 'O') {
      // Add the open string note (lowest priority)
      const note = getNoteFromPosition(stringNum, 0);
      console.log(
        `[getAllNotesFromFretboard] String ${stringNum}, open → ${note}`
      );
      notes.push(note);
    }
  }

  return notes;
}
