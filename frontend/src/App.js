import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Cube3D from './components/Cube3D';
import ColorPicker from './components/ColorPicker';
import SolutionDisplay from './components/SolutionDisplay';
import { 
  resetCube, 
  setFaceletColor, 
  validateCubeString 
} from './utils/cubeState';
import { applyMove, parseSolution } from './utils/cubeRotations';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function App() {
  const [cubeString, setCubeString] = useState(resetCube());
  const [selectedColor, setSelectedColor] = useState('U');
  const [selectedFacelet, setSelectedFacelet] = useState(null);
  const [solution, setSolution] = useState(null);
  const [solutionData, setSolutionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [initialCubeState, setInitialCubeState] = useState(null); // Store initial state when solution is received
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1); // Track which move we're on

  // Load cube state from localStorage on mount
  useEffect(() => {
    const savedCube = localStorage.getItem('cubeState');
    if (savedCube && savedCube.length === 54) {
      setCubeString(savedCube);
    }
  }, []);

  // Save cube state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cubeState', cubeString);
  }, [cubeString]);

  const handleFaceletClick = useCallback((face, row, col) => {
    setSelectedFacelet({ face, row, col });
    const newCubeString = setFaceletColor(cubeString, face, row, col, selectedColor);
    setCubeString(newCubeString);
  }, [cubeString, selectedColor]);

  const handleReset = () => {
    setCubeString(resetCube());
    setSolution(null);
    setSolutionData(null);
    setError(null);
    setSelectedFacelet(null);
    setInitialCubeState(null);
    setCurrentMoveIndex(-1);
  };

  const handleSubmit = async (e) => {
    // Prevent any default form submission behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Validate cube before submitting
    const validation = validateCubeString(cubeString);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setLoading(true);
    setError(null);
    setSolution(null);
    setSolutionData(null);

    try {
      console.log('Sending POST request to:', `${API_BASE_URL}/solve`);
      const response = await axios.post(
        `${API_BASE_URL}/solve`,
        {
          cubeString: cubeString,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const solutionString = response.data.solution;
      setSolution(solutionString);
      setSolutionData({
        moves: response.data.moves,
        time: response.data.time,
      });
      // Store the initial cube state for animation
      setInitialCubeState(cubeString);
      setCurrentMoveIndex(-1);
    } catch (err) {
      console.error('Error solving cube:', err);
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
        console.error('Cube string sent:', cubeString);
        
        // Show more helpful error messages
        const errorDetails = err.response.data?.details || err.response.data?.error || 'Failed to solve cube';
        setError(errorDetails);
      } else if (err.request) {
        console.error('Request made but no response:', err.request);
        setError('Network error: Could not connect to the solver API. Make sure the backend is running on port 5001.');
      } else {
        console.error('Error setting up request:', err.message);
        setError('Error: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnimateMove = useCallback((move, reverse = false) => {
    if (!initialCubeState || !solution) return;
    
    // Parse the solution to get all moves
    const moves = parseSolution(solution);
    
    // Calculate target index based on current index
    let targetIndex = currentMoveIndex;
    if (move === null) {
      // Reset to initial state
      targetIndex = -1;
    } else if (reverse) {
      targetIndex = Math.max(-1, currentMoveIndex - 1);
    } else {
      targetIndex = Math.min(moves.length - 1, currentMoveIndex + 1);
    }
    
    // Apply all moves up to the target index
    let newCubeState = initialCubeState;
    for (let i = 0; i <= targetIndex; i++) {
      if (i < moves.length) {
        newCubeState = applyMove(newCubeState, moves[i]);
      }
    }
    
    setCubeString(newCubeState);
  }, [initialCubeState, solution, currentMoveIndex]);
  
  const handleMoveIndexChange = useCallback((newIndex) => {
    setCurrentMoveIndex(newIndex);
    // Trigger animation update
    if (initialCubeState && solution) {
      const moves = parseSolution(solution);
      let newCubeState = initialCubeState;
      for (let i = 0; i <= newIndex; i++) {
        if (i < moves.length) {
          newCubeState = applyMove(newCubeState, moves[i]);
        }
      }
      setCubeString(newCubeState);
    }
  }, [initialCubeState, solution]);
  
  // Reset cube to initial state when solution changes
  useEffect(() => {
    if (initialCubeState && currentMoveIndex === -1) {
      setCubeString(initialCubeState);
    }
  }, [initialCubeState, currentMoveIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Don't handle shortcuts when typing in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      // Color selection shortcuts (1-6 for U, R, F, D, L, B)
      const colorKeys = { '1': 'U', '2': 'R', '3': 'F', '4': 'D', '5': 'L', '6': 'B' };
      if (colorKeys[e.key]) {
        setSelectedColor(colorKeys[e.key]);
        return;
      }

      // Viewport rotation shortcuts
      if (e.key === 'q' || e.key === 'Q') {
        // Rotate viewport left (would need to control camera)
        console.log('Rotate viewport left');
      }
      if (e.key === 'e' || e.key === 'E') {
        // Rotate viewport right
        console.log('Rotate viewport right');
      }

      // Auto-rotate toggle
      if (e.key === 'r' || e.key === 'R') {
        if (e.shiftKey) {
          setAutoRotate(!autoRotate);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [autoRotate]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎲 Cube Solver</h1>
        <p>Interactive Rubik's Cube Solver</p>
      </header>

      <main className="App-main">
        <div className="App-container">
          <div className="cube-section">
            <div className="cube-viewer-wrapper">
              <Cube3D
                cubeString={cubeString}
                onFaceletClick={handleFaceletClick}
                selectedFacelet={selectedFacelet}
                autoRotate={autoRotate}
              />
            </div>
            
            <div className="controls-section">
              <ColorPicker
                selectedColor={selectedColor}
                onColorSelect={setSelectedColor}
              />
              
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexDirection: 'column' }}>
                <button
                  onClick={handleReset}
                  className="button button-secondary"
                >
                  🔄 Reset Cube
                </button>
                
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="button button-primary"
                >
                  {loading ? '⏳ Solving...' : '✅ Solve Cube'}
                </button>
                
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`button ${autoRotate ? 'button-active' : 'button-secondary'}`}
                >
                  {autoRotate ? '⏸ Stop Auto-Rotate' : '▶ Auto-Rotate'}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          {solution && (
            <SolutionDisplay
              solution={solution}
              moves={solutionData?.moves}
              solveTime={solutionData?.time}
              onAnimateMove={handleAnimateMove}
              currentMoveIndex={currentMoveIndex}
              onMoveIndexChange={handleMoveIndexChange}
            />
          )}

          <div className="instructions">
            <h3>Instructions</h3>
            <ul>
              <li>Click on any facelet to change its color</li>
              <li>Select a color from the color picker first</li>
              <li>Drag the cube to rotate the view</li>
              <li>Use keyboard shortcuts: 1-6 to select colors (U, R, F, D, L, B)</li>
              <li>Press Shift+R to toggle auto-rotation</li>
              <li>Click "Solve Cube" to get the solution</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

