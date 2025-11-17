/**
 * Test utility to verify cube rotations work correctly
 */

import { applyMove, applySolution } from './cubeRotations';
import { SOLVED_CUBE } from './cubeState';

// Test that applying a move and its inverse returns to solved
export function testMoveInverse() {
  const moves = ['R', 'R\'', 'U', 'U\'', 'F', 'F\'', 'D', 'D\'', 'L', 'L\'', 'B', 'B\''];
  const results = [];
  
  for (const move of moves) {
    const afterMove = applyMove(SOLVED_CUBE, move);
    const inverse = move.includes("'") ? move.replace("'", "") : move + "'";
    const afterInverse = applyMove(afterMove, inverse);
    
    const isCorrect = afterInverse === SOLVED_CUBE;
    results.push({
      move,
      inverse,
      isCorrect,
      afterMove: afterMove.substring(0, 20) + '...',
      afterInverse: afterInverse.substring(0, 20) + '...'
    });
    
    if (!isCorrect) {
      console.error(`FAILED: ${move} + ${inverse} should return to solved`);
      console.error('Expected:', SOLVED_CUBE);
      console.error('Got:', afterInverse);
    }
  }
  
  return results;
}

// Test that applying R four times returns to solved
export function testFourMoves() {
  const afterR = applyMove(SOLVED_CUBE, 'R');
  const afterR2 = applyMove(afterR, 'R');
  const afterR3 = applyMove(afterR2, 'R');
  const afterR4 = applyMove(afterR3, 'R');
  
  return {
    afterR: afterR.substring(0, 20) + '...',
    afterR4: afterR4.substring(0, 20) + '...',
    isCorrect: afterR4 === SOLVED_CUBE
  };
}

// Test with a known solution
export function testKnownSolution() {
  // Start with solved, apply a known scramble, then apply its solution
  // This should return to solved
  const scramble = "R U R' U R U2 R'";
  const scrambled = applySolution(SOLVED_CUBE, scramble);
  
  // The solution to get back would be the inverse
  // But we need to reverse and invert each move
  const solution = scramble.split(' ').reverse().map(m => {
    if (m.includes("'")) {
      return m.replace("'", "");
    } else if (m.includes("2")) {
      return m; // 2 is its own inverse
    } else {
      return m + "'";
    }
  }).join(' ');
  
  const solved = applySolution(scrambled, solution);
  
  return {
    scramble,
    solution,
    isCorrect: solved === SOLVED_CUBE,
    scrambled: scrambled.substring(0, 20) + '...',
    solved: solved.substring(0, 20) + '...'
  };
}

