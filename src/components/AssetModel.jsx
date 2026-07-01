import React from 'react';
import { useGLTF } from '@react-three/drei';

export function AssetModel({ url, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene.clone()} position={position} rotation={rotation} scale={scale} />;
}
