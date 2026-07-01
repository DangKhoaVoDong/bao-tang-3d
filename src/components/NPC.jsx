import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Vùng cấm giống như Player để NPC không đi xuyên qua tường và đồ vật
const WALL_X = { left: -4.6, right: 4.6 };
const WALL_Z = { min: -34.6, max: 4.6 };

// Các vùng cấm giữa phòng (hàng rào, khung kính)
const OBSTACLES = [
  { xMin: -1.5, xMax: 1.5, zMin: -14.0, zMax: -6.5 },
  { xMin: -1.5, xMax: 1.5, zMin: -22.0, zMax: -18.0 },
  { xMin: 2.5, xMax: 4.0, zMin: -5.0, zMax: -3.5 },
  { xMin: 2.5, xMax: 4.0, zMin: -16.5, zMax: -14.5 },
];

// Các vách ngăn có cửa
const DOOR_WALLS = [
  { z: -5.0, doorXMin: -1.25, doorXMax: 1.25 },
  { z: -15.0, doorXMin: -1.25, doorXMax: 1.25 },
  { z: -25.0, doorXMin: -1.25, doorXMax: 1.25 },
];

// Tạo nhân vật với tay khép lại và màu tùy chỉnh
function SimpleNPCModel({ shirtColor, pantsColor, skinColor, hairColor }) {
  return (
    <group>
      {/* Đầu */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* Tóc */}
      <mesh position={[0, 1.72, 0]} castShadow>
        <sphereGeometry args={[0.26, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={hairColor} />
      </mesh>

      {/* Mắt */}
      <mesh position={[-0.08, 1.65, 0.22]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.08, 1.65, 0.22]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Thân (áo) */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.3, 1.2, 16]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>

      {/* Cổ áo */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.15, 16]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>

      {/* Tay trái - khép xuống dưới */}
      <mesh position={[-0.28, 0.9, 0]} rotation={[0.15, 0, 0.05]} castShadow>
        <capsuleGeometry args={[0.06, 0.45, 4, 8]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* Tay phải - khép xuống dưới */}
      <mesh position={[0.28, 0.9, 0]} rotation={[0.15, 0, -0.05]} castShadow>
        <capsuleGeometry args={[0.06, 0.45, 4, 8]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* Chân trái */}
      <mesh position={[-0.1, 0.2, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.35, 4, 8]} />
        <meshStandardMaterial color={pantsColor} />
      </mesh>

      {/* Chân phải */}
      <mesh position={[0.1, 0.2, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.35, 4, 8]} />
        <meshStandardMaterial color={pantsColor} />
      </mesh>

      {/* Thắt lưng */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.23, 0.23, 0.08, 16]} />
        <meshStandardMaterial color="#2c1810" />
      </mesh>
    </group>
  );
}

