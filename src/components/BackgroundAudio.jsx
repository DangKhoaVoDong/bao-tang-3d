import React, { useEffect, useRef, useState } from 'react';

export function BackgroundAudio({ url, isPaused }) {
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);

  // Theo dõi trạng thái Pause Menu để tự động dừng/phát nhạc
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPaused) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.log("Chờ người dùng tương tác để phát nhạc:", err);
      });
    }
  }, [isPaused]);

  // Xử lý chỉnh sửa tăng giảm âm lượng
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return '🔇';
    if (volume < 0.5) return '🔉';
    return '🔊';
  };

  return (
    <>
      {/* Thẻ audio ẩn chứa nhạc nền */}
      <audio ref={audioRef} src={url} loop />

      {/* Thanh điều khiển âm thanh - góc trên phải */}
      <div style={styles.audioController}>
        {/* Icon volume */}
        <button
          style={styles.muteButton}
          onClick={() => setIsMuted(!isMuted)}
        >
          {getVolumeIcon()}
        </button>

        {/* Slider với gradient fill */}
        <div style={styles.sliderWrapper}>
          <div style={styles.sliderTrack}>
            <div style={{
              ...styles.sliderFill,
              width: isMuted ? '0%' : `${volume * 100}%`
            }} />
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={isMuted ? 0 : Math.round(volume * 100)}
            onChange={(e) => {
              const newVolume = parseInt(e.target.value) / 100;
              setVolume(newVolume);
              if (isMuted && newVolume > 0) setIsMuted(false);
            }}
            style={styles.slider}
          />
        </div>

        {/* % hiển thị */}
        <span style={styles.volumeText}>
          {isMuted ? 0 : Math.round(volume * 100)}%
        </span>
      </div>
    </>
  );
}

const styles = {
  audioController: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    padding: '10px 16px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#fff',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
  muteButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '8px 10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  sliderWrapper: {
    position: 'relative',
    width: '100px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
  },
  sliderTrack: {
    position: 'absolute',
    width: '100%',
    height: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '3px',
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  sliderFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
    borderRadius: '3px',
    transition: 'width 0.1s ease',
  },
  slider: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    WebkitAppearance: 'none',
    appearance: 'none',
    background: 'transparent',
    outline: 'none',
    cursor: 'pointer',
    margin: 0,
  },
  volumeText: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    minWidth: '40px',
    textAlign: 'right',
  },
};
