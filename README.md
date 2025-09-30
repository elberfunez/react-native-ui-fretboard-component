# react-native-ui-fretboard-component

A customizable guitar fretboard UI component for React Native and Expo. Features both interactive chord editing and static chord display modes.

## Features

- 🎸 **Interactive Chord Editor** - Create and edit guitar chords with finger positions
- 📊 **Static Chord Display** - Show saved chords in your app
- 🎯 **Fret Markers** - Traditional guitar position dots (3rd, 5th, 7th frets, etc.)
- 🔢 **Finger Numbers** - Visual finger position indicators (1-4)
- 🎼 **Barre Chords** - Support for barre chord notation
- 📏 **Chord Shifting** - Move chord shapes up and down the fretboard
- 🎨 **Customizable** - Control size, colors, and display options
- 💾 **Serializable Data** - Easy to save/load chord data from databases

## Installation

```sh
npm install react-native-ui-fretboard-component
```

## Usage

### Interactive Editor Mode

Use `GuitarFretboardEditor` to let users create and edit chords interactively:

```tsx
import { GuitarFretboardEditor } from 'react-native-ui-fretboard-component';
import type { ChordData } from 'react-native-ui-fretboard-component';

function ChordBuilder() {
  const handleChordChange = (chord: ChordData) => {
    console.log('Chord updated:', chord);
    // Save to your database, state, etc.
  };

  return (
    <GuitarFretboardEditor
      onChordChange={handleChordChange}
      showFretMarkers={true}
      gridWidth={250}
      gridHeight={300}
    />
  );
}
```

### Static Display Mode

Use `GuitarFretboardDisplay` to show saved chords (e.g., with song lyrics):

```tsx
import { GuitarFretboardDisplay } from 'react-native-ui-fretboard-component';
import type { ChordData } from 'react-native-ui-fretboard-component';

const cMajorChord: ChordData = {
  dots: [
    { string: 2, fret: 1, finger: 1 },
    { string: 4, fret: 2, finger: 2 },
    { string: 5, fret: 3, finger: 3 }
  ],
  barres: [],
  stringStates: ['X', 'O', 'O', 'O', 'O', 'X'],
  startingFret: 1,
  name: 'C Major'
};

function SongChords() {
  return (
    <GuitarFretboardDisplay
      chord={cMajorChord}
      width={150}
      height={200}
      showChordName={true}
      compact={true}
    />
  );
}
```

## API Reference

### GuitarFretboardEditor Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialChord` | `ChordData` | `undefined` | Load existing chord for editing |
| `onChordChange` | `(chord: ChordData) => void` | `undefined` | Callback fired when chord changes |
| `numberOfStrings` | `number` | `6` | Number of guitar strings |
| `numberOfFrets` | `number` | `5` | Number of visible frets |
| `gridWidth` | `number` | `200` | Width in pixels |
| `gridHeight` | `number` | `250` | Height in pixels |
| `showNut` | `boolean` | `true` | Show thick nut line at fret 1 |
| `dotRadius` | `number` | `12` | Size of finger position dots |
| `showFretMarkers` | `boolean` | `true` | Show traditional fret markers |
| `defaultStartingFret` | `number` | `1` | Initial starting fret |

### GuitarFretboardDisplay Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `chord` | `ChordData` | **required** | The chord to display |
| `width` | `number` | `200` | Width in pixels |
| `height` | `number` | `250` | Height in pixels |
| `showFretMarkers` | `boolean` | `true` | Show traditional fret markers |
| `showChordName` | `boolean` | `true` | Display chord name above diagram |
| `showNut` | `boolean` | `true` | Show thick nut line at fret 1 |
| `compact` | `boolean` | `false` | Use smaller sizing for inline display |
| `numberOfStrings` | `number` | `6` | Number of guitar strings |
| `numberOfFrets` | `number` | `5` | Number of visible frets |

### ChordData Type

```typescript
interface ChordData {
  dots: Array<{ string: number; fret: number; finger?: number }>;
  barres: Array<{
    fret: number;
    startString: number;
    endString: number;
    finger?: number;
  }>;
  stringStates: Array<'X' | 'O'>; // 'X' = muted, 'O' = open
  startingFret?: number;
  name?: string;
}
```

## Examples

### Save Chord to Database

```tsx
<GuitarFretboardEditor
  onChordChange={async (chord) => {
    await database.saveChord({
      userId: currentUser.id,
      chordData: chord,
      createdAt: new Date()
    });
  }}
/>
```

### Display Multiple Chords

```tsx
<ScrollView horizontal>
  {savedChords.map(chord => (
    <GuitarFretboardDisplay
      key={chord.id}
      chord={chord.data}
      compact={true}
      width={120}
      height={150}
    />
  ))}
</ScrollView>
```

### Edit Existing Chord

```tsx
<GuitarFretboardEditor
  initialChord={existingChord}
  onChordChange={(updated) => updateChord(chordId, updated)}
/>
```


## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
