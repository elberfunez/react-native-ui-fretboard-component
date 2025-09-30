export interface Dot {
  string: number; // 1-6
  fret: number; // 1+
  x: number; // computed for SVG
  y: number; // computed for SVG
}

/*
x = (string - 1) * verticalSpacing

y = (fret - 0.5) * horizontalSpacing
 */
