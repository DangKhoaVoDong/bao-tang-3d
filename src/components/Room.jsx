import React, { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export function Room({
  position = [0, 0, 0],
  size = 10,
  height = 4,
  exits = { left: false, right: false, forward: false, backward: false }
}) {
  const wallThickness = 0.2;
  const doorWidth = 2.5;
  const doorHeight = 3.0;
  const baseHeight = 0.3; // Chiều cao phào chân tường

  const floorTexture = useTexture('/textures/san.jpg');
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(2, 1);

  // Định nghĩa vật liệu từ bảng màu mẫu
  const wallMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#CBBCA0', roughness: 0.7 }), []);
  const accentMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#B29A7F', roughness: 0.7 }), []);
  const baseMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#5B3F2B', roughness: 0.7 }), []);
  const ceilingMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#E6E1D7', roughness: 0.9 }), []);
  const floorMaterial = useMemo(() => new THREE.MeshStandardMaterial({ map: floorTexture, roughness: 0.3, metalness: 0.1 }), [floorTexture]);

  const sideWallWidth = (size - doorWidth) / 2;
  const topWallHeight = height - doorHeight;

  // 1. DỰNG VÁCH TIẾP GIÁP DỌC (CÓ CỬA HOẶC BỊT KÍN)
  const renderZWall = (hasExit, translateZ) => {
    // Để phào khép góc khít với tường hông, chiều rộng vách cần bù thêm độ dày tường
    const fullWidth = size + wallThickness; 

    if (!hasExit) {
      return (
        <group position={[0, 0, translateZ]}>
          {/* Phào chân tường phẳng bọc kín góc */}
          <mesh position={[0, baseHeight / 2, 0]} material={baseMaterial} castShadow receiveShadow>
            <boxGeometry args={[fullWidth, baseHeight, wallThickness]} />
          </mesh>
          {/* Thân tường phẳng */}
          <mesh position={[0, (height + baseHeight) / 2, 0]} material={wallMaterial} castShadow receiveShadow>
            <boxGeometry args={[fullWidth, height - baseHeight, wallThickness]} />
          </mesh>
        </group>
      );
    }

    // TÍNH TOÁN CHO TRƯỜNG HỢP CÓ CỬA THÔNG: 
    // Xác định xem vách đang nằm ở phía trước (-size/2) hay phía sau (size/2) để ép mặt phào hướng vào trong phòng
    const isForwardWall = translateZ < 0;
    const baseZOffset = isForwardWall ? wallThickness / 2 : -wallThickness / 2;

    return (
      <group position={[0, 0, translateZ]}>
        {/* Vách đứng trái cửa */}
        <mesh position={[-size / 2 + sideWallWidth / 2, height / 2, 0]} material={wallMaterial} castShadow receiveShadow>
          <boxGeometry args={[sideWallWidth, height, wallThickness]} />
        </mesh>
        
        {/* Vách đứng phải cửa */}
        <mesh position={[size / 2 - sideWallWidth / 2, height / 2, 0]} material={wallMaterial} castShadow receiveShadow>
          <boxGeometry args={[sideWallWidth, height, wallThickness]} />
        </mesh>

        {/* Mảng trán cửa phía trên đầu */}
        {topWallHeight > 0 && (
          <mesh position={[0, doorHeight + topWallHeight / 2, 0]} material={accentMaterial} castShadow receiveShadow>
            <boxGeometry args={[doorWidth, topWallHeight, wallThickness]} />
          </mesh>
        )}

        {/* SỬA TẠI ĐÂY: Phào chân tường hai bên cửa được ép phẳng dính sát vào mặt tường hướng vào lòng phòng */}
        <mesh position={[-size / 2 + sideWallWidth / 2, baseHeight / 2, baseZOffset]} material={baseMaterial} castShadow receiveShadow>
          <boxGeometry args={[sideWallWidth, baseHeight, 0.02]} /> {/* Độ dày phào mỏng dẹt dán lên tường */}
        </mesh>
        <mesh position={[size / 2 - sideWallWidth / 2, baseHeight / 2, baseZOffset]} material={baseMaterial} castShadow receiveShadow>
          <boxGeometry args={[sideWallWidth, baseHeight, 0.02]} />
        </mesh>
      </group>
    );
  };

  // 2. DỰNG VÁCH HÔNG MẠN SƯỜN TRÁI / PHẢI (LUÔN BỊT KÍN)
  const renderXWall = (translateX, isLeftWall) => {
    const rotationY = isLeftWall ? Math.PI / 2 : -Math.PI / 2;

    return (
      <group position={[translateX, 0, 0]} rotation={[0, rotationY, 0]}>
        {/* Phào chân tường dọc mạn sườn */}
        <mesh position={[0, baseHeight / 2, 0]} material={baseMaterial} castShadow receiveShadow>
          <boxGeometry args={[size - wallThickness, baseHeight, wallThickness]} />
        </mesh>
        {/* Thân tường dọc mạn sườn */}
        <mesh position={[0, (height + baseHeight) / 2, 0]} material={wallMaterial} castShadow receiveShadow>
          <boxGeometry args={[size - wallThickness, height - baseHeight, wallThickness]} />
        </mesh>
      </group>
    );
  };

  return (
    <group position={position}>
      {/* Nền sàn */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={floorMaterial} receiveShadow>
        <planeGeometry args={[size, size]} />
      </mesh>

      {/* Trần nhà */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]} material={ceilingMaterial}>
        <planeGeometry args={[size, size]} />
      </mesh>

      {/* Render vách dọc */}
      {renderZWall(exits.forward, -size / 2)}
      {renderZWall(exits.backward, size / 2)}

      {/* Render vách hông */}
      {renderXWall(-size / 2, true)}
      {renderXWall(size / 2, false)}
    </group>
  );
}
