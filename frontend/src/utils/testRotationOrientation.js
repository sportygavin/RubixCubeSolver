/**
 * Test to verify rotation orientation is correct
 */

import { applyMove } from './cubeRotations';
import { SOLVED_CUBE } from './cubeState';

/**
 * Test R2 rotation - should return to original after 2 rotations
 */
export function testR2() {
  const afterR = applyMove(SOLVED_CUBE, 'R');
  const afterR2 = applyMove(afterR, 'R');
  
  return {
    isCorrect: afterR2 === SOLVED_CUBE,
    afterR: afterR,
    afterR2: afterR2,
    differences: findDifferences(SOLVED_CUBE, afterR2)
  };
}

/**
 * Test that R + R' returns to solved
 */
export function testRInverse() {
  const afterR = applyMove(SOLVED_CUBE, 'R');
  const afterRPrime = applyMove(afterR, "R'");
  
  return {
    isCorrect: afterRPrime === SOLVED_CUBE,
    differences: findDifferences(SOLVED_CUBE, afterRPrime)
  };
}

/**
 * Test all basic moves: R, R', R2, L, L', L2, U, U', U2, D, D', D2, F, F', F2, B, B', B2
 */
export function testAllBasicMoves() {
  const moves = ['R', "R'", 'R2', 'L', "L'", 'L2', 'U', "U'", 'U2', 'D', "D'", 'D2', 'F', "F'", 'F2', 'B', "B'", 'B2'];
  const results = {};
  
  for (const move of moves) {
    const afterMove = applyMove(SOLVED_CUBE, move);
    const afterInverse = applyMove(afterMove, getInverse(move));
    results[move] = {
      afterMove: afterMove.substring(0, 20) + '...',
      returnsToSolved: afterInverse === SOLVED_CUBE,
      differences: afterInverse !== SOLVED_CUBE ? findDifferences(SOLVED_CUBE, afterInverse).slice(0, 5) : []
    };
  }
  
  return results;
}

function getInverse(move) {
  if (move.endsWith("'")) {
    return move.slice(0, -1);
  } else if (move.endsWith('2')) {
    return move; // 180 degree moves are their own inverse
  } else {
    return move + "'";
  }
}

function findDifferences(str1, str2) {
  const diffs = [];
  for (let i = 0; i < Math.min(str1.length, str2.length); i++) {
    if (str1[i] !== str2[i]) {
      const face = Math.floor(i / 9);
      const faceNames = ['U', 'R', 'F', 'D', 'L', 'B'];
      const positionInFace = i % 9;
      const row = Math.floor(positionInFace / 3);
      const col = positionInFace % 3;
      diffs.push({
        index: i,
        face: faceNames[face],
        position: `[${row},${col}]`,
        expected: str1[i],
        got: str2[i]
      });
    }
  }
  return diffs;
}

