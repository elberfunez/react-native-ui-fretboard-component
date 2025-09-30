import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ChordLabelProps {
  chordName: string | null;
  notes: string[];
}

const ChordLabel: React.FC<ChordLabelProps> = ({ chordName, notes }) => {
  if (!chordName && notes.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {chordName ? (
        <>
          <Text style={styles.label}>Chord:</Text>
          <Text style={styles.chordName}>{chordName}</Text>
        </>
      ) : (
        <>
          <Text style={styles.label}>Notes:</Text>
          <Text style={styles.notes}>{notes.join(', ')}</Text>
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
