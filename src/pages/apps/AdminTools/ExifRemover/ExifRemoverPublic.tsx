/**
 * ExifRemoverPublic.tsx
 * Wrapper public — không cần login, layout đơn giản (không sidebar admin)
 */
import React from 'react';
import ExifRemover from './ExifRemover';

const ExifRemoverPublic: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      {/* Topbar nhỏ gọn */}
      <div style={{
        background: 'rgba(15,23,42,0.95)',
        borderBottom: '1px solid #1e293b',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <i className="mgc_image_line" style={{ fontSize: 16, color: '#fff' }} />
        </div>
        <span style={{
          fontWeight: 700,
          fontSize: 16,
          background: 'linear-gradient(90deg, #a78bfa, #818cf8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          EXIF Remover
        </span>
        <span style={{
          fontSize: 12,
          color: '#475569',
          marginLeft: 4,
        }}>
          — Xoá metadata ẩn khỏi ảnh, miễn phí
        </span>
      </div>

      {/* Main content */}
      <ExifRemover />
    </div>
  );
};

export default ExifRemoverPublic;
