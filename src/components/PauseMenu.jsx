import React from 'react';

export function PauseMenu({ isPaused, onResume }) {
  if (!isPaused) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.menuContainer}>
        {/* Logo ngôi sao đỏ */}
        <div style={styles.starBadge}>★</div>

        {/* Tiêu đề phụ */}
        <p style={styles.subTitle}>MÔN HỌC VNR202 • BẢO TÀNG 3D</p>

        {/* Đường phân cách */}
        <div style={styles.divider}></div>

        {/* Số chương nhỏ */}
        <p style={styles.chapterLabel}>CHƯƠNG 2</p>

        {/* Tiêu đề chính - chia dòng hợp lý */}
        <h1 style={styles.mainTitle}>
          Đảng lãnh đạo hai cuộc<br />
          kháng chiến, hoàn thành<br />
          giải phóng dân tộc,<br />
          thống nhất đất nước
          <span style={styles.yearRange}> (1945 - 1975)</span>
        </h1>

        {/* Mô tả ngắn */}
        <p style={styles.hintText}>
          Nhấn để quay lại không gian trưng bày
        </p>

        {/* Nút Tiếp tục */}
        <button style={styles.button} onClick={onResume}>
          <span style={styles.buttonText}>▶ TIẾP TỤC THAM QUAN</span>
        </button>

        {/* Hướng dẫn phím tắt */}
        <div style={styles.controlsInfo}>
          <div style={styles.controlRow}>
            <span>Di chuyển</span>
            <span>
              <span style={styles.key}>W</span>
              <span style={styles.key}>A</span>
              <span style={styles.key}>S</span>
              <span style={styles.key}>D</span>
            </span>
          </div>
          <div style={styles.controlRow}>
            <span>Nhìn quanh</span>
            <span><span style={styles.key}>Chuột</span></span>
          </div>
          <div style={styles.controlRow}>
            <span>Tương tác / Thoát</span>
            <span>
              <span style={styles.key}>E</span>
              <span style={styles.keySep}>•</span>
              <span style={styles.key}>Esc</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    fontFamily: 'Georgia, "Times New Roman", serif',
    color: '#fff',
    textAlign: 'center',
  },
  menuContainer: {
    backgroundColor: 'rgba(20, 15, 10, 0.95)',
    padding: '50px 60px',
    borderRadius: '16px',
    border: '2px solid #8b6914',
    boxShadow: '0 0 40px rgba(139, 105, 20, 0.3)',
    maxWidth: '620px',
    width: '90%',
  },
  starBadge: {
    width: '54px',
    height: '54px',
    backgroundColor: '#8b0000',
    borderRadius: '50%',
    margin: '0 auto 18px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#ffd700',
    fontSize: '28px',
    boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
    border: '2px solid #ffd700',
  },
  subTitle: {
    fontSize: '11px',
    color: '#c9a962',
    letterSpacing: '4px',
    margin: '0 0 18px',
    fontWeight: '600',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  divider: {
    width: '60px',
    height: '1px',
    backgroundColor: '#8b6914',
    margin: '0 auto 18px',
  },
  chapterLabel: {
    fontSize: '13px',
    color: '#c9a962',
    letterSpacing: '3px',
    margin: '0 0 10px',
    fontWeight: '700',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  mainTitle: {
    fontSize: '28px',
    lineHeight: '1.5',
    margin: '0 0 20px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    color: '#ffd700',
    textShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
    fontStyle: 'italic',
  },
  yearRange: {
    fontSize: '20px',
    color: '#e8c97a',
    fontStyle: 'normal',
    fontWeight: '500',
  },
  hintText: {
    fontSize: '13px',
    color: '#a89070',
    margin: '0 0 24px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: 'transparent',
    color: '#ffd700',
    border: '2px solid #ffd700',
    padding: '12px 36px',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
    marginBottom: '28px',
  },
  buttonText: {
    fontSize: '14px',
    fontWeight: '700',
    letterSpacing: '2px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  controlsInfo: {
    paddingTop: '20px',
    borderTop: '1px solid rgba(139, 105, 20, 0.4)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  controlRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '11px',
    color: '#a89070',
    letterSpacing: '1px',
  },
  key: {
    border: '1px solid #8b6914',
    padding: '2px 8px',
    borderRadius: '3px',
    backgroundColor: 'rgba(139, 105, 20, 0.2)',
    color: '#c9a962',
    margin: '0 2px',
    fontWeight: '600',
    fontSize: '11px',
    fontFamily: 'system-ui, monospace',
  },
  keySep: {
    color: '#8b6914',
    margin: '0 4px',
  },
};