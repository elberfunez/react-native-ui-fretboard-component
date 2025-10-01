import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { FretboardTheme } from '../types/Theme';

interface ChordLabelProps {
  chordName: string | null;
  notes: string[];
  theme?: FretboardTheme;
  fontFamily?: string;
}

const ChordLabel: React.FC<ChordLabelProps> = ({
  chordName,
  notes,
  theme,
  fontFamily,
}) => {
  if (!chordName && notes.length === 0) {
    return null;
  }

  const textColor = theme?.labels.chordNameColor || styles.label.color;
  const chordColor = theme?.labels.chordNameColor || styles.chordName.color;
  const backgroundColor =
    theme?.fretboard.backgroundColor === '#1a1a1a'
      ? '#2a2a2a'
      : styles.container.backgroundColor;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {chordName ? (
        <>
          <Text
            style={[
              styles.label,
              { color: textColor },
              fontFamily && { fontFamily },
            ]}
          >
            Chord:
          </Text>
          <Text
            style={[
              styles.chordName,
              { color: chordColor },
              fontFamily && { fontFamily },
            ]}
          >
            {chordName}
          </Text>
        </>
      ) : (
        <>
          <Text
            style={[
              styles.label,
              { color: textColor },
              fontFamily && { fontFamily },
            ]}
          >
            Notes:
          </Text>
          <Text
            style={[
              styles.notes,
              { color: textColor },
              fontFamily && { fontFamily },
            ]}
          >
            {notes.join(', ')}
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginRight: 8,
  },
  chordName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  notes: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});

export default ChordLabel;
