import React from 'react';

export function Pedestal({ position, width = 1, height = 1.2, depth = 1 }) {
  return (
    <mesh position={[position[0], height / 2, position[2]]} castShadow receiveShadow>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color="#9A7A42" roughness={0.3} metalness={0.1} />
    </mesh>
  );
}
