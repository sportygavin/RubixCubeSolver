import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
import { COLOR_MAP, getFaceletColor } from '../utils/cubeState';

// Extend R3F with OrbitControls
extend({ OrbitControls });

/**
 * Individual facelet component (one sticker on the cube)
 */
function Facelet({ position, color, onClick, isSelected }) {
  const meshRef = useRef();
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* Facelet size: 0.98 to leave small gaps between stickers */}
      <boxGeometry args={[0.98, 0.98, 0.05]} />
      <meshStandardMaterial
        color={COLOR_MAP[color] || '#333333'}
        metalness={0.1}
        roughness={0.3}
        emissive={isSelected ? '#444444' : '#000000'}
        emissiveIntensity={isSelected ? 0.3 : 0}
      />
    </mesh>
  );
}

/**
 * Single face of the cube (9 facelets)
 */
function CubeFace({ face, cubeString, onFaceletClick, selectedFacelet, position, rotation }) {
  const facelets = [];
  
  // Create 3x3 grid of facelets
  // Each facelet is 1 unit wide, so they're positioned from -1 to +1
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const color = getFaceletColor(cubeString, face, row, col);
      const offsetX = (col - 1) * 1;
      const offsetY = (1 - row) * 1; // Invert Y for correct orientation
      // Position facelets on the face surface (slightly forward to avoid z-fighting)
      const offsetZ = 0.03; // Very small offset to sit on the face surface
      
      const faceletPosition = [
        offsetX,
        offsetY,
        offsetZ
      ];
      
      const faceletKey = `${face}-${row}-${col}`;
      const isSelected = selectedFacelet && 
        selectedFacelet.face === face && 
        selectedFacelet.row === row && 
        selectedFacelet.col === col;
      
      facelets.push(
        <Facelet
          key={faceletKey}
          position={faceletPosition}
          color={color}
          onClick={(e) => {
            e.stopPropagation();
            onFaceletClick(face, row, col);
          }}
          isSelected={isSelected}
        />
      );
    }
  }
  
  return (
    <group position={position} rotation={rotation}>
      {/* Backing plane for the face - positioned at z=0 */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3, 3, 0.1]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      {facelets}
    </group>
  );
}

/**
 * Main 3D cube component
 */
function RubiksCube({ cubeString, onFaceletClick, selectedFacelet, autoRotate }) {
  const groupRef = useRef();
  
  useFrame(() => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });
  
  // Define positions and rotations for each face
  // Each face is positioned 1.5 units from center
  const faces = [
    { face: 'U', position: [0, 1.5, 0], rotation: [-Math.PI / 2, 0, 0] }, // Up (Yellow)
    { face: 'D', position: [0, -1.5, 0], rotation: [Math.PI / 2, 0, 0] }, // Down (White)
    { face: 'F', position: [0, 0, 1.5], rotation: [0, 0, 0] }, // Front (Green)
    { face: 'B', position: [0, 0, -1.5], rotation: [0, Math.PI, 0] }, // Back (Blue)
    { face: 'R', position: [1.5, 0, 0], rotation: [0, Math.PI / 2, 0] }, // Right (Red)
    { face: 'L', position: [-1.5, 0, 0], rotation: [0, -Math.PI / 2, 0] }, // Left (Orange)
  ];
  
  return (
    <group ref={groupRef}>
      {faces.map(({ face, position, rotation }) => (
        <CubeFace
          key={face}
          face={face}
          cubeString={cubeString}
          onFaceletClick={onFaceletClick}
          selectedFacelet={selectedFacelet}
          position={position}
          rotation={rotation}
        />
      ))}
    </group>
  );
}

/**
 * Camera and Controls Setup Component
 */
function CameraControls({ autoRotate }) {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  
  useEffect(() => {
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });
  
  return (
    <orbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enablePan={false}
      minDistance={6}
      maxDistance={12}
      autoRotate={autoRotate}
      autoRotateSpeed={1}
    />
  );
}

/**
 * 3D Cube Viewer Component
 */
export default function Cube3D({ cubeString, onFaceletClick, selectedFacelet, autoRotate = false }) {
  return (
    <div style={{ width: '100%', height: '500px', background: '#1a1a1a', borderRadius: '8px' }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <pointLight position={[0, 0, 0]} intensity={0.3} />
        
        <RubiksCube
          cubeString={cubeString}
          onFaceletClick={onFaceletClick}
          selectedFacelet={selectedFacelet}
          autoRotate={autoRotate}
        />
        
        <CameraControls autoRotate={autoRotate} />
      </Canvas>
    </div>
  );
}

