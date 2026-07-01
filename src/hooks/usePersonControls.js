import { useEffect, useState } from 'react';

export function usePersonControls() {
  const keys = { KeyW: 'forward', KeyS: 'backward', KeyA: 'left', KeyD: 'right' };
  const moveField = (key) => keys[key];

  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (moveField(e.code)) {
        setMovement((m) => ({ ...m, [moveField(e.code)]: true }));
      }
    };

    const handleKeyUp = (e) => {
      if (moveField(e.code)) {
        setMovement((m) => ({ ...m, [moveField(e.code)]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return movement;
}
