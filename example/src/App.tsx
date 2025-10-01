import { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  GuitarFretboardEditor,
  GuitarFretboardDisplay,
} from 'react-native-ui-fretboard-component';
import type {
  ChordData,
  ThemePreset,
  SizePreset,
} from 'react-native-ui-fretboard-component';

export default function App() {
  const [currentChord, setCurrentChord] = useState<ChordData | null>(null);
  const [theme, setTheme] = useState<ThemePreset>('light');
  const [size, setSize] = useState<SizePreset>('medium');

  const isDark = theme === 'dark';

  return (
    <ScrollView
      style={[styles.scrollContainer, isDark && styles.scrollContainerDark]}
    >
      <View style={styles.container}>
        <Text style={[styles.title, isDark && styles.titleDark]}>
          Guitar Fretboard Component Demo
        </Text>

        {/* Theme & Size Controls */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text
            style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}
          >
            Theme & Size
          </Text>
          <View style={styles.controlRow}>
            <Text style={[styles.label, isDark && styles.labelDark]}>
              Theme:
            </Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  theme === 'light' && styles.activeButton,
                ]}
                onPress={() => setTheme('light')}
              >
                <Text
                  style={[
                    styles.optionText,
                    theme === 'light' && styles.activeText,
                  ]}
                >
                  Light
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  theme === 'dark' && styles.activeButton,
                ]}
                onPress={() => setTheme('dark')}
              >
                <Text
                  style={[
                    styles.optionText,
                    theme === 'dark' && styles.activeText,
                  ]}
                >
                  Dark
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  theme === 'auto' && styles.activeButton,
                ]}
                onPress={() => setTheme('auto')}
              >
                <Text
                  style={[
                    styles.optionText,
                    theme === 'auto' && styles.activeText,
                  ]}
                >
                  Auto
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.controlRow}>
            <Text style={[styles.label, isDark && styles.labelDark]}>
              Size:
            </Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  size === 'small' && styles.activeButton,
                ]}
                onPress={() => setSize('small')}
              >
                <Text
                  style={[
                    styles.optionText,
                    size === 'small' && styles.activeText,
                  ]}
                >
                  Small
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  size === 'medium' && styles.activeButton,
                ]}
                onPress={() => setSize('medium')}
              >
                <Text
                  style={[
                    styles.optionText,
                    size === 'medium' && styles.activeText,
                  ]}
                >
                  Medium
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  size === 'large' && styles.activeButton,
                ]}
                onPress={() => setSize('large')}
              >
                <Text
                  style={[
                    styles.optionText,
                    size === 'large' && styles.activeText,
                  ]}
                >
                  Large
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Editor Section */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text
            style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}
          >
            <Text style={styles.componentName}>
              {'<GuitarFretboardEditor />'}
            </Text>
          </Text>
          <Text
            style={[styles.instructions, isDark && styles.instructionsDark]}
          >
            Use this component when you want users to CREATE and EDIT chords
            interactively. It includes all the controls for building chord
            shapes.
          </Text>
          <View style={[styles.codeBlock, isDark && styles.codeBlockDark]}>
            <Text style={[styles.codeText, isDark && styles.codeTextDark]}>
              {`import { GuitarFretboardEditor } from 'react-native-ui-fretboard-component';

<GuitarFretboardEditor
  onChordChange={(chord) => save(chord)}
  theme="light"
  size="medium"
/>`}
            </Text>
          </View>
          <Text style={[styles.tryItLabel, isDark && styles.tryItLabelDark]}>
            👇 Try it below:
          </Text>
          <GuitarFretboardEditor
            onChordChange={setCurrentChord}
            theme={theme}
            size={size}
          />
        </View>

        {/* Display Section */}
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text
            style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}
          >
            <Text style={styles.componentName}>
              {'<GuitarFretboardDisplay />'}
            </Text>
          </Text>
          <Text
            style={[styles.instructions, isDark && styles.instructionsDark]}
          >
            Use this component when you want to SHOW saved chords (read-only).
            Perfect for displaying chords with song lyrics or in chord
            libraries.
          </Text>
          <View style={[styles.codeBlock, isDark && styles.codeBlockDark]}>
            <Text style={[styles.codeText, isDark && styles.codeTextDark]}>
              {`import { GuitarFretboardDisplay } from 'react-native-ui-fretboard-component';

<GuitarFretboardDisplay
  chord={savedChordData}
  showChordName={true}
  theme="light"
  size="medium"
/>`}
            </Text>
          </View>
          <Text style={[styles.tryItLabel, isDark && styles.tryItLabelDark]}>
            👇 This updates as you edit above:
          </Text>
          {currentChord ? (
            <GuitarFretboardDisplay
              chord={currentChord}
              showChordName={true}
              theme={theme}
              size={size}
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                Create a chord above to see it displayed here
              </Text>
            </View>
          )}
        </View>

        {/* Compact Display Example */}
        {currentChord && (
          <View style={[styles.section, isDark && styles.sectionDark]}>
            <Text
              style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}
            >
              Compact Mode Example
            </Text>
            <Text
              style={[styles.instructions, isDark && styles.instructionsDark]}
            >
              Use size="small" and compact mode to show multiple chord diagrams
              inline with lyrics or in tight spaces.
            </Text>
            <View style={[styles.codeBlock, isDark && styles.codeBlockDark]}>
              <Text style={[styles.codeText, isDark && styles.codeTextDark]}>
                {`<GuitarFretboardDisplay
  chord={chordData}
  compact={true}
  size="small"
/>`}
              </Text>
            </View>
            <Text style={[styles.tryItLabel, isDark && styles.tryItLabelDark]}>
              Example: Multiple chords inline
            </Text>
            <View style={styles.compactRow}>
              <GuitarFretboardDisplay
                chord={currentChord}
                compact={true}
                theme={theme}
                size="small"
              />
              <GuitarFretboardDisplay
                chord={currentChord}
                compact={true}
                theme={theme}
                size="small"
              />
            </View>
          </View>
        )}

        {/* JSON Output */}
        {currentChord && (
          <View style={[styles.section, isDark && styles.sectionDark]}>
            <Text
              style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}
            >
              Chord Data Structure
            </Text>
            <Text
              style={[styles.instructions, isDark && styles.instructionsDark]}
            >
              This is the ChordData object you'll save to your database. Pass it
              to{' '}
              <Text style={styles.inlineCode}>
                {'<GuitarFretboardDisplay />'}
              </Text>{' '}
              to render it later.
            </Text>
            <View style={[styles.codeBlock, isDark && styles.codeBlockDark]}>
              <Text style={[styles.codeText, isDark && styles.codeTextDark]}>
                {`// Save from Editor
const handleSave = (chord: ChordData) => {
  await db.saveChord(chord);
};

// Load for Display
const chord = await db.getChord(id);
<GuitarFretboardDisplay chord={chord} />`}
              </Text>
            </View>
            <Text style={[styles.tryItLabel, isDark && styles.tryItLabelDark]}>
              Current chord data:
            </Text>
            <View style={styles.jsonContainer}>
              <Text style={styles.jsonText}>
                {JSON.stringify(currentChord, null, 2)}
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#333',
  },
  section: {
    width: '100%',
    maxWidth: 400,
    marginVertical: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  instructions: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  placeholder: {
    width: 200,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
  },
  placeholderText: {
    color: '#999',
    textAlign: 'center',
    fontSize: 14,
  },
  compactRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
  },
  jsonContainer: {
    width: '100%',
    backgroundColor: '#2d2d2d',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  jsonText: {
    fontFamily: 'Courier',
    fontSize: 11,
    color: '#a9dc76',
    lineHeight: 16,
  },
  controlRow: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  activeButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeText: {
    color: 'white',
  },
  componentName: {
    fontFamily: 'Courier',
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  codeBlock: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  codeText: {
    fontFamily: 'Courier',
    fontSize: 11,
    color: '#333',
    lineHeight: 16,
  },
  tryItLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginTop: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  inlineCode: {
    fontFamily: 'Courier',
    fontSize: 11,
    color: '#007AFF',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
  },
  // Dark mode styles
  scrollContainerDark: {
    backgroundColor: '#121212',
  },
  titleDark: {
    color: '#ffffff',
  },
  sectionDark: {
    backgroundColor: '#1e1e1e',
    shadowColor: '#ffffff',
    shadowOpacity: 0.05,
  },
  sectionTitleDark: {
    color: '#ffffff',
  },
  instructionsDark: {
    color: '#b0b0b0',
  },
  labelDark: {
    color: '#e0e0e0',
  },
  codeBlockDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#3a3a3a',
  },
  codeTextDark: {
    color: '#e0e0e0',
  },
  tryItLabelDark: {
    color: '#b0b0b0',
  },
});
