export interface Size {
  width: number;
  height: number;
}

export const sizePresets = {
  small: { width: 120, height: 150 },
  medium: { width: 200, height: 250 },
  large: { width: 280, height: 350 },
} as const;

export type SizePresetName = keyof typeof sizePresets;
export type SizePreset = SizePresetName | Size;

/**
 * Resolves a size preset to actual width/height values
 */
export function resolveSize(size: SizePreset): Size {
  if (typeof size === 'string') {
    return sizePresets[size];
  }
  return size;
}
