/**
 * Test utility to verify cube rotations
 */

import { applyMove } from './cubeRotations';
import { SOLVED_CUBE } from './cubeState';

/**
 * Test that R + R' returns to solved
 */
export function testRInverse() {
  const afterR = applyMove(SOLVED_CUBE, 'R');
  const afterRPrime = applyMove(afterR, "R'");
  
  return {
    original: SOLVED_CUBE,
    afterR: afterR.substring(0, 30) + '...',
    afterRPrime: afterRPrime.substring(0, 30) + '...',
    isCorrect: afterRPrime === SOLVED_CUBE,
    differences: findDifferences(SOLVED_CUBE, afterRPrime)
  };
}

/**
 * Test that R4 returns to solved (4 rotations = full circle)
 */
export function testR4() {
  let cube = SOLVED_CUBE;
  for (let i = 0; i < 4; i++) {
    cube = applyMove(cube, 'R');
  }
  
  return {
    isCorrect: cube === SOLVED_CUBE,
    differences: findDifferences(SOLVED_CUBE, cube)
  };
}

/**
 * Test that R and L don't affect each other
 */
export function testRLIndependence() {
  const afterR = applyMove(SOLVED_CUBE, 'R');
  
  // Check L face positions (36-44) - they should be unchanged
  const lFaceOriginal = SOLVED_CUBE.substring(36, 45);
  const lFaceAfterR = afterR.substring(36, 45);
  
  const afterL = applyMove(SOLVED_CUBE, 'L');
  
  // Check R face positions (9-17) - they should be unchanged
  const rFaceOriginal = SOLVED_CUBE.substring(9, 18);
  const rFaceAfterL = afterL.substring(9, 18);
  
  return {
    lFaceUnchanged: lFaceOriginal === lFaceAfterR,
    rFaceUnchanged: rFaceOriginal === rFaceAfterL,
    lFaceOriginal,
    lFaceAfterR,
    rFaceOriginal,
    rFaceAfterL
  };
}

/**
 * Find differences between two cube strings
 */
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