// Component NPC riêng cho mỗi phòng
function NPCCreature({ initialPosition, targetZRange, shirtColor, pantsColor, skinColor, hairColor }) {
  const npcRef = useRef();

  const targetPos = useRef(new THREE.Vector3(initialPosition.x, 0, initialPosition.z));
  const delayTimer = useRef(0);
  const waitTime = useRef(2 + Math.random() * 3);
  const speed = 2;

  const getNewRandomPosition = () => {
    let pos;
    let attempts = 0;
    do {
      const x = (Math.random() - 0.5) * 8;
      const z = -Math.random() * (targetZRange.max - targetZRange.min) + targetZRange.max;
      pos = new THREE.Vector3(x, 0, z);
      attempts++;
    } while (
      attempts < 50 && OBSTACLES.some(obs =>
        pos.x > obs.xMin && pos.x < obs.xMax &&
        pos.z > obs.zMin && pos.z < obs.zMax
      )
    );
    return pos;
  };

  const isValidPosition = (pos) => {
    if (pos.x < WALL_X.left || pos.x > WALL_X.right) return false;
    if (pos.z < WALL_Z.min || pos.z > WALL_Z.max) return false;

    if (pos.z > targetZRange.max || pos.z < targetZRange.min) return false;

    for (const obs of OBSTACLES) {
      if (
        pos.x > obs.xMin - 0.5 && pos.x < obs.xMax + 0.5 &&
        pos.z > obs.zMin - 0.5 && pos.z < obs.zMax + 0.5
      ) {
        return false;
      }
    }

    for (const door of DOOR_WALLS) {
      if (pos.x < door.doorXMin - 0.5 || pos.x > door.doorXMax + 0.5) {
        if (Math.abs(pos.z - door.z) < 0.5) return false;
      }
    }

    return true;
  };

  useFrame((state, delta) => {
    if (!npcRef || !npcRef.current) return;

    const currentPosX = npcRef.current.position.x;
    const currentPosZ = npcRef.current.position.z;

    const distance = Math.sqrt(
      Math.pow(targetPos.current.x - currentPosX, 2) +
      Math.pow(targetPos.current.z - currentPosZ, 2)
    );

    if (distance > 0.3) {
      const dirX = targetPos.current.x - currentPosX;
      const dirZ = targetPos.current.z - currentPosZ;
      const length = Math.sqrt(dirX * dirX + dirZ * dirZ);

      if (length > 0.001) {
        const normalizedX = dirX / length;
        const normalizedZ = dirZ / length;

        const nextX = currentPosX + normalizedX * speed * delta;
        const nextZ = currentPosZ + normalizedZ * speed * delta;

        if (isValidPosition(new THREE.Vector3(nextX, 0, nextZ))) {
          npcRef.current.position.x = nextX;
          npcRef.current.position.z = nextZ;
        } else {
          const newPos = getNewRandomPosition();
          targetPos.current.copy(newPos);
        }

        const angle = Math.atan2(normalizedX, normalizedZ);
        npcRef.current.rotation.y = angle;
      }

      const time = state.clock.getElapsedTime();
      npcRef.current.rotation.z = Math.sin(time * 8) * 0.03;
    } else {
      npcRef.current.rotation.z = 0;

      delayTimer.current += delta;
      if (delayTimer.current > waitTime.current) {
        const newPos = getNewRandomPosition();
        targetPos.current.copy(newPos);
        delayTimer.current = 0;
        waitTime.current = 2 + Math.random() * 3;
      }
    }

    npcRef.current.position.y = 0.05;
  });

  return (
    <group ref={npcRef} position={[initialPosition.x, 0.05, initialPosition.z]}>
      <SimpleNPCModel
        shirtColor={shirtColor}
        pantsColor={pantsColor}
        skinColor={skinColor}
        hairColor={hairColor}
      />
    </group>
  );
}

// NPC 1: Phòng 1 - Công sở (vest xanh dương)
export function NPC1() {
  return (
    <NPCCreature
      initialPosition={{ x: 0, z: -5 }}
      targetZRange={{ min: -10, max: 0 }}
      shirtColor="#1e3a5f"
      pantsColor="#2c3e50"
      skinColor="#f5d0a9"
      hairColor="#2c1810"
    />
  );
}

// NPC 2: Phòng 2 - Áo dài xanh lá (truyền thống Việt Nam)
export function NPC2() {
  return (
    <NPCCreature
      initialPosition={{ x: 1, z: -15 }}
      targetZRange={{ min: -20, max: -10 }}
      shirtColor="#0d5c3d"
      pantsColor="#f5f5dc"
      skinColor="#e8c4a0"
      hairColor="#1a1a1a"
    />
  );
}

// NPC 3: Phòng 4 - Nhân viên bảo tàng (vest nâu)
export function NPC3() {
  return (
    <NPCCreature
      initialPosition={{ x: -1, z: -32 }}
      targetZRange={{ min: -34.6, max: -25 }}
      shirtColor="#5c4033"
      pantsColor="#3d2b1f"
      skinColor="#c68642"
      hairColor="#4a4a4a"
    />
  );
}
