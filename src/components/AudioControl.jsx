import React, { useState, useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

// AudioEngine bên trong Canvas
export function AudioEngine({ url }) {
  const { camera } = useThree();

  useEffect(() => {
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.Audio(listener);
    sound.setLoop(true);
    sound.setVolume(0.3);

    window.__museumAudio = sound;

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(url, (buffer) => {
      sound.setBuffer(buffer);
      window.__museumAudioReady = true;
    });

    return () => {
      sound.stop();
      window.__museumAudio = null;
      window.__museumAudioReady = false;
      camera.remove(listener);
    };
  }, [camera, url]);

  return null;
}

// AudioControlUI bên NGOÀI Canvas
export function AudioControlUI() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.3);
  const [isVisible, setIsVisible] = useState(false);

  // Bắt đầu phát nhạc khi user click lần đầu (do policy autoplay)
  useEffect(() => {
    const startOnFirstClick = () => {
      const sound = window.__museumAudio;
      if (sound && window.__museumAudioReady && !sound.isPlaying) {
        sound.play();
        setIsPlaying(true);
      }
    };
    window.addEventListener('click', startOnFirstClick);
    return () => window.removeEventListener('click', startOnFirstClick);
  }, []);

  // Tắt nhạc
  const pauseAudio = () => {
    const sound = window.__museumAudio;
    if (!sound) return;
    sound.pause();
    setIsPlaying(false);
  };

  // Bật nhạc
  const playAudio = () => {
    const sound = window.__museumAudio;
    if (!sound || !window.__museumAudioReady) return;
    sound.play();
    setIsPlaying(true);
  };

  // Tắt hẳn (mute volume = 0, nhưng vẫn đang chạy)
  const muteAudio = () => {
    const sound = window.__museumAudio;
    if (!sound) return;
    sound.volume = 0;
    setVolume(0);
    setIsPlaying(false);
  };

  // Bật lại (unmute)
  const unmuteAudio = () => {
    const sound = window.__museumAudio;
    if (!sound || !window.__museumAudioReady) return;
    const restoreVol = volume > 0 ? volume : 0.3;
    sound.volume = restoreVol;
    setVolume(restoreVol);
    if (!sound.isPlaying) sound.play();
    setIsPlaying(true);
  };

  // Chỉnh âm lượng - dùng onInput để phản hồi liên tục
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    const sound = window.__museumAudio;
    if (sound) {
      sound.volume = newVolume;
      // Nếu volume > 0 thì auto play
      if (newVolume > 0 && !sound.isPlaying && window.__museumAudioReady) {
        sound.play();
        setIsPlaying(true);
      }
    }
  };

  // Icon hiện tại dựa trên trạng thái
  const getIcon = () => {
    if (volume === 0) return '🔇';
    if (volume < 0.5) return '🔉';
    return '🔊';
  };

  // Inline styles riêng cho slider
  const sliderStyle = {
    WebkitAppearance: 'none',
    appearance: 'none',
    width: '110px',
    height: '6px',
    borderRadius: '3px',
    background: `linear-gradient(to right, #bd9a5f 0%, #bd9a5f ${volume * 100}%, rgba(255,255,255,0.25) ${volume * 100}%, rgba(255,255,255,0.25) 100%)`,
    outline: 'none',
    cursor: 'pointer',
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          padding: '10px 14px',
          borderRadius: '999px',
          border: '1px solid rgba(189, 154, 95, 0.5)',
          color: 'white',
          cursor: 'pointer',
          zIndex: 90,
          backdropFilter: 'blur(10px)',
          fontSize: '18px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        }}
        title="Mở điều khiển âm thanh"
      >
        {getIcon()}
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        padding: '12px 18px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        zIndex: 90,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(189, 154, 95, 0.4)',
        fontFamily: 'sans-serif',
        color: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      }}
    >
      {/* Nút bật/tắt */}
      <button
        onClick={isPlaying ? muteAudio : unmuteAudio}
        style={{
          backgroundColor: isPlaying ? 'rgba(189, 154, 95, 0.2)' : 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(189, 154, 95, 0.5)',
          borderRadius: '8px',
          cursor: 'pointer',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'white',
        }}
        title={isPlaying ? 'Tắt âm thanh' : 'Bật âm thanh'}
      >
        <span style={{ fontSize: '20px' }}>{getIcon()}</span>
        <span style={{ fontSize: '13px', fontWeight: 500 }}>
          {isPlaying ? 'Tắt' : 'Bật'}
        </span>
      </button>

      <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

      {/* Thanh âm lượng */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '16px' }}>🔉</span>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={volume * 100}
          onChange={handleVolumeChange}
          style={sliderStyle}
        />
        <span style={{ fontSize: '13px', minWidth: '40px', color: '#bd9a5f', fontWeight: 500 }}>
          {Math.round(volume * 100)}%
        </span>
      </div>

      <button
        onClick={() => setIsVisible(false)}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: 'rgba(255,255,255,0.5)',
          cursor: 'pointer',
          fontSize: '16px',
          padding: '4px 8px',
        }}
        title="Ẩn điều khiển"
      >
        ✕
      </button>
    </div>
  );
}
