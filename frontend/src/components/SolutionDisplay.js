import React, { useState, useEffect, useCallback, useMemo } from 'react';

export default function SolutionDisplay({ solution, moves, solveTime, onAnimateMove }) {
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const moveList = useMemo(() => {
    if (!solution) return [];
    return solution.split(' ').filter(m => m.trim());
  }, [solution]);
  
  const handleNextMove = useCallback(() => {
    setCurrentMoveIndex(prevIndex => {
      if (prevIndex < moveList.length - 1) {
        const nextIndex = prevIndex + 1;
        if (onAnimateMove) {
          onAnimateMove(moveList[nextIndex]);
        }
        return nextIndex;
      }
      return prevIndex;
    });
  }, [moveList, onAnimateMove]);
  
  useEffect(() => {
    if (solution) {
      setCurrentMoveIndex(-1);
      setIsPlaying(false);
    }
  }, [solution]);
  
  // Auto-play moves
  useEffect(() => {
    if (!solution || !isPlaying) return;
    
    if (currentMoveIndex < moveList.length - 1) {
      const timer = setTimeout(() => {
        handleNextMove();
      }, 1000); // 1 second per move
      return () => clearTimeout(timer);
    } else if (currentMoveIndex >= moveList.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentMoveIndex, moveList.length, handleNextMove, solution]);
  
  if (!solution) {
    return null;
  }
  
  const handlePreviousMove = () => {
    setCurrentMoveIndex(prevIndex => {
      if (prevIndex > -1) {
        const prevIdx = prevIndex - 1;
        if (onAnimateMove && prevIdx >= 0) {
          onAnimateMove(moveList[prevIdx], true); // Reverse move
        }
        return prevIdx;
      }
      return prevIndex;
    });
  };
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleReset = () => {
    setCurrentMoveIndex(-1);
    setIsPlaying(false);
  };
  
  return (
    <div style={{
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      backdropFilter: 'blur(10px)',
      color: 'white',
      marginTop: '20px',
    }}>
      <h3 style={{ marginBottom: '15px', fontSize: '20px' }}>Solution</h3>
      
      <div style={{ marginBottom: '15px', fontSize: '14px', opacity: 0.9 }}>
        <div>Moves: <strong>{moves}</strong></div>
        {solveTime && <div>Time: <strong>{solveTime}s</strong></div>}
      </div>
      
      <div style={{
        marginBottom: '15px',
        padding: '15px',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '4px',
        fontSize: '18px',
        fontFamily: 'monospace',
        minHeight: '60px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        alignItems: 'center',
      }}>
        {moveList.map((move, index) => (
          <span
            key={index}
            style={{
              padding: '5px 10px',
              background: index <= currentMoveIndex 
                ? 'rgba(76, 175, 80, 0.5)' 
                : 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              border: index === currentMoveIndex 
                ? '2px solid #4CAF50' 
                : '1px solid rgba(255, 255, 255, 0.2)',
              fontWeight: index === currentMoveIndex ? 'bold' : 'normal',
            }}
          >
            {move}
          </span>
        ))}
      </div>
      
      <div style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
      }}>
        <button
          onClick={handlePreviousMove}
          disabled={currentMoveIndex < 0}
          style={{
            padding: '10px 20px',
            background: currentMoveIndex < 0 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentMoveIndex < 0 ? 'not-allowed' : 'pointer',
            fontSize: '14px',
          }}
        >
          ← Previous
        </button>
        
        <button
          onClick={handlePlayPause}
          style={{
            padding: '10px 20px',
            background: isPlaying 
              ? 'rgba(255, 152, 0, 0.8)' 
              : 'rgba(76, 175, 80, 0.8)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        
        <button
          onClick={handleNextMove}
          disabled={currentMoveIndex >= moveList.length - 1}
          style={{
            padding: '10px 20px',
            background: currentMoveIndex >= moveList.length - 1
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentMoveIndex >= moveList.length - 1 ? 'not-allowed' : 'pointer',
            fontSize: '14px',
          }}
        >
          Next →
        </button>
        
        <button
          onClick={handleReset}
          style={{
            padding: '10px 20px',
            background: 'rgba(244, 67, 54, 0.8)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

