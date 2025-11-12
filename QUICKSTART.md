# Quick Start Guide

## Prerequisites
- Python 3.8+
- Node.js 16+ and npm

## Step 1: Start the Backend

Open a terminal and run:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The backend should now be running on `http://localhost:5001`

## Step 2: Start the Frontend

Open a **new** terminal window and run:

```bash
cd frontend
npm install
npm start
```

The frontend will automatically open in your browser at `http://localhost:3001`

## Step 3: Use the Application

1. Click on any facelet (sticker) on the 3D cube to change its color
2. Select a color from the color picker first
3. Drag the cube to rotate and view all faces
4. Click "Solve Cube" to get the solution
5. Use the play/pause controls to step through the solution

## Troubleshooting

- **Backend won't start**: Make sure port 5001 is available (port 5000 is often used by macOS AirPlay)
- **Frontend can't connect**: Verify backend is running on port 5001
- **npm install fails**: Try deleting `node_modules` and `package-lock.json`, then run `npm install` again
- **Python import errors**: Make sure you activated the virtual environment

## Testing the Backend

Test the API with curl:

```bash
curl -X POST http://localhost:5001/solve \
  -H "Content-Type: application/json" \
  -d '{"cubeString": "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"}'
```

You should get a response with a solution!

