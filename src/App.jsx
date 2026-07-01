import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { PointerLockControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Room } from './components/Room';
import { Player } from './components/Player';
import { Painting } from './components/Painting';
import { AssetModel } from './components/AssetModel';
import { LookPainting } from './components/LookPainting';
import { NPC1, NPC2, NPC3 } from './components/NPC';
import { BackgroundAudio } from './components/BackgroundAudio';
import { PauseMenu } from './components/PauseMenu';

function Carpet() {
  const carpetTexture = useTexture('/textures/tham.jpg');
  carpetTexture.wrapS = carpetTexture.wrapT = THREE.RepeatWrapping;
  // Tăng số lần lặp lại texture lên 3x3 để vân thảm không bị vỡ/gãy khi phóng to
  carpetTexture.repeat.set(1, 1); 

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -30]} receiveShadow>
      {/* SỬA TẠI ĐÂY: args={[Chiều rộng bự ra, Chiều dài bự ra] */}
      <planeGeometry args={[6, 6]} /> 
      <meshStandardMaterial map={carpetTexture} roughness={1} />
    </mesh>
  );
}

function App() {
  const SIZE = 10;
  const [activePainting, setActivePainting] = useState(null);
  const [hoveredPainting, setHoveredPainting] = useState(null);
  const [interactionPrompt, setInteractionPrompt] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const controlsRef = useRef();

  const paintingData = {
    '/textures/anh1.jpg': { title: 'Bước ngoặt của cuốc kháng chiến ( 1965)'},
    '/textures/anh2.jpg': { title: 'Cả dân tộc trong khói lửa chiến tranh'},
    '/textures/anh3.jpg': { title: 'Từ mậu thân đến bước ngoặt lịch sử' },
    '/textures/anh4.jpg': { title: 'Khôi phục miền Bắc Hậu phương không ngừng lớn mạnh ( 1969-1972)' },
    '/textures/anh5.jpg': { title: 'Điện Biên Phủ trên không Bảo vệ Miền Bắc (1972)' },
    '/textures/anh6.jpg': { title: 'Hiệp Định Paris Bước Ngoặt Ngoại Giao ( 1973)'},
    '/textures/anh7.jpg': { title: 'Đại Thắng Mùa Xuân 1975 Hoàn Thành Sự Nghiệp Thống Nhất Đất Nước' },
    '/textures/anh8.jpg': { title: 'Thắng Lợi Vĩ Đại Của Dân Tộc Ý Nghĩa Lịch Sử của giai đoạn 1954-1975' },
    '/textures/anh9.jpg': { title: 'Dấu Ấn Việt Nam Trên Trường Quốc Tế' },
    '/textures/anh10.jpg': { title: 'Di Sản Để Lại Kinh Nghiệm Lãnh Đạo Của Đảng ( 1954-1975)' },
    '/textures/anh11.jpg': { title: 'Đường Lối Di Cư Của Mỹ và Chính Quyền Ngô Đình Diệm sau hiệp định Gionevo (1954)' },
  };

  const openPainting = (url) => {
    const info = paintingData[url] || { title: 'Tác phẩm Triển lãm', desc: 'Thông tin chi tiết đang được cập nhật...' };
    setActivePainting({ url, ...info });
  };

  const closePainting = () => setActivePainting(null);

  const handleResume = () => {
    if (controlsRef.current) {
      controlsRef.current.lock();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'KeyE' && hoveredPainting && !activePainting) {
        openPainting(hoveredPainting);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hoveredPainting, activePainting]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Màn hình tạm dừng khi nhấn Esc */}
      <PauseMenu isPaused={isPaused} onResume={handleResume} />

      {/* Bộ điều khiển và phát nhạc nền */}
      <BackgroundAudio url="/audio/1.mp3" isPaused={isPaused} />

      {/* AudioControlUI đã được tích hợp vào PauseMenu */}

      {/* Chỉ hiển thị tâm ngắm khi KHÔNG mở popup */}
      {!activePainting && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'white',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            pointerEvents: 'none',
            border: '1px solid black'
          }}
        />
      )}

      {hoveredPainting && !activePainting && (
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            color: 'white',
            padding: '8px 14px',
            borderRadius: '999px',
            zIndex: 90,
            pointerEvents: 'none',
            fontSize: '14px'
          }}
        >
          Nhấn E để xem chi tiết
        </div>
      )}

      {/* GIAO DIỆN POPUP HTML */}
      {activePainting && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 100,
          fontFamily: 'sans-serif'
        }}>
          <div style={{
            backgroundColor: '#1a1a1a',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '800px',
            width: '90%',
            color: 'white',
            textAlign: 'center',
            border: '1px solid #333',
            boxShadow: '0px 10px 30px rgba(0,0,0,0.5)',
            position: 'relative'
          }}>
            <img
              src={activePainting.url}
              alt={activePainting.title}
              style={{ maxWidth: '100%', maxHeight: '50vh', borderRadius: '6px', marginBottom: '20px', border: '2px solid #444' }}
            />
            <h2 style={{ margin: '0 0 10px 0', color: '#ffdf9e', fontSize: '24px' }}>{activePainting.title}</h2>
            <p style={{ color: '#ccc', lineHeight: '1.6', fontSize: '15px', margin: '0 0 25px 0' }}>{activePainting.desc}</p>
            <button
              onClick={closePainting}
              style={{
                backgroundColor: '#bd9a5f',
                color: 'black',
                border: 'none',
                padding: '10px 25px',
                fontSize: '16px',
                fontWeight: 'bold',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#d4b375'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#bd9a5f'}
            >
              Đóng Xem Chi Tiết
            </button>
          </div>
        </div>
      )}

      <Canvas camera={{ position: [0, 1.6, 2], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 15, -20]} intensity={0.3} />

        {/* Khung kiến trúc 4 phòng liền mạch */}
        <Suspense fallback={null}>
          <Room position={[0, 0, 0]} exits={{ forward: true }} />
          <Room position={[0, 0, -SIZE]} exits={{ backward: true, forward: true }} />
          <Room position={[0, 0, -SIZE * 2]} exits={{ backward: true, forward: true }} />
          <Room position={[0, 0, -SIZE * 3]} exits={{ backward: true }} />
        </Suspense>

        {/* Hệ thống Triển lãm Tranh ảnh và Cổ vật 3D */}
        <Suspense fallback={null}>
          {/* ================= PHÒNG 1 (Tâm Z = 0) ================= */}
          {/* Tranh phẳng treo tường */}
          <Painting position={[-4.85, 2, 2.5]} rotation={[0, Math.PI / 2, 0]} url="/textures/anh1.jpg" size={[2, 1.5]} onPointerOver={() => setHoveredPainting('/textures/anh1.jpg')} onPointerOut={() => setHoveredPainting(null)} />
          <Painting position={[-4.85, 2, -2.5]} rotation={[0, Math.PI / 2, 0]} url="/textures/anh2.jpg" size={[2, 1.5]} onPointerOver={() => setHoveredPainting('/textures/anh2.jpg')} onPointerOut={() => setHoveredPainting(null)} />
          <Painting position={[4.85, 2, 0]} rotation={[0, -Math.PI / 2, 0]} url="/textures/anh3.jpg" size={[3.5, 2.2]} onPointerOver={() => setHoveredPainting('/textures/anh3.jpg')} onPointerOut={() => setHoveredPainting(null)} />

          {/* Cổ vật trang trí sảnh */}
          
          <AssetModel url="/models/khung_kinh_trung_bay.glb" position={[-3, 1, -4.28]} scale={1.7} />
          <AssetModel url="/models/tu1.glb" position={[3, 1, -4]} rotation={[0, Math.PI, 0]} scale={1.7} />
          <AssetModel url="/models/hang_rao.glb" position={[-2, 0, -4.28]} scale={0.5} />
          <AssetModel url="/models/ghe.glb" position={[3.3, 0.6, 4.4]} rotation={[0, Math.PI, 0]} scale={1} />
          <AssetModel url="/models/cua.glb" position={[0, 1.7, 4.8]} scale={1.7} />

          {/* Đèn rọi vách phải (Bức tranh lớn) */}
          <AssetModel rotation={[0, Math.PI / 2, 0]} url="/models/den_roi.glb" position={[3, 3.7, 0]} scale={1.2} />
          <pointLight position={[2.2, 2.3, 0]} intensity={18} distance={5.5} color="#fff1dc" castShadow /> 

          {/* Đèn rọi vách trái (2 bức tranh nhỏ) */}
          <AssetModel rotation={[0, -Math.PI / 2, 0]} url="/models/den_roi.glb" position={[-3, 3.7, 2.5]} scale={1.2} />
          <pointLight position={[-2.5, 2.3, 2.5]} intensity={14} distance={4} color="#fff1dc" castShadow />

          <AssetModel rotation={[0, -Math.PI / 2, 0]} url="/models/den_roi.glb" position={[-3, 3.7, -2.5]} scale={1.2} />
          <pointLight position={[-2.5, 2.3, -2.5]} intensity={14} distance={4} color="#fff1dc" castShadow />


          {/* ================= PHÒNG 2 (Tâm Z = -10) ================= */}
          {/* Tranh phẳng treo tường */}
          <Painting position={[-4.85, 2, -7.5]} rotation={[0, Math.PI / 2, 0]} url="/textures/anh4.jpg" size={[2, 1.5]} onPointerOver={() => setHoveredPainting('/textures/anh4.jpg')} onPointerOut={() => setHoveredPainting(null)} />
          <Painting position={[-4.85, 2, -12.5]} rotation={[0, Math.PI / 2, 0]} url="/textures/anh5.jpg" size={[2, 1.5]} onPointerOver={() => setHoveredPainting('/textures/anh5.jpg')} onPointerOut={() => setHoveredPainting(null)} />
          <Painting position={[4.85, 2, -7.5]} rotation={[0, -Math.PI / 2, 0]} url="/textures/anh6.jpg" size={[2, 1.5]} onPointerOver={() => setHoveredPainting('/textures/anh6.jpg')} onPointerOut={() => setHoveredPainting(null)} />
          <Painting position={[4.85, 2, -12.5]} rotation={[0, -Math.PI / 2, 0]} url="/textures/anh7.jpg" size={[2, 1.5]} onPointerOver={() => setHoveredPainting('/textures/anh7.jpg')} onPointerOut={() => setHoveredPainting(null)} />

          {/* Đèn rọi vách trái phòng 2 */}
          <AssetModel rotation={[0, -Math.PI / 2, 0]} url="/models/den_roi.glb" position={[-3, 3.7, -7.5]} scale={1.2} />
          <pointLight position={[-2.5, 2.3, -7.5]} intensity={14} distance={4} color="#fff1dc" castShadow />
          <AssetModel rotation={[0, -Math.PI / 2, 0]} url="/models/den_roi.glb" position={[-3, 3.7, -12.5]} scale={1.2} />
          <pointLight position={[-2.5, 2.3, -12.5]} intensity={14} distance={4} color="#fff1dc" castShadow />

          {/* Đèn rọi vách phải phòng 2 */}
          <AssetModel rotation={[0, Math.PI / 2, 0]} url="/models/den_roi.glb" position={[3, 3.7, -7.5]} scale={1.2} />
          <pointLight position={[2.5, 2.3, -7.5]} intensity={14} distance={4} color="#fff1dc" castShadow />
          <AssetModel rotation={[0, Math.PI / 2, 0]} url="/models/den_roi.glb" position={[3, 3.7, -12.5]} scale={1.2} />
          <pointLight position={[2.5, 2.3, -12.5]} intensity={14} distance={4} color="#fff1dc" castShadow />

          {/* A. HỆ THỐNG 3 BỤC KÍNH XẾP THẲNG HÀNG DỌC (Dịch nhẹ X = -1 để nhường lối đi bên mạn phải) */}
          {/* Bục 1: Màu xám đậm dẹt (Đặt ở phía gần sảnh - Z = -8) */}
          <AssetModel url="/models/buc12.glb" position={[0, 0, -8]} scale={[1, 0.6, 1]} />
          <AssetModel url="/models/dien_thoai.glb" position={[0, 0.9, -8]} scale={0.4} />
          {/* Bục 2: Màu trắng vuông tiêu chuẩn (Đặt ở chính giữa - Z = -10) */}
          <AssetModel url="/models/buc12.glb" position={[0, 0, -10]} scale={[1, 1, 1]} />
          {/* Bạn có thể đặt vương miện hoặc cổ vật lên bục này bằng cách nâng Y như sau: */}
          <AssetModel 
           url="/models/dong_ho_co.glb" 
           position={[0, 1.3, -10]} 
           rotation={[Math.PI / 2, 0, 0]}
           scale={0.25} 
          />
          {/* Bục 3: Màu kem vuông cao (Đặt ở phía trong - Z = -12) */}
          <AssetModel url="/models/buc12.glb" position={[0, 0, -12]} scale={[1, 1.2, 1]} />
          <AssetModel url="/models/qua_dia_cau.glb" position={[0, 1.5, -12]} scale={0.4} />

          {/* B. HỆ THỐNG HÀNG RÀO BẢO VỆ (Bọc xung quanh cụm bục kính) */}
          {/* Bạn dùng mô hình hang_rao.glb xếp bao quanh ma trận bục này */}
          <AssetModel url="/models/hang_rao.glb" position={[0, 0.5, -7.5]} scale={1} />
          <AssetModel url="/models/hang_rao.glb" position={[0, 0.5, -12.5]} scale={1} />

          <AssetModel url="/models/hang_rao.glb" position={[-1, 0.5, -9]} rotation={[0, Math.PI / 2, 0]} scale={1} />
          <AssetModel url="/models/hang_rao.glb" position={[-1, 0.5, -11]} rotation={[0, Math.PI / 2, 0]} scale={1} />

          {/* Cạnh Phải (Xoay dọc góc Math.PI / 2 để chặn bên mạn phải lối đi - X = 0.5) */}
          <AssetModel url="/models/hang_rao.glb" position={[1, 0.5, -9]} rotation={[0, Math.PI / 2, 0]} scale={1} />
          <AssetModel url="/models/hang_rao.glb" position={[1, 0.5, -11]} rotation={[0, Math.PI / 2, 0]} scale={1} />

          {/* C. 2 CHẬU CÂY DECOR XẾP PHÍA SAU (Đặt sát vách tường trái để làm nền) */}
          <AssetModel url="/models/chau_cay.glb" position={[4.5, 0.7, -10]} scale={0.8} />
          <AssetModel url="/models/chau_cay.glb" position={[-4.5, 0.7, -10]} scale={0.8} />

          {/* ================= PHÒNG 3 (Tâm Z = -20) ================= */}
          {/* Tranh phẳng treo tường */}
          <Painting position={[-4.85, 2, -17.5]} rotation={[0, Math.PI / 2, 0]} url="/textures/anh8.jpg" size={[2, 1.5]} onPointerOver={() => setHoveredPainting('/textures/anh8.jpg')} onPointerOut={() => setHoveredPainting(null)} />
          <Painting position={[-4.85, 2, -22.5]} rotation={[0, Math.PI / 2, 0]} url="/textures/anh9.jpg" size={[2, 1.5]} onPointerOver={() => setHoveredPainting('/textures/anh9.jpg')} onPointerOut={() => setHoveredPainting(null)} />
          <Painting position={[4.85, 2, -20]} rotation={[0, -Math.PI / 2, 0]} url="/textures/anh10.jpg" size={[3.5, 2.2]} onPointerOver={() => setHoveredPainting('/textures/anh10.jpg')} onPointerOut={() => setHoveredPainting(null)} />

          {/* Cổ vật trưng bày giữa phòng */}
          <AssetModel url="/models/khung_kinh_trung_bay.glb" position={[3, 1, -15.45]} scale={1.5} />
          <AssetModel url="/models/qua_dia_cau.glb" position={[2.5, 1.5, -15.45]} scale={0.4} />
          <AssetModel url="/models/decor.glb" position={[0, 0.9, -20]} scale={1} />

          <AssetModel url="/models/hang_rao.glb" position={[0, 0.5, -18.8]} scale={1} />
          <AssetModel url="/models/hang_rao.glb" position={[0, 0.5, -21.2]} scale={1} />
          <AssetModel url="/models/hang_rao.glb" position={[1, 0.5, -20]} rotation={[0, Math.PI / 2, 0]} scale={1} />
          <AssetModel url="/models/hang_rao.glb" position={[-1, 0.5, -20]} rotation={[0, Math.PI / 2, 0]} scale={1} />
          {/* Đèn rọi vách trái phòng 3 */}
          <AssetModel rotation={[0, -Math.PI / 2, 0]} url="/models/den_roi.glb" position={[-3, 3.7, -17.5]} scale={1.2} />
          <pointLight position={[-2.5, 2.3, -17.5]} intensity={14} distance={4} color="#fff1dc" castShadow />
          <AssetModel rotation={[0, -Math.PI / 2, 0]} url="/models/den_roi.glb" position={[-3, 3.7, -22.5]} scale={1.2} />
          <pointLight position={[-2.5, 2.3, -22.5]} intensity={14} distance={4} color="#fff1dc" castShadow />

          {/* Đèn rọi vách phải phòng 3 (Bức tranh lớn) */}
          <AssetModel rotation={[0, Math.PI / 2, 0]} url="/models/den_roi.glb" position={[3, 3.7, -20]} scale={1.2} />
          <pointLight position={[2.2, 2.3, -20]} intensity={18} distance={5.5} color="#fff1dc" castShadow />

          <AssetModel url="/models/ghe.glb" position={[3.3, 0.6, -24.5]}  scale={1} />
          <AssetModel url="/models/ghe.glb" position={[-3.3, 0.6, -24.5]} scale={1} />

          {/* ================= PHÒNG 4 (Tâm Z = -30) ================= */}
          {/* Bức tranh lớn kết thúc lối đi */}
          <Painting position={[0, 2, -34.85]} rotation={[0, 0, 0]} url="/textures/anh11.jpg" size={[5, 3]} onPointerOver={() => setHoveredPainting('/textures/anh11.jpg')} onPointerOut={() => setHoveredPainting(null)} />
          <AssetModel url="/models/chau_cay.glb" position={[-3.5, 0.8, -34]} scale={0.8} />
          <AssetModel url="/models/chau_cay.glb" position={[3.5, 0.8, -34]} scale={0.8} />

          {/* Gọi Component Carpet ở đây (Đã nằm an toàn dưới Canvas và Suspense) */}
          <Carpet />
          {/* Đèn rọi bức tranh cuối hành lang */}
          <AssetModel rotation={[0, 3.1, 0]} url="/models/den_roi.glb" position={[0, 3.7, -32]} scale={1.2} />
          <pointLight position={[0, 2.2, -31.5]} intensity={22} distance={6} color="#fff1dc" castShadow />

          {/* NPC di chuyển ngẫu nhiên trong bảo tàng */}
          <NPC1 />
          <NPC2 />
          <NPC3 />
        </Suspense>

        <LookPainting onOpenPainting={openPainting} activePainting={activePainting} isPaused={isPaused} />

        {/* Trình điều khiển di chuyển nhân vật */}
        {!activePainting && <Player isPaused={isPaused} />}
        {!activePainting && (
          <PointerLockControls
            ref={controlsRef}
            onLock={() => setIsPaused(false)}
            onUnlock={() => setIsPaused(true)}
          />
        )}
      </Canvas>
    </div>
  );
}

export default App;
