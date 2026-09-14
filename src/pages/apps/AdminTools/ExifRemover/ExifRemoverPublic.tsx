/**
 * ExifRemoverPublic.tsx
 * Wrapper public — không cần login, layout đơn giản (không sidebar admin)
 * Có 2 tab: Xoá EXIF | Inject Metadata
 */
import React, { useState } from 'react';
import ExifRemover from './ExifRemover';
import ExifInjector from './ExifInjector';

type Tab = 'remove' | 'inject';

const ExifRemoverPublic: React.FC = () => {
  const [tab, setTab] = useState<Tab>('remove');

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      {/* Topbar */}
      <div style={{
        background: 'rgba(15,23,42,0.95)',
        borderBottom: '1px solid #1e293b',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(8px)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', marginRight: 32 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="mgc_image_line" style={{ fontSize: 15, color: '#fff' }} />
          </div>
          <span style={{
            fontWeight: 700, fontSize: 15,
            background: 'linear-gradient(90deg,#a78bfa,#818cf8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            EXIF Tool
          </span>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, height: '100%' }}>
          <button
            onClick={() => setTab('remove')}
            id="tab-remove"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '14px 20px', fontSize: 13, fontWeight: 600,
              color: tab === 'remove' ? '#a78bfa' : '#475569',
              borderBottom: tab === 'remove' ? '2px solid #7c3aed' : '2px solid transparent',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <i className="mgc_delete_2_line" style={{ fontSize: 14 }} />
            Xoá EXIF
          </button>
          <button
            onClick={() => setTab('inject')}
            id="tab-inject"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '14px 20px', fontSize: 13, fontWeight: 600,
              color: tab === 'inject' ? '#34d399' : '#475569',
              borderBottom: tab === 'inject' ? '2px solid #10b981' : '2px solid transparent',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <i className="mgc_camera_line" style={{ fontSize: 14 }} />
            Inject Metadata
          </button>
        </div>

        <div style={{ marginLeft: 'auto', fontSize: 12, color: '#334155' }}>
          Miễn phí · Không lưu ảnh
        </div>
      </div>

      {/* Content */}
      {tab === 'remove' ? <ExifRemover /> : <ExifInjector />}
    </div>
  );
};

export default ExifRemoverPublic;
