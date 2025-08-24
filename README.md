# Web Video Editor

A web application for uploading, editing, and playing MP4 videos with advanced playback control and basic editing features.

## Features

### 🎥 Video Upload
- Upload MP4 files from your local device
- Intuitive drag & drop interface
- Support for manual file selection

### ▶️ Playback Controls
- **Play/Pause**: Basic playback control
- **Frame by Frame**: Frame navigation (forward/backward)
- **Speed Control**: 0.25x, 0.5x, 1x, 1.5x, 2x
- **Interactive Timeline**: Direct click navigation

### ✂️ Editing Features
- **Mark Start/End**: Select specific segments
- **Cut Preview**: View the selected segment
- **Visual Timeline**: Graphical indicator of selected segment
- **Reset Selection**: Clear markers

### ⌨️ Keyboard Shortcuts
- **Space**: Play/Pause
- **Left Arrow**: Previous frame
- **Right Arrow**: Next frame
- **Ctrl + I**: Mark start
- **Ctrl + O**: Mark end

## File Structure

```
video_editor/
├── index.html      # Main HTML structure
├── styles.css      # Styling and presentation
├── script.js       # Application logic
└── README.md       # Documentation
```

## Usage

1. **Open the application**: Open `index.html` in your web browser
2. **Upload video**: Click "Select Video" or drag and drop an MP4 file
3. **Playback**: Use the playback controls to navigate through the video
4. **Edit**:
   - Navigate to the desired start point and click "Mark Start"
   - Navigate to the end point and click "Mark End"
   - The selected segment will be visually displayed on the timeline
5. **Cut**: Click "Cut Segment" to prepare for download

## Technical Limitations

- **Actual video cutting**: The current functionality simulates cutting. To implement actual segment cutting, you would need:
  - Server-side processing with FFmpeg
  - Or client-side processing with FFmpeg.js (additional library)
- **Supported formats**: Only MP4 for simplicity
- **File size**: Limited by browser memory

## Technologies Used

- **HTML5**: Structure and `<video>` element
- **CSS3**: Modern styling with gradients and animations
- **JavaScript ES6+**: Application logic
- **Canvas API**: For future processing enhancements

## Compatibility

- Modern browsers with HTML5 support
- Chrome, Firefox, Safari, Edge (recent versions)
- Responsive design for mobile devices

## Possible Future Improvements

1. **Actual video cutting** with FFmpeg.js
2. **Multiple video formats** (AVI, MOV, etc.)
3. **Basic effects** (filters, transitions)
4. **Export in different qualities**
5. **Project saving** to localStorage
6. **Audio waveform visualization**
7. **Timeline zoom** for better precision
