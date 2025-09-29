export const generateBarreId = (): string => {
  return `barre-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
