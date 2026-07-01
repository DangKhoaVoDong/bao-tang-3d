import { useFrame, useThree } from '@react-three/fiber';
import { usePersonControls } from '../hooks/usePersonControls.js';
import * as THREE from 'three';

const MOVE_SPEED = 4;
const PLAYER_RADIUS = 0.4;

// Các vùng cấm di chuyển giữa phòng (tọa độ bounding box)
const OBSTACLES = [
  // Hàng rào bọc cụm bục kính phòng 2 (Z từ -14 đến -6.5, X từ -1.5 đến 1.5)
  { xMin: -1.2, xMax: 1.2, zMin: -12.0, zMax: -6.7 },
  // Hàng rào bọc cụm decor trung tâm phòng 3 (Z từ -22 đến -18, X từ -1.5 đến 1.5)
  { xMin: -1.5, xMax: 1.5, zMin: -22.0, zMax: -18.0 },
  // Khung kính trưng bày phòng 1 (X từ 2.5 đến 4, Z từ -5 đến -3.5)
  { xMin: 2.5, xMax: 4.0, zMin: -5.0, zMax: -3.5 },
  
  // Khung kính trưng bày phòng 3 (X từ 2.5 đến 4, Z từ -16.5 đến -14.5)
  { xMin: 2.5, xMax: 4.0, zMin: -16.5, zMax: -14.5 },
];

// Tường bao X (hông trái/phải) - sát vào mép tường thật
const WALL_X = {
  left: -4.6,   // Tường trái ở X = -5, trừ player radius
  right: 4.6,   // Tường phải ở X = 5, trừ player radius
};

// Giới hạn Z cho phép đi lại
const WALL_Z = {
  min: -34.6,  // Tường trước phòng 4 (Z = -35)
  max: 4.6,    // Tường sau phòng 1 (Z = 5)
};

// Các vách ngăn giữa các phòng có cửa đi qua
// doorXMin/doorXMax: vùng X mà cửa cho phép đi qua (ngoài vùng này = tường đặc)
// null = không có cửa (vách đặc, không đi qua được)
const DOOR_WALLS = [
  // Vách giữa phòng 1 (Z = -5) và phòng 2 (Z = -5): Có cửa rộng 2.5m (từ X = -1.25 đến 1.25)
  { z: -5.0, doorXMin: -1.25, doorXMax: 1.25 },
  // Vách giữa phòng 2 (Z = -15) và phòng 3 (Z = -15): Có cửa rộng 2.5m
  { z: -15.0, doorXMin: -1.25, doorXMax: 1.25 },
  // Vách giữa phòng 3 (Z = -25) và phòng 4 (Z = -25): Có cửa rộng 2.5m
  { z: -25.0, doorXMin: -1.25, doorXMax: 1.25 },
];

// Các vách đặc không có cửa (chặn hoàn toàn)
const SOLID_WALLS_Z = [
  5.0,    // Tường sau phòng 1 (Z = 5) - không có exits.backward ở phòng đầu
  -35.0,  // Tường trước phòng 4 (Z = -35) - không có exits.forward ở phòng cuối
];

export function Player({ isPaused }) {
  const { camera } = useThree();
  const { forward, backward, left, right } = usePersonControls();

  const frontVector = new THREE.Vector3();
  const sideVector = new THREE.Vector3();
  const direction = new THREE.Vector3();

  useFrame((state, delta) => {
    // Không di chuyển khi đang pause
    if (isPaused) return;

    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(MOVE_SPEED * delta)
      .applyEuler(camera.rotation);

    const nextX = camera.position.x + direction.x;
    const nextZ = camera.position.z + direction.z;

    // ================== KIỂM TRA VA CHẠM ==================
    let canMoveX = true;
    let canMoveZ = true;

    // A. Va chạm với TƯỜNG BAO HÔNG (trái/phải)
    if (nextX - PLAYER_RADIUS < WALL_X.left) {
      canMoveX = false;
    }
    if (nextX + PLAYER_RADIUS > WALL_X.right) {
      canMoveX = false;
    }

    // B. Va chạm với GIỚI HẠN Z (trước/sau hành lang)
    if (nextZ - PLAYER_RADIUS < WALL_Z.min) {
      canMoveZ = false;
    }
    if (nextZ + PLAYER_RADIUS > WALL_Z.max) {
      canMoveZ = false;
    }

    // C. Va chạm với CÁC VÁCH ĐẶC (không có cửa)
    for (const wallZ of SOLID_WALLS_Z) {
      // Đang ở trước tường, muốn đi qua tường
      if (camera.position.z < wallZ && nextZ >= wallZ - PLAYER_RADIUS) {
        canMoveZ = false;
      }
      // Đang ở sau tường, muốn đi ngược lại
      if (camera.position.z > wallZ && nextZ <= wallZ + PLAYER_RADIUS) {
        canMoveZ = false;
      }
    }

    // D. Va chạm với CÁC VÁCH CÓ CỬA (chỉ chặn nếu đi qua vùng tường đặc, không chặn qua cửa)
    for (const door of DOOR_WALLS) {
      // Kiểm tra khi đi QUA tường (từ trước sang sau hoặc ngược lại)
      const isCrossingForward = camera.position.z > door.z && nextZ <= door.z + PLAYER_RADIUS;
      const isCrossingBackward = camera.position.z < door.z && nextZ >= door.z - PLAYER_RADIUS;

      if (isCrossingForward || isCrossingBackward) {
        // Nếu vị trí hiện tại hoặc vị trí kế tiếp nằm NGOÀI vùng cửa → chặn
        const currentOutsideDoor = camera.position.x < door.doorXMin - PLAYER_RADIUS || camera.position.x > door.doorXMax + PLAYER_RADIUS;
        const nextOutsideDoor = nextX < door.doorXMin - PLAYER_RADIUS || nextX > door.doorXMax + PLAYER_RADIUS;

        // Chặn nếu đang ở ngoài cửa HOẶC sắp đi vào vùng ngoài cửa
        if (currentOutsideDoor || nextOutsideDoor) {
          canMoveZ = false;
        }
      }
    }

    // E. Va chạm với ĐỒ VẬT GIỮA PHÒNG
    for (const obs of OBSTACLES) {
      // Chặn di chuyển ngang nếu đang đi song song với vật cản
      if (
        nextX > obs.xMin - PLAYER_RADIUS &&
        nextX < obs.xMax + PLAYER_RADIUS &&
        camera.position.z > obs.zMin - PLAYER_RADIUS &&
        camera.position.z < obs.zMax + PLAYER_RADIUS
      ) {
        canMoveX = false;
      }
      // Chặn di chuyển dọc nếu đang đi về phía trước/sau vật cản
      if (
        camera.position.x > obs.xMin - PLAYER_RADIUS &&
        camera.position.x < obs.xMax + PLAYER_RADIUS &&
        nextZ > obs.zMin - PLAYER_RADIUS &&
        nextZ < obs.zMax + PLAYER_RADIUS
      ) {
        canMoveZ = false;
      }
    }

    // F. Chỉ cập nhật tọa độ khi không có va chạm
    if (canMoveX) camera.position.x = nextX;
    if (canMoveZ) camera.position.z = nextZ;

    // Cố định chiều cao mắt người xem
    camera.position.y = 1.6;
  });

  return null;
}
