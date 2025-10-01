# react-native-ui-fretboard-component

A customizable guitar fretboard UI component for React Native and Expo. Features both interactive chord editing and static chord display modes with built-in dark mode support and automatic chord detection.

## Demo

Try it live: **[Expo Snack Demo](https://snack.expo.dev/@elberfunez/example-guitar-fretboard-editor-)**

## Features

- 🎸 **Interactive Chord Editor** - Create and edit guitar chords with finger positions
- 📊 **Static Chord Display** - Show saved chords in your app
- 🎯 **Fret Markers** - Traditional guitar position dots (3rd, 5th, 7th, 9th, 12th frets, etc.)
- 🔢 **Finger Numbers** - Visual finger position indicators (1-4)
- 🎼 **Barre Chords** - Support for barre chord notation with easy segmented control
- 📏 **Chord Shifting** - Move chord shapes up and down the fretboard
- 🎵 **Chord Detection** - Automatic chord name recognition using Tonal.js
- 🌓 **Dark Mode** - Built-in light/dark/auto theme support
- 📐 **Size Presets** - Small, medium, large sizes with responsive scaling
- 🎨 **Customizable** - Control themes, colors, fonts, and display options
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
      theme="light"
      size="medium"
      showFretMarkers={true}
      showChordDetection={true}
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
      theme="light"
      size="small"
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
| `theme` | `'light' \| 'dark' \| 'auto' \| FretboardTheme` | `'light'` | Color theme (auto follows system) |
| `size` | `'small' \| 'medium' \| 'large' \| Size` | `'medium'` | Size preset or custom dimensions |
| `fontFamily` | `string` | `undefined` | Custom font family for text |
| `showControls` | `boolean` | `true` | Show editor controls (mode, clear, reset) |
| `showChordDetection` | `boolean` | `true` | Show detected chord name |
| `showFretMarkers` | `boolean` | `true` | Show traditional fret markers |
| `showNut` | `boolean` | `true` | Show thick nut line at fret 1 |
| `defaultStartingFret` | `number` | `1` | Initial starting fret |
| `numberOfStrings` | `number` | `6` | Number of guitar strings |
| `numberOfFrets` | `number` | `5` | Number of visible frets |
| `gridWidth` | `number` | `200` | Width (legacy, use `size` instead) |
| `gridHeight` | `number` | `250` | Height (legacy, use `size` instead) |
| `dotRadius` | `number` | auto | Dot size (auto-scales with size) |

### GuitarFretboardDisplay Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `chord` | `ChordData` | **required** | The chord to display |
| `theme` | `'light' \| 'dark' \| 'auto' \| FretboardTheme` | `'light'` | Color theme (auto follows system) |
| `size` | `'small' \| 'medium' \| 'large' \| Size` | `'medium'` | Size preset or custom dimensions |
| `fontFamily` | `string` | `undefined` | Custom font family for text |
| `showChordName` | `boolean` | `true` | Display chord name above diagram |
| `showFretMarkers` | `boolean` | `true` | Show traditional fret markers |
| `showNut` | `boolean` | `true` | Show thick nut line at fret 1 |
| `compact` | `boolean` | `false` | Use smaller sizing for inline display |
| `numberOfStrings` | `number` | `6` | Number of guitar strings |
| `numberOfFrets` | `number` | `5` | Number of visible frets |
| `width` | `number` | `200` | Width (legacy, use `size` instead) |
| `height` | `number` | `250` | Height (legacy, use `size` instead) |

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

### Dark Mode Support

```tsx
import { useColorScheme } from 'react-native';

function MyChordEditor() {
  return (
    <GuitarFretboardEditor
      theme="auto" // Follows system theme
      size="medium"
      onChordChange={handleSave}
    />
  );
}
```

### Custom Theme

```tsx
import type { FretboardTheme } from 'react-native-ui-fretboard-component';

const customTheme: FretboardTheme = {
  fretboard: {
    stringColor: '#FF6B6B',
    fretColor: '#4ECDC4',
    nutColor: '#FFE66D',
    backgroundColor: '#1A1A2E'
  },
  // ... other theme colors
};

<GuitarFretboardEditor theme={customTheme} />
```

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

### Display Multiple Chords with Size Presets

```tsx
<ScrollView horizontal>
  {savedChords.map(chord => (
    <GuitarFretboardDisplay
      key={chord.id}
      chord={chord.data}
      size="small"
      compact={true}
    />
  ))}
</ScrollView>
```

### Edit Existing Chord

```tsx
<GuitarFretboardEditor
  initialChord={existingChord}
  onChordChange={(updated) => updateChord(chordId, updated)}
  showChordDetection={true}
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
