/**
 * Cube Rotation Utilities
 * 
 * Functions to apply Rubik's Cube moves (R, U, F, D, L, B) to the cube string.
 * Each move rotates a face 90 degrees clockwise (or counterclockwise with ').
 */

/**
 * Rotate a face 90 degrees clockwise
 * @param {string} cubeString - Current cube string
 * @param {string} face - Face to rotate (U, R, F, D, L, B)
 * @returns {string} New cube string after rotation
 */
function rotateFaceClockwise(cubeString, face) {
  const faceOrder = ['U', 'R', 'F', 'D', 'L', 'B'];
  const faceIndex = faceOrder.indexOf(face);
  const startIndex = faceIndex * 9;
  
  // Get the 9 facelets for this face
  const facelets = cubeString.substring(startIndex, startIndex + 9).split('');
  
  // Rotate the face 90 degrees clockwise
  // Original:     After rotation:
  // 0 1 2         6 3 0
  // 3 4 5    ->   7 4 1
  // 6 7 8         8 5 2
  const rotated = [
    facelets[6], facelets[3], facelets[0],
    facelets[7], facelets[4], facelets[1],
    facelets[8], facelets[5], facelets[2]
  ];
  
  // Update the cube string
  const newCubeString = cubeString.split('');
  for (let i = 0; i < 9; i++) {
    newCubeString[startIndex + i] = rotated[i];
  }
  
  return newCubeString.join('');
}

/**
 * Rotate a face 90 degrees counterclockwise
 * @param {string} cubeString - Current cube string
 * @param {string} face - Face to rotate
 * @returns {string} New cube string after rotation
 */
function rotateFaceCounterclockwise(cubeString, face) {
  // Counterclockwise is 3 clockwise rotations
  let result = cubeString;
  for (let i = 0; i < 3; i++) {
    result = rotateFaceClockwise(result, face);
  }
  return result;
}

/**
 * Rotate a face 180 degrees
 * @param {string} cubeString - Current cube string
 * @param {string} face - Face to rotate
 * @returns {string} New cube string after rotation
 */
function rotateFace180(cubeString, face) {
  // 180 degrees is 2 clockwise rotations
  let result = rotateFaceClockwise(cubeString, face);
  result = rotateFaceClockwise(result, face);
  return result;
}

/**
 * Rotate the adjacent edges and corners when a face is rotated
 * This is the complex part - we need to rotate the stickers on adjacent faces
 */
