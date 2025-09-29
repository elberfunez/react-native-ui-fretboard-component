import { StyleSheet } from 'react-native';

export const fretboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  fretboardContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  fretboard: {
    position: 'relative',
  },
});
