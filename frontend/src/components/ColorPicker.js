import React from 'react';
import { COLOR_MAP, COLOR_NAMES } from '../utils/cubeState';

export default function ColorPicker({ selectedColor, onColorSelect }) {
  const colors = Object.keys(COLOR_MAP);
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      backdropFilter: 'blur(10px)',
    }}>
      <h3 style={{ color: 'white', marginBottom: '10px', fontSize: '18px' }}>
        Select Color
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
      }}>
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onColorSelect(color)}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '8px',
              border: selectedColor === color ? '3px solid white' : '2px solid rgba(255, 255, 255, 0.3)',
              background: COLOR_MAP[color],
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: selectedColor === color 
                ? '0 0 15px rgba(255, 255, 255, 0.5)' 
                : '0 2px 5px rgba(0, 0, 0, 0.2)',
              transform: selectedColor === color ? 'scale(1.1)' : 'scale(1)',
            }}
            title={`${COLOR_NAMES[color]} (${color})`}
          />
        ))}
      </div>
      {selectedColor && (
        <div style={{
          marginTop: '10px',
          padding: '8px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          color: 'white',
          fontSize: '14px',
          textAlign: 'center',
        }}>
          {COLOR_NAMES[selectedColor]}
        </div>
      )}
    </div>
  );
}

