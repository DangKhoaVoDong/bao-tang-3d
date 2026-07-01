import React, { useState } from 'react';
import { useTexture } from '@react-three/drei';

export function Painting({ position, rotation, url, size = [3, 2], fallbackColor = '#8B4513', onPointerOver, onPointerOut }) {
  const [textureError, setTextureError] = useState(false);

  let texture;
  if (!textureError) {
    try {
      texture = useTexture(url);
    } catch (e) {
      setTextureError(true);
    }
  }

  return (
    <group position={position} rotation={rotation} userData={{ paintingUrl: url }}>
      {/* Khung tranh gỗ nổi, có độ dày và độ sâu */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[size[0] + 0.2, size[1] + 0.2, 0.08]} />
        <meshStandardMaterial color="#7A5A37" roughness={0.6} />
      </mesh>

      {/* Mặt tranh hắt nhẹ ra phía trước khung */}
      <mesh
        position={[0, 0, 0.042]}
        castShadow
        receiveShadow
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        <planeGeometry args={size} />
        <meshStandardMaterial
          map={texture}
          color={textureError ? fallbackColor : '#ffffff'}
          roughness={0.4}
          clearcoat={0.2}
        />
      </mesh>
    </group>
  );
}
