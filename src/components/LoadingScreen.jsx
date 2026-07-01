import React from 'react';

export function LoadingScreen() {
  return (
    <div style={styles.container}>
      {/* Background với blur */}
      <div style={styles.backdrop}></div>

      {/* Nội dung chính */}
      <div style={styles.content}>
        {/* Logo ngôi sao đỏ */}
        <div style={styles.starBadge}>
          <span style={styles.starIcon}>★</span>
        </div>

        {/* Tiêu đề */}
        <h1 style={styles.title}>BẢO TÀNG 3D</h1>
        <p style={styles.subtitle}>Đang tải tài nguyên...</p>

        {/* Thanh loading */}
        <div style={styles.progressContainer}>
          <div style={styles.progressTrack}>
            <div style={styles.progressBar}></div>
          </div>
        </div>

        {/* Loading dots animation */}
        <div style={styles.dotsContainer}>
          <span style={styles.dot}></span>
          <span style={styles.dot}></span>
          <span style={styles.dot}></span>
        </div>

        {/* Mẹo nhỏ */}
        <p style={styles.tip}>
          VNR202 • Chương 2: Đảng lãnh đạo hai cuộc kháng chiến
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Georgia, "Times New Roman", serif',
    color: '#fff',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(10, 8, 5, 0.95)',
    backdropFilter: 'blur(8px)',
  },
  content: {
    position: 'relative',
    textAlign: 'center',
    padding: '40px 60px',
    backgroundColor: 'rgba(20, 15, 10, 0.9)',
    borderRadius: '20px',
    border: '2px solid #8b6914',
    boxShadow: '0 0 60px rgba(139, 105, 20, 0.3)',
  },
  starBadge: {
    width: '80px',
    height: '80px',
    backgroundColor: '#8b0000',
    borderRadius: '50%',
    margin: '0 auto 24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 0 30px rgba(255, 215, 0, 0.4)',
    border: '3px solid #ffd700',
    animation: 'pulse 2s infinite',
  },
  starIcon: {
    color: '#ffd700',
    fontSize: '40px',
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#ffd700',
    margin: '0 0 8px',
    letterSpacing: '4px',
    textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
  },
  subtitle: {
    fontSize: '14px',
    color: '#c9a962',
    margin: '0 0 30px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    letterSpacing: '2px',
  },
  progressContainer: {
    width: '280px',
    margin: '0 auto 20px',
  },
  progressTrack: {
    width: '100%',
    height: '6px',
    backgroundColor: 'rgba(139, 105, 20, 0.3)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressBar: {
    width: '30%',
    height: '100%',
    backgroundColor: 'linear-gradient(90deg, #ffd700, #e8c97a)',
    borderRadius: '3px',
    animation: 'loading 1.5s ease-in-out infinite',
  },
  dotsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '24px',
  },
  dot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#ffd700',
    borderRadius: '50%',
    animation: 'bounce 1.4s infinite ease-in-out both',
  },
  tip: {
    fontSize: '11px',
    color: '#a89070',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    letterSpacing: '1px',
    margin: 0,
    paddingTop: '16px',
    borderTop: '1px solid rgba(139, 105, 20, 0.3)',
  },
};
