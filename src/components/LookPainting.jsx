import { useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function LookPainting({ onOpenPainting, activePainting, onHoverChange, isPaused }) {
  const { camera, scene } = useThree();
  const [hoveredPainting, setHoveredPainting] = useState(null);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouse = useMemo(() => new THREE.Vector2(0, 0), []);

  useFrame(() => {
    if (activePainting || isPaused) {
      if (hoveredPainting) {
        setHoveredPainting(null);
        onHoverChange?.(null);
      }
      return;
    }

    raycaster.setFromCamera(mouse, camera);

    const paintingGroups = [];
    scene.traverse((child) => {
      if (child.isGroup && child.userData?.paintingUrl) {
        paintingGroups.push(child);
      }
    });

    const intersects = raycaster.intersectObjects(paintingGroups, true);

    if (intersects.length > 0) {
      for (const intersect of intersects) {
        let parent = intersect.object;
        while (parent) {
          if (parent.userData?.paintingUrl) {
            const paintingUrl = parent.userData.paintingUrl;
            if (hoveredPainting !== paintingUrl) {
              setHoveredPainting(paintingUrl);
              onHoverChange?.(paintingUrl);
            }
            return;
          }
          parent = parent.parent;
        }
      }
      
      if (hoveredPainting) {
        setHoveredPainting(null);
        onHoverChange?.(null);
      }
    } else if (hoveredPainting) {
      setHoveredPainting(null);
      onHoverChange?.(null);
    }
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'KeyE' && hoveredPainting && !activePainting && !isPaused) {
        onOpenPainting(hoveredPainting);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hoveredPainting, activePainting, isPaused, onOpenPainting]);

  return null;
}
