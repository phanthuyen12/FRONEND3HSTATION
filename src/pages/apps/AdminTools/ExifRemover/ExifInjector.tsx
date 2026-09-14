/**
 * ExifInjector.tsx — UI inject metadata giả vào ảnh AI
 * Giả lập ảnh chụp từ iPhone 15, Samsung S24, Pixel 8...
 */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { exifService } from '../../../../config';
import type { ExifDevice, ExifInjectResult } from '../../../../services/exifService';

interface InjectFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  result?: ExifInjectResult;
  error?: string;
}

const DEVICES_FALLBACK: ExifDevice[] = [
  { key: 'iphone_15',     label: 'Apple iPhone 15' },
  { key: 'iphone_15_pro', label: 'Apple iPhone 15 Pro' },
  { key: 'samsung_s24',   label: 'Samsung Galaxy S24' },
  { key: 'pixel_8',       label: 'Google Pixel 8' },
];

const ExifInjector: React.FC = () => {
  const [file, setFile] = useState<InjectFile | null>(null);
  const [devices, setDevices] = useState<ExifDevice[]>(DEVICES_FALLBACK);
  const [selectedDevice, setSelectedDevice] = useState('iphone_15');
  const [useCustomDate, setUseCustomDate] = useState(false);
  const [customDate, setCustomDate] = useState('');
  const [addGps, setAddGps] = useState(false);
  const [lat, setLat] = useState('21.027764');
  const [lon, setLon] = useState('105.834160');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load devices
  useEffect(() => {
    exifService.getDevices().then(setDevices).catch(() => setDevices(DEVICES_FALLBACK));
  }, []);

  const handleFile = useCallback((f: File) => {
    if (file) URL.revokeObjectURL(file.preview);
    setFile({
      id: `${f.name}-${Date.now()}`,
      file: f,
      preview: URL.createObjectURL(f),
      status: 'pending',
    });
  }, [file]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) handleFile(f);
  }, [handleFile]);

  const handleInject = useCallback(async () => {
    if (!file) return;
    setFile((prev) => prev ? { ...prev, status: 'processing', result: undefined, error: undefined } : null);

    // Tạo datetime string từ input date nếu có
    let datetimeStr: string | undefined;
    if (useCustomDate && customDate) {
      const d = new Date(customDate);
      const pad = (n: number) => String(n).padStart(2, '0');
      datetimeStr = `${d.getFullYear()}:${pad(d.getMonth()+1)}:${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    try {
      const result = await exifService.injectMetadata(file.file, {
        device: selectedDevice,
        datetime: datetimeStr,
        addGps,
        lat: addGps ? lat : undefined,
        lon: addGps ? lon : undefined,
      });
      setFile((prev) => prev ? { ...prev, status: 'done', result } : null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi không xác định';
      setFile((prev) => prev ? { ...prev, status: 'error', error: msg } : null);
    }
  }, [file, selectedDevice, useCustomDate, customDate, addGps, lat, lon]);

  const handleDownload = useCallback(() => {
    if (!file?.result) return;
    const url = URL.createObjectURL(file.result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.result.injectedFilename;
    a.click();
    URL.revokeObjectURL(url);
  }, [file]);

  const selectedDeviceLabel = devices.find((d) => d.key === selectedDevice)?.label || selectedDevice;

  return (
    <div style={s.wrap}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerIcon}>
          <i className="mgc_camera_line" style={{ fontSize: 22, color: '#fff' }} />
        </div>
        <div>
          <h2 style={s.title}>Inject Metadata</h2>
          <p style={s.sub}>Giả lập ảnh chụp từ iPhone, Samsung, Pixel — thêm EXIF camera vào ảnh AI</p>
        </div>
      </div>

      <div style={s.layout}>
        {/* LEFT: Upload + Preview */}
        <div style={s.left}>
          {/* Drop zone */}
          <div
            style={{ ...s.dropZone, ...(isDragging ? s.dropDrag : {}) }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            id="inject-dropzone"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
            {file ? (
              <div style={{ position: 'relative' }}>
                <img
                  src={file.preview}
                  alt="preview"
                  style={s.previewImg}
                />
                <div style={s.previewOverlay}>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{file.file.name}</span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>
                    {(file.file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={s.dropIcon}>
                  <i className="mgc_upload_2_line" style={{ fontSize: 28, color: '#818cf8' }} />
                </div>
                <p style={s.dropText}>Kéo thả hoặc click để chọn ảnh</p>
                <p style={s.dropSub}>JPG, PNG, WebP, AVIF</p>
              </div>
            )}
          </div>

          {/* Status */}
          {file?.status === 'done' && file.result && (
            <div style={s.successBox}>
              <i className="mgc_check_circle_line" style={{ fontSize: 18, color: '#10b981' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#10b981', marginBottom: 2 }}>
                  Inject thành công!
                </div>
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  Device: <strong style={{ color: '#a78bfa' }}>{file.result.device}</strong>
                </div>
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  DateTime: <strong style={{ color: '#a78bfa' }}>{file.result.datetime}</strong>
                </div>
              </div>
              <button style={s.downloadBtn} onClick={handleDownload} id="btn-download-injected">
                <i className="mgc_download_2_line" /> Tải xuống
              </button>
            </div>
          )}
          {file?.status === 'error' && (
            <div style={s.errorBox}>
              <i className="mgc_close_circle_line" style={{ color: '#f87171' }} />
              <span style={{ fontSize: 13, color: '#f87171' }}>{file.error}</span>
            </div>
          )}
        </div>

        {/* RIGHT: Settings */}
        <div style={s.right}>
          {/* Device selector */}
          <div style={s.section}>
            <label style={s.label}>
              <i className="mgc_phone_line" style={{ marginRight: 6 }} />
              Thiết bị giả lập
            </label>
            <div style={s.deviceGrid}>
              {devices.map((d) => (
                <button
                  key={d.key}
                  style={{
                    ...s.deviceBtn,
                    ...(selectedDevice === d.key ? s.deviceBtnActive : {}),
                  }}
                  onClick={() => setSelectedDevice(d.key)}
                  id={`btn-device-${d.key}`}
                >
                  <i
                    className={d.key.startsWith('iphone') ? 'mgc_apple_line'
                      : d.key.startsWith('samsung') ? 'mgc_android_2_line'
                      : 'mgc_android_line'}
                    style={{ fontSize: 16 }}
                  />
                  <span style={{ fontSize: 11, marginTop: 4, textAlign: 'center', lineHeight: 1.3 }}>
                    {d.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Date/time */}
          <div style={s.section}>
            <label style={s.label}>
              <i className="mgc_time_line" style={{ marginRight: 6 }} />
              Thời gian chụp
            </label>
            <div style={s.toggleRow}>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>Ngẫu nhiên 30 ngày gần đây</span>
              <button
                style={{ ...s.toggle, background: useCustomDate ? '#4f46e5' : '#1e293b' }}
                onClick={() => setUseCustomDate(!useCustomDate)}
                id="btn-toggle-date"
              >
                <div style={{ ...s.toggleDot, transform: useCustomDate ? 'translateX(20px)' : 'translateX(0)' }} />
              </button>
              <span style={{ fontSize: 13, color: useCustomDate ? '#a78bfa' : '#475569' }}>Tuỳ chỉnh</span>
            </div>
            {useCustomDate && (
              <input
                type="datetime-local"
                style={s.input}
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                id="input-datetime"
              />
            )}
          </div>

          {/* GPS */}
          <div style={s.section}>
            <label style={s.label}>
              <i className="mgc_location_line" style={{ marginRight: 6 }} />
              GPS Location
            </label>
            <div style={s.toggleRow}>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>Không thêm GPS</span>
              <button
                style={{ ...s.toggle, background: addGps ? '#059669' : '#1e293b' }}
                onClick={() => setAddGps(!addGps)}
                id="btn-toggle-gps"
              >
                <div style={{ ...s.toggleDot, transform: addGps ? 'translateX(20px)' : 'translateX(0)' }} />
              </button>
              <span style={{ fontSize: 13, color: addGps ? '#10b981' : '#475569' }}>Thêm GPS</span>
            </div>
            {addGps && (
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Latitude</div>
                  <input style={s.input} value={lat} onChange={(e) => setLat(e.target.value)} placeholder="21.027764" id="input-lat" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Longitude</div>
                  <input style={s.input} value={lon} onChange={(e) => setLon(e.target.value)} placeholder="105.834160" id="input-lon" />
                </div>
              </div>
            )}
          </div>

          {/* Info box */}
          <div style={s.infoBox}>
            <i className="mgc_information_line" style={{ fontSize: 14, color: '#818cf8', flexShrink: 0 }} />
            <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
              Sẽ inject metadata của <strong style={{ color: '#a78bfa' }}>{selectedDeviceLabel}</strong> vào ảnh:
              Make, Model, LensModel, FocalLength, ISO, Aperture, DateTime{addGps ? ', GPS' : ''}.
              Output luôn là <strong style={{ color: '#a78bfa' }}>JPEG</strong>.
            </div>
          </div>

          {/* Action button */}
          <button
            style={{
              ...s.actionBtn,
              opacity: !file || file.status === 'processing' ? 0.5 : 1,
              cursor: !file || file.status === 'processing' ? 'not-allowed' : 'pointer',
            }}
            disabled={!file || file.status === 'processing'}
            onClick={handleInject}
            id="btn-inject"
          >
            {file?.status === 'processing' ? (
              <>
                <div style={s.spinner} />
                Đang inject metadata...
              </>
            ) : (
              <>
                <i className="mgc_magic_2_line" style={{ fontSize: 16 }} />
                Inject Metadata → {selectedDeviceLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  wrap: { padding: 24, color: '#e2e8f0', fontFamily: "'Inter','Segoe UI',sans-serif" },
  header: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 },
  headerIcon: {
    width: 52, height: 52, borderRadius: 14,
    background: 'linear-gradient(135deg, #059669, #10b981)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 0 20px rgba(16,185,129,0.35)', flexShrink: 0,
  },
  title: { margin: 0, fontSize: 22, fontWeight: 700, background: 'linear-gradient(90deg,#6ee7b7,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  sub: { margin: '4px 0 0', fontSize: 13, color: '#64748b' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  left: { display: 'flex', flexDirection: 'column', gap: 12 },
  right: { display: 'flex', flexDirection: 'column', gap: 16 },
  dropZone: {
    border: '2px dashed #334155', borderRadius: 14, cursor: 'pointer',
    background: '#1e293b', transition: 'all 0.3s', minHeight: 200,
    overflow: 'hidden',
  },
  dropDrag: { border: '2px dashed #10b981', background: 'rgba(16,185,129,0.05)', transform: 'scale(1.01)' },
  previewImg: { width: '100%', maxHeight: 280, objectFit: 'cover', display: 'block' },
  previewOverlay: {
    padding: '8px 12px', background: 'rgba(15,23,42,0.8)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  dropIcon: {
    width: 60, height: 60, borderRadius: '50%', background: 'rgba(99,102,241,0.1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
  },
  dropText: { fontSize: 15, fontWeight: 600, color: '#cbd5e1', margin: '0 0 4px', textAlign: 'center' },
  dropSub: { fontSize: 12, color: '#475569', margin: 0, textAlign: 'center' },
  successBox: {
    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
    background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)',
    borderRadius: 12,
  },
  errorBox: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
    background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
    borderRadius: 10,
  },
  downloadBtn: {
    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
    background: 'linear-gradient(135deg,#059669,#10b981)', color: '#fff',
    border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600,
    flexShrink: 0,
  },
  section: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center' },
  deviceGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  deviceBtn: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '12px 8px', borderRadius: 10,
    background: '#1e293b', border: '1px solid #334155',
    color: '#64748b', cursor: 'pointer', transition: 'all 0.2s', gap: 4,
  },
  deviceBtnActive: {
    background: 'rgba(99,102,241,0.15)', border: '1px solid #6366f1',
    color: '#a78bfa',
  },
  toggleRow: { display: 'flex', alignItems: 'center', gap: 10 },
  toggle: {
    width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
    position: 'relative', transition: 'background 0.3s', flexShrink: 0,
  },
  toggleDot: {
    position: 'absolute', top: 3, left: 3, width: 18, height: 18,
    borderRadius: '50%', background: '#fff', transition: 'transform 0.3s',
  },
  input: {
    width: '100%', background: '#1e293b', border: '1px solid #334155',
    borderRadius: 8, color: '#e2e8f0', padding: '8px 12px', fontSize: 13,
    boxSizing: 'border-box',
  },
  infoBox: {
    display: 'flex', gap: 8, padding: '10px 14px',
    background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)',
    borderRadius: 10,
  },
  actionBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '12px 0', borderRadius: 12, border: 'none',
    background: 'linear-gradient(135deg,#059669,#10b981)',
    color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
    transition: 'opacity 0.2s', marginTop: 'auto',
  },
  spinner: {
    width: 16, height: 16,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }
  @media (max-width: 768px) { .inject-layout { grid-template-columns: 1fr !important; } }`;
  if (!document.head.querySelector('#inject-styles')) {
    style.id = 'inject-styles';
    document.head.appendChild(style);
  }
}

export default ExifInjector;