function rotateAdjacentStickers(cubeString, face, clockwise) {
  let result = cubeString.split('');
  
  // Define which stickers on adjacent faces need to move for each face rotation
  // This is the standard Rubik's Cube move mapping
  const adjacentMoves = {
    'U': {
      clockwise: [
        // Front top row -> Right top row -> Back top row -> Left top row -> Front top row
        { from: { face: 'F', indices: [0, 1, 2] }, to: { face: 'R', indices: [0, 1, 2] } },
        { from: { face: 'R', indices: [0, 1, 2] }, to: { face: 'B', indices: [0, 1, 2] } },
        { from: { face: 'B', indices: [0, 1, 2] }, to: { face: 'L', indices: [0, 1, 2] } },
        { from: { face: 'L', indices: [0, 1, 2] }, to: { face: 'F', indices: [0, 1, 2] } }
      ],
      counterclockwise: [
        { from: { face: 'F', indices: [0, 1, 2] }, to: { face: 'L', indices: [0, 1, 2] } },
        { from: { face: 'L', indices: [0, 1, 2] }, to: { face: 'B', indices: [0, 1, 2] } },
        { from: { face: 'B', indices: [0, 1, 2] }, to: { face: 'R', indices: [0, 1, 2] } },
        { from: { face: 'R', indices: [0, 1, 2] }, to: { face: 'F', indices: [0, 1, 2] } }
      ]
    },
    'R': {
      clockwise: [
        // Front right column -> Down right column -> Back left column (reversed) -> Up right column -> Front right column
        { from: { face: 'F', indices: [2, 5, 8] }, to: { face: 'D', indices: [2, 5, 8] } },
        { from: { face: 'D', indices: [2, 5, 8] }, to: { face: 'B', indices: [6, 3, 0] } },
        { from: { face: 'B', indices: [6, 3, 0] }, to: { face: 'U', indices: [2, 5, 8] } },
        { from: { face: 'U', indices: [2, 5, 8] }, to: { face: 'F', indices: [2, 5, 8] } }
      ],
      counterclockwise: [
        { from: { face: 'F', indices: [2, 5, 8] }, to: { face: 'U', indices: [2, 5, 8] } },
        { from: { face: 'U', indices: [2, 5, 8] }, to: { face: 'B', indices: [6, 3, 0] } },
        { from: { face: 'B', indices: [6, 3, 0] }, to: { face: 'D', indices: [2, 5, 8] } },
        { from: { face: 'D', indices: [2, 5, 8] }, to: { face: 'F', indices: [2, 5, 8] } }
      ]
    },
    'F': {
      clockwise: [
        // Up bottom row -> Right left column -> Down top row (reversed) -> Left right column (reversed) -> Up bottom row
        { from: { face: 'U', indices: [6, 7, 8] }, to: { face: 'R', indices: [0, 3, 6] } },
        { from: { face: 'R', indices: [0, 3, 6] }, to: { face: 'D', indices: [2, 1, 0] } },
        { from: { face: 'D', indices: [2, 1, 0] }, to: { face: 'L', indices: [8, 5, 2] } },
        { from: { face: 'L', indices: [8, 5, 2] }, to: { face: 'U', indices: [6, 7, 8] } }
      ],
      counterclockwise: [
        { from: { face: 'U', indices: [6, 7, 8] }, to: { face: 'L', indices: [8, 5, 2] } },
        { from: { face: 'L', indices: [8, 5, 2] }, to: { face: 'D', indices: [2, 1, 0] } },
        { from: { face: 'D', indices: [2, 1, 0] }, to: { face: 'R', indices: [0, 3, 6] } },
        { from: { face: 'R', indices: [0, 3, 6] }, to: { face: 'U', indices: [6, 7, 8] } }
      ]
    },
    'D': {
      clockwise: [
        // Front bottom row -> Left bottom row -> Back bottom row -> Right bottom row -> Front bottom row
        { from: { face: 'F', indices: [6, 7, 8] }, to: { face: 'L', indices: [6, 7, 8] } },
        { from: { face: 'L', indices: [6, 7, 8] }, to: { face: 'B', indices: [6, 7, 8] } },
        { from: { face: 'B', indices: [6, 7, 8] }, to: { face: 'R', indices: [6, 7, 8] } },
        { from: { face: 'R', indices: [6, 7, 8] }, to: { face: 'F', indices: [6, 7, 8] } }
      ],
      counterclockwise: [
        { from: { face: 'F', indices: [6, 7, 8] }, to: { face: 'R', indices: [6, 7, 8] } },
        { from: { face: 'R', indices: [6, 7, 8] }, to: { face: 'B', indices: [6, 7, 8] } },
        { from: { face: 'B', indices: [6, 7, 8] }, to: { face: 'L', indices: [6, 7, 8] } },
        { from: { face: 'L', indices: [6, 7, 8] }, to: { face: 'F', indices: [6, 7, 8] } }
      ]
    },
    'L': {
      clockwise: [
        // Front left column -> Up left column -> Back right column (reversed) -> Down left column -> Front left column
        { from: { face: 'F', indices: [0, 3, 6] }, to: { face: 'U', indices: [0, 3, 6] } },
        { from: { face: 'U', indices: [0, 3, 6] }, to: { face: 'B', indices: [8, 5, 2] } },
        { from: { face: 'B', indices: [8, 5, 2] }, to: { face: 'D', indices: [0, 3, 6] } },
        { from: { face: 'D', indices: [0, 3, 6] }, to: { face: 'F', indices: [0, 3, 6] } }
      ],
      counterclockwise: [
        { from: { face: 'F', indices: [0, 3, 6] }, to: { face: 'D', indices: [0, 3, 6] } },
        { from: { face: 'D', indices: [0, 3, 6] }, to: { face: 'B', indices: [8, 5, 2] } },
        { from: { face: 'B', indices: [8, 5, 2] }, to: { face: 'U', indices: [0, 3, 6] } },
        { from: { face: 'U', indices: [0, 3, 6] }, to: { face: 'F', indices: [0, 3, 6] } }
      ]
    },
    'B': {
      clockwise: [
        // Up top row -> Left left column -> Down bottom row (reversed) -> Right right column (reversed) -> Up top row
        { from: { face: 'U', indices: [0, 1, 2] }, to: { face: 'L', indices: [0, 3, 6] } },
        { from: { face: 'L', indices: [0, 3, 6] }, to: { face: 'D', indices: [8, 7, 6] } },
        { from: { face: 'D', indices: [8, 7, 6] }, to: { face: 'R', indices: [2, 5, 8] } },
        { from: { face: 'R', indices: [2, 5, 8] }, to: { face: 'U', indices: [0, 1, 2] } }
      ],
      counterclockwise: [
        { from: { face: 'U', indices: [0, 1, 2] }, to: { face: 'R', indices: [2, 5, 8] } },
        { from: { face: 'R', indices: [2, 5, 8] }, to: { face: 'D', indices: [8, 7, 6] } },
        { from: { face: 'D', indices: [8, 7, 6] }, to: { face: 'L', indices: [0, 3, 6] } },
        { from: { face: 'L', indices: [0, 3, 6] }, to: { face: 'U', indices: [0, 1, 2] } }
      ]
    }
  };
  
  const faceOrder = ['U', 'R', 'F', 'D', 'L', 'B'];
  const getFaceIndex = (face) => faceOrder.indexOf(face);
  const getStickerIndex = (face, index) => getFaceIndex(face) * 9 + index;
  
  const moves = clockwise 
    ? adjacentMoves[face].clockwise 
    : adjacentMoves[face].counterclockwise;
  
  // Store the original values from all source positions
  const sourceValues = moves.map(move => 
    move.from.indices.map(idx => result[getStickerIndex(move.from.face, idx)])
  );
  
  // Apply the moves: each target gets values from the previous source
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    const sourceIndex = (i - 1 + moves.length) % moves.length; // Previous source
    const values = sourceValues[sourceIndex];
    
    move.to.indices.forEach((toIdx, j) => {
      result[getStickerIndex(move.to.face, toIdx)] = values[j];
    });
  }
  
  return result.join('');
}

