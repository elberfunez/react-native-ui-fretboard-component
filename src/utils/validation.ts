import type { FingerPosition } from '../types/FingerPosition';
import type { Barre } from '../types/Barre';

/**
 * Validates fret numbers and logs console warnings for invalid values
 */
export function validateFretNumber(fret: number, context: string): void {
  if (fret < 1 || fret > 24) {
    console.warn(
      `[GuitarFretboard] Invalid fret number ${fret} in ${context}. ` +
        `Fret numbers should be between 1 and 24.`
    );
  }
}

/**
 * Validates string numbers and logs console warnings for invalid values
 */
export function validateStringNumber(string: number, context: string): void {
  if (string < 1 || string > 6) {
    console.warn(
      `[GuitarFretboard] Invalid string number ${string} in ${context}. ` +
        `String numbers should be between 1 and 6 for standard guitar.`
    );
  }
}

/**
 * Validates finger position data
 */
export function validateFingerPosition(dot: FingerPosition): void {
  validateFretNumber(dot.fret, 'finger position');
  validateStringNumber(dot.string, 'finger position');
}

/**
 * Validates barre data
 */
export function validateBarre(barre: Barre): void {
  validateFretNumber(barre.fret, 'barre');
  validateStringNumber(barre.startString, 'barre start');
  validateStringNumber(barre.endString, 'barre end');

  if (barre.startString > barre.endString) {
    console.warn(
      `[GuitarFretboard] Barre startString (${barre.startString}) is greater than endString (${barre.endString}). ` +
        `This may cause rendering issues.`
    );
  }
}

/**
 * Logs deprecation warning for old width/height props
 */
export function warnDeprecatedSizeProps(): void {
  console.warn(
    `[GuitarFretboard] The 'width' and 'height' props are deprecated when using 'size' prop. ` +
      `Please use either 'size' preset or explicit width/height, not both.`
  );
}
