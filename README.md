# Cube Solver 🎲

A full-stack web application that allows users to input their Rubik's Cube state and generates an optimal solution using the Kociemba algorithm.

## Features

- **Interactive 3D Visualization**: Built with React and Three.js, allowing users to view and interact with a 3D Rubik's Cube
- **Color Picker**: Click on any facelet to change its color to match your physical cube
- **Optimal Solutions**: Uses the Kociemba algorithm to generate solutions in ≤20 moves
- **Solution Display**: View the solution with step-by-step controls and animation
- **Keyboard Shortcuts**: Quick color selection and viewport controls
- **Auto-save**: Cube state is automatically saved to localStorage

## Architecture

- **Frontend**: React with Three.js for 3D rendering
- **Backend**: Python Flask REST API
- **Solver**: Kociemba algorithm (via `kociemba` Python library)

## Setup Instructions

### Prerequisites

- Python 3.8+ 
- Node.js 16+ and npm
- pip (Python package manager)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the Flask server:
```bash
python app.py
```

The backend will run on `http://localhost:5001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3001` (configured to avoid conflicts with port 3000) and automatically open in your browser.

**Note**: If you need to use a different port, you can:
- **macOS/Linux**: `PORT=3002 npm start`
- **Windows**: Create a `.env` file in the `frontend` directory with `PORT=3002`

### Environment Variables

The frontend uses `REACT_APP_API_URL` to connect to the backend. By default, it's set to `http://localhost:5001`. To change this, create a `.env` file in the `frontend` directory:

```
REACT_APP_API_URL=http://localhost:5001
PORT=3001
```

## Usage

1. **Set Up Your Cube**:
   - Click on any facelet to change its color
   - Select a color from the color picker first
   - Rotate the cube by dragging to view all faces
   - Make sure each color appears exactly 9 times

2. **Solve the Cube**:
   - Click "Solve Cube" to get the solution
   - The solution will appear with move notation (e.g., "R U R' U R U2 R'")

3. **View Solution**:
   - Use the play/pause button to animate through moves
   - Use previous/next buttons to step through manually
   - The current move is highlighted in green

## Cube Notation

- **Single letter** (R, L, U, D, F, B): Clockwise 90° rotation
- **Letter + '** (R', L', etc.): Counterclockwise 90° rotation  
- **Letter + 2** (R2, U2, etc.): 180° rotation

> 📖 **Need help understanding how to orient your cube?** See [CUBE_ORIENTATION.md](CUBE_ORIENTATION.md) for a detailed guide on cube orientation, face symbols, and how to read the cube string format.

## Color Mapping

- **U** (Up): Yellow
- **D** (Down): White
- **R** (Right): Orange
- **L** (Left): Red
- **F** (Front): Green
- **B** (Back): Blue

## Keyboard Shortcuts

- **1-6**: Select colors (1=U/Yellow, 2=R/Orange, 3=F/Green, 4=D/White, 5=L/Red, 6=B/Blue)
- **Shift+R**: Toggle auto-rotation

## API Endpoint

### POST /solve

Solves a Rubik's Cube state.

**Request:**
```json
{
  "cubeString": "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"
}
```

**Response (Success):**
```json
{
  "solution": "R U R' U R U2 R'",
  "moves": 8,
  "time": 0.05
}
```

**Response (Error):**
```json
{
  "error": "Invalid cube string",
  "details": "Color counts are incorrect"
}
```

## Cube State Format

The cube is represented as a 54-character string where each character is a color code (U, R, F, D, L, B). The string is organized as:

- Positions 0-8: Up face (U)
- Positions 9-17: Right face (R)
- Positions 18-26: Front face (F)
- Positions 27-35: Down face (D)
- Positions 36-44: Left face (L)
- Positions 45-53: Back face (B)

Each face's 9 facelets are arranged in reading order (left-to-right, top-to-bottom).

## Testing

### Backend Testing

Test the API endpoint with curl:

```bash
curl -X POST http://localhost:5001/solve \
  -H "Content-Type: application/json" \
  -d '{"cubeString": "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"}'
```

### Frontend Testing

The React app includes hot-reloading. Make changes to the code and see them reflected immediately in the browser.

## Troubleshooting

- **Backend won't start**: Make sure port 5001 is not in use (port 5000 is often used by macOS AirPlay)
- **Frontend can't connect**: Verify the backend is running and check `REACT_APP_API_URL`
- **Solver errors**: Ensure the cube state is valid (54 characters, 9 of each color)
- **3D cube not rendering**: Check browser console for Three.js errors

## Future Enhancements

- [ ] Animate solution moves on the 3D cube
- [ ] Import cube state from string
- [ ] Example scrambles
- [ ] Mobile touch support
- [ ] Computer vision integration for color detection

## License

MIT License - feel free to use this project for learning and development!

## Credits

- **Kociemba Algorithm**: Optimal Rubik's Cube solving algorithm
- **Three.js**: 3D graphics library
- **React**: UI framework
- **Flask**: Python web framework