/**
 * Apply a single move to the cube
 * @param {string} cubeString - Current cube string
 * @param {string} move - Move notation (e.g., "R", "R'", "R2", "U", "F'", etc.)
 * @returns {string} New cube string after applying the move
 */
export function applyMove(cubeString, move) {
  // Parse the move
  const moveRegex = /([URFDLB])(['2])?/;
  const match = move.match(moveRegex);
  
  if (!match) {
    console.warn(`Invalid move: ${move}`);
    return cubeString;
  }
  
  const face = match[1];
  const modifier = match[2] || '';
  
  let result = cubeString;
  
  if (modifier === "'") {
    // Counterclockwise
    result = rotateFaceCounterclockwise(result, face);
    result = rotateAdjacentStickers(result, face, false);
  } else if (modifier === '2') {
    // 180 degrees
    result = rotateFace180(result, face);
    result = rotateAdjacentStickers(result, face, true);
    result = rotateAdjacentStickers(result, face, true);
  } else {
    // Clockwise
    result = rotateFaceClockwise(result, face);
    result = rotateAdjacentStickers(result, face, true);
  }
  
  return result;
}

/**
 * Apply multiple moves to the cube
 * @param {string} cubeString - Starting cube string
 * @param {string} solution - Solution string with moves separated by spaces
 * @returns {string} Final cube string after all moves
 */
export function applySolution(cubeString, solution) {
  const moves = solution.split(' ').filter(m => m.trim());
  let result = cubeString;
  
  for (const move of moves) {
    result = applyMove(result, move);
  }
  
  return result;
}

/**
 * Parse a solution string into individual moves
 * @param {string} solution - Solution string
 * @returns {Array<string>} Array of move strings
 */
export function parseSolution(solution) {
  return solution.split(' ').filter(m => m.trim());
}


