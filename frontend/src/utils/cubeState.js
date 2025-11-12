/**
 * Cube State Management Utilities
 * 
 * The cube is represented as a 54-character string where each character
 * represents a facelet color (U, R, F, D, L, B).
 * 
 * Face order: U, R, F, D, L, B (Up, Right, Front, Down, Left, Back)
 * Each face has 9 facelets, arranged in reading order (left-to-right, top-to-bottom)
 */

// Standard solved cube state
export const SOLVED_CUBE = "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB";

// Color mapping (standard Rubik's Cube colors)
export const COLOR_MAP = {
  U: '#FFD700', // Yellow (Up)
  D: '#FFFFFF', // White (Down)
  R: '#FFA500', // Orange (Right) - swapped with Left
  L: '#FF0000', // Red (Left) - swapped with Right
  F: '#00FF00', // Green (Front)
  B: '#0000FF', // Blue (Back)
};

// Color names for UI
export const COLOR_NAMES = {
  U: 'Yellow',
  D: 'White',
  R: 'Orange',
  L: 'Red',
  F: 'Green',
  B: 'Blue',
};

/**
 * Get the index in the cube string for a given face and position
 * @param {string} face - Face identifier (U, R, F, D, L, B)
 * @param {number} row - Row index (0-2)
 * @param {number} col - Column index (0-2)
 * @returns {number} Index in the 54-character string
 */
export function getFaceletIndex(face, row, col) {
  const faceOrder = ['U', 'R', 'F', 'D', 'L', 'B'];
  const faceIndex = faceOrder.indexOf(face);
  const positionInFace = row * 3 + col;
  return faceIndex * 9 + positionInFace;
}

/**
 * Get the color at a specific facelet position
 * @param {string} cubeString - The 54-character cube string
 * @param {string} face - Face identifier
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @returns {string} Color character (U, R, F, D, L, B)
 */
export function getFaceletColor(cubeString, face, row, col) {
  const index = getFaceletIndex(face, row, col);
  return cubeString[index];
}

/**
 * Set the color at a specific facelet position
 * @param {string} cubeString - The current cube string
 * @param {string} face - Face identifier
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @param {string} color - Color character to set
 * @returns {string} New cube string
 */
export function setFaceletColor(cubeString, face, row, col, color) {
  const index = getFaceletIndex(face, row, col);
  return cubeString.substring(0, index) + color + cubeString.substring(index + 1);
}

/**
 * Reset cube to solved state
 * @returns {string} Solved cube string
 */
export function resetCube() {
  return SOLVED_CUBE;
}

/**
 * Validate cube string format
 * @param {string} cubeString - Cube string to validate
 * @returns {object} {valid: boolean, error: string|null}
 */
export function validateCubeString(cubeString) {
  if (!cubeString || cubeString.length !== 54) {
    return { valid: false, error: 'Cube string must be exactly 54 characters' };
  }
  
  const validColors = Object.keys(COLOR_MAP);
  const colorCounts = {};
  
  for (let i = 0; i < cubeString.length; i++) {
    const color = cubeString[i];
    if (!validColors.includes(color)) {
      return { valid: false, error: `Invalid color character: ${color}` };
    }
    colorCounts[color] = (colorCounts[color] || 0) + 1;
  }
  
  // Check that each color appears exactly 9 times
  for (const color of validColors) {
    if (colorCounts[color] !== 9) {
      return { 
        valid: false, 
        error: `Color ${color} appears ${colorCounts[color]} times, expected 9` 
      };
    }
  }
  
  return { valid: true, error: null };
}

