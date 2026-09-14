import React, { useState, useCallback, useRef, useEffect } from 'react';
import { exifService } from '../../../../config';
import type { ExifRemoveResult } from '../../../../services/exifService';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FileItem {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  result?: ExifRemoveResult;
  error?: string;
  countdown?: number;  // giây đếm ngược trước khi tự xoá
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// ─── Component ────────────────────────────────────────────────────────────────

const ExifRemover: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [isBatchLoading, setIsBatchLoading] = useState(false);
  const [batchResult, setBatchResult] = useState<{ successCount: number; failCount: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Map fileId -> intervalId cho countdown timer
  const countdownTimers = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  // Cleanup tất cả timers khi unmount
  useEffect(() => {
    return () => {
      countdownTimers.current.forEach((timer) => clearInterval(timer));
    };
  }, []);

  // ── Drag & Drop handlers ───────────────────────────────────────────────────

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const addFiles = useCallback((newFiles: File[]) => {
    const imageFiles = newFiles.filter((f) => f.type.startsWith('image/'));
    const items: FileItem[] = imageFiles.map((f) => ({
      id: generateId(),
      file: f,
      preview: URL.createObjectURL(f),
      status: 'pending',
    }));
    setFiles((prev) => [...prev, ...items]);
    setBatchResult(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = Array.from(e.dataTransfer.files);
      addFiles(dropped);
    },
    [addFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        addFiles(Array.from(e.target.files));
      }
    },
    [addFiles]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const item = prev.find((f) => f.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  // ── Auto-clear countdown sau khi download ─────────────────────────────────

  const startCountdown = useCallback((id: string, seconds = 20) => {
    // Nếu đã có timer cũ thì clear
    const existing = countdownTimers.current.get(id);
    if (existing) clearInterval(existing);

    // Set countdown ban đầu
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, countdown: seconds } : f))
    );

    const timer = setInterval(() => {
      setFiles((prev) => {
        const item = prev.find((f) => f.id === id);
        if (!item || item.countdown === undefined) {
          clearInterval(timer);
          return prev;
        }
        const next = item.countdown - 1;
        if (next <= 0) {
          clearInterval(timer);
          countdownTimers.current.delete(id);
          // Revoke blob URL để giải phóng bộ nhớ
          if (item.result?.blob) {
            URL.revokeObjectURL(URL.createObjectURL(item.result.blob));
          }
          // Xoá kết quả — reset về pending để upload lại nếu muốn
          return prev.map((f) =>
            f.id === id
              ? { ...f, status: 'pending', result: undefined, countdown: undefined }
              : f
          );
        }
        return prev.map((f) => (f.id === id ? { ...f, countdown: next } : f));
      });
    }, 1000);

    countdownTimers.current.set(id, timer);
  }, []);

  // ── Single file remove ─────────────────────────────────────────────────────

  const handleRemoveSingle = useCallback(async (id: string) => {
    const item = files.find((f) => f.id === id);
    if (!item) return;

    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'processing' } : f))
    );

    try {
      const result = await exifService.removeExif(item.file);
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: 'done', result } : f))
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Lỗi không xác định';
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: 'error', error: message } : f))
      );
    }
  }, [files]);

  // ── Batch remove (multi-thread) ────────────────────────────────────────────

  const handleRemoveBatch = useCallback(async () => {
    const pending = files.filter((f) => f.status === 'pending');
    if (pending.length === 0) return;
    if (pending.length > 20) {
      alert('Tối đa 20 ảnh mỗi lần batch!');
      return;
    }

    setIsBatchLoading(true);
    setBatchProgress(0);
    setBatchResult(null);

    // Mark all pending as processing
    setFiles((prev) =>
      prev.map((f) => (f.status === 'pending' ? { ...f, status: 'processing' } : f))
    );

    try {
      const batchFiles = pending.map((p) => p.file);
      const result = await exifService.removeExifBatch(batchFiles, (pct) => {
        setBatchProgress(pct);
      });

      // Download ZIP
      const url = URL.createObjectURL(result.zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `exif_cleaned_${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      // Mark all as done + bắt đầu countdown 20s cho từng file
      setFiles((prev) =>
        prev.map((f) => (f.status === 'processing' ? { ...f, status: 'done' } : f))
      );
      setBatchResult({ successCount: result.successCount, failCount: result.failCount });

      // Bắt đầu countdown tự xoá 20s cho từng file đã xử lý
      pending.forEach((p) => startCountdown(p.id, 20));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Lỗi không xác định';
      setFiles((prev) =>
        prev.map((f) =>
          f.status === 'processing' ? { ...f, status: 'error', error: message } : f
        )
      );
    } finally {
      setIsBatchLoading(false);
      setBatchProgress(0);
    }
  }, [files, startCountdown]);

  // ── Download single result + bắt đầu countdown xoá ───────────────────────

  const handleDownload = useCallback((item: FileItem) => {
    if (!item.result) return;
    const url = URL.createObjectURL(item.result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.result.cleanFilename;
    a.click();
    URL.revokeObjectURL(url);
    // Bắt đầu đếm ngược 20 giây tự xoá
    startCountdown(item.id, 20);
  }, [startCountdown]);

  const clearAll = useCallback(() => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setBatchResult(null);
  }, [files]);

  const pendingCount = files.filter((f) => f.status === 'pending').length;
  const doneCount = files.filter((f) => f.status === 'done').length;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerIcon}>
          <i className="mgc_image_line" style={{ fontSize: 28, color: '#a78bfa' }} />
        </div>
        <div>
          <h1 style={styles.title}>EXIF Metadata Remover</h1>
          <p style={styles.subtitle}>
            Xoá metadata ẩn khỏi ảnh — đa luồng Worker Threads, xử lý hàng loạt
          </p>
        </div>
      </div>

      {/* Stats bar */}
      {files.length > 0 && (
        <div style={styles.statsBar}>
          <span style={styles.statItem}>
            <span style={{ ...styles.statDot, background: '#6366f1' }} />
            Tổng: {files.length} ảnh
          </span>
          <span style={styles.statItem}>
            <span style={{ ...styles.statDot, background: '#f59e0b' }} />
            Chờ xử lý: {pendingCount}
          </span>
          <span style={styles.statItem}>
            <span style={{ ...styles.statDot, background: '#10b981' }} />
            Hoàn thành: {doneCount}
          </span>
          <button style={styles.clearBtn} onClick={clearAll} id="btn-clear-all">
            <i className="mgc_delete_line" /> Xoá tất cả
          </button>
        </div>
      )}

      {/* Batch result banner */}
      {batchResult && (
        <div style={styles.batchBanner}>
          <i className="mgc_check_circle_line" style={{ color: '#10b981', fontSize: 20 }} />
          <span>
            Batch hoàn thành: <strong>{batchResult.successCount}</strong> thành công
            {batchResult.failCount > 0 && (
              <>, <strong style={{ color: '#f87171' }}>{batchResult.failCount}</strong> lỗi</>
            )}
            &nbsp;— File ZIP đã được tải xuống.
          </span>
        </div>
      )}

      {/* Drop zone */}
      <div
        style={{ ...styles.dropZone, ...(isDragging ? styles.dropZoneDrag : {}) }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        id="exif-dropzone"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileInput}
          id="exif-file-input"
        />
        <div style={styles.dropIcon}>
          <i className="mgc_upload_3_line" style={{ fontSize: 40, color: '#818cf8' }} />
        </div>
        <p style={styles.dropText}>
          {isDragging ? 'Thả ảnh vào đây...' : 'Kéo & thả ảnh vào đây'}
        </p>
        <p style={styles.dropSubText}>Hoặc click để chọn file • JPG, PNG, WEBP, TIFF, AVIF • Tối đa 20MB/ảnh</p>
      </div>

      {/* Action buttons */}
      {files.length > 0 && (
        <div style={styles.actionBar}>
          <button
            style={{ ...styles.primaryBtn, ...(pendingCount === 0 || isBatchLoading ? styles.btnDisabled : {}) }}
            onClick={handleRemoveBatch}
            disabled={pendingCount === 0 || isBatchLoading}
            id="btn-batch-remove"
          >
            {isBatchLoading ? (
              <>
                <span style={styles.spinner} />
                Đang xử lý đa luồng... {batchProgress}%
              </>
            ) : (
              <>
                <i className="mgc_run_line" />
                Xoá EXIF tất cả ({pendingCount} ảnh) + Tải ZIP
              </>
            )}
          </button>

          {/* Progress bar for batch */}
          {isBatchLoading && (
            <div style={styles.progressWrapper}>
              <div style={styles.progressTrack}>
                <div
                  style={{ ...styles.progressFill, width: `${batchProgress}%` }}
                />
              </div>
              <span style={styles.progressLabel}>{batchProgress}%</span>
            </div>
          )}
        </div>
      )}

      {/* File grid */}
      {files.length > 0 && (
        <div style={styles.grid}>
          {files.map((item) => (
            <FileCard
              key={item.id}
              item={item}
              onRemoveSingle={handleRemoveSingle}
              onDownload={handleDownload}
              onDelete={removeFile}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {files.length === 0 && (
        <div style={styles.emptyState}>
          <i className="mgc_image_2_line" style={{ fontSize: 64, color: '#374151' }} />
          <p style={styles.emptyText}>Chưa có ảnh nào được chọn</p>
          <p style={styles.emptySubText}>
            Upload ảnh để bắt đầu xoá EXIF metadata
          </p>
        </div>
      )}
    </div>
  );
};

// ─── FileCard ────────────────────────────────────────────────────────────────

interface FileCardProps {
  item: FileItem;
  onRemoveSingle: (id: string) => void;
  onDownload: (item: FileItem) => void;
  onDelete: (id: string) => void;
}

const FileCard: React.FC<FileCardProps> = ({ item, onRemoveSingle, onDownload, onDelete }) => {
  const statusConfig = {
    pending: { color: '#6366f1', label: 'Chờ xử lý', icon: 'mgc_time_line' },
    processing: { color: '#f59e0b', label: 'Đang xử lý...', icon: 'mgc_loading_3_line' },
    done: { color: '#10b981', label: 'Hoàn thành', icon: 'mgc_check_circle_line' },
    error: { color: '#ef4444', label: 'Lỗi', icon: 'mgc_close_circle_line' },
  };
  const cfg = statusConfig[item.status];

  return (
    <div style={styles.card}>
      {/* Preview */}
      <div style={styles.cardPreview}>
        <img src={item.preview} alt={item.file.name} style={styles.cardImg} />
        {item.status === 'processing' && (
          <div style={styles.cardOverlay}>
            <span style={{ ...styles.spinner, width: 32, height: 32 }} />
          </div>
        )}
        {item.status === 'done' && (
          <div style={{ ...styles.cardOverlay, background: 'rgba(16,185,129,0.25)' }}>
            <i className="mgc_check_circle_line" style={{ fontSize: 36, color: '#10b981' }} />
          </div>
        )}
        {/* Delete button */}
        <button
          style={styles.deleteBtn}
          onClick={() => onDelete(item.id)}
          title="Xoá khỏi danh sách"
          id={`btn-delete-${item.id}`}
        >
          <i className="mgc_close_line" />
        </button>
      </div>

      {/* Info */}
      <div style={styles.cardInfo}>
        <p style={styles.cardName} title={item.file.name}>
          {item.file.name.length > 20 ? `${item.file.name.slice(0, 17)}...` : item.file.name}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <span style={{ ...styles.statusBadge, background: `${cfg.color}22`, color: cfg.color }}>
            <i className={cfg.icon} style={{ fontSize: 12 }} />
            {cfg.label}
          </span>
        </div>
        <div style={styles.cardSizes}>
          <span style={styles.sizeLabel}>Gốc: {formatBytes(item.file.size)}</span>
          {item.result && (
            <span style={{ ...styles.sizeLabel, color: '#10b981' }}>
              Sạch: {formatBytes(item.result.cleanSize)}
            </span>
          )}
        </div>
        {item.error && (
          <p style={styles.errorText}>{item.error}</p>
        )}
        {/* Countdown badge */}
        {item.countdown !== undefined && (
          <div style={styles.countdownBadge}>
            <i className="mgc_time_line" style={{ fontSize: 11 }} />
            Tự xoá sau: <strong style={{ color: item.countdown <= 5 ? '#f87171' : '#fbbf24' }}>{item.countdown}s</strong>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={styles.cardActions}>
        {item.status === 'pending' && (
          <button
            style={styles.actionBtn}
            onClick={() => onRemoveSingle(item.id)}
            id={`btn-remove-${item.id}`}
          >
            <i className="mgc_magic_2_line" /> Xoá EXIF
          </button>
        )}
        {item.status === 'done' && (
          <button
            style={{ ...styles.actionBtn, background: 'linear-gradient(135deg, #059669, #10b981)' }}
            onClick={() => onDownload(item)}
            id={`btn-download-${item.id}`}
          >
            <i className="mgc_download_2_line" /> Tải xuống
          </button>
        )}
        {/* Countdown progress bar */}
        {item.countdown !== undefined && (
          <div style={styles.countdownBar}>
            <div
              style={{
                ...styles.countdownFill,
                width: `${(item.countdown / 20) * 100}%`,
                background: item.countdown <= 5
                  ? 'linear-gradient(90deg, #ef4444, #f87171)'
                  : 'linear-gradient(90deg, #f59e0b, #fbbf24)',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: '24px',
    minHeight: '100vh',
    background: '#0f172a',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    color: '#e2e8f0',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 20px rgba(139,92,246,0.4)',
    flexShrink: 0,
  },
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    background: 'linear-gradient(90deg, #a78bfa, #818cf8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    margin: '4px 0 0',
    fontSize: 14,
    color: '#94a3b8',
  },
  statsBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    background: '#1e293b',
    borderRadius: 12,
    padding: '10px 16px',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    color: '#cbd5e1',
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    display: 'inline-block',
  },
  clearBtn: {
    marginLeft: 'auto',
    background: 'transparent',
    border: '1px solid #334155',
    color: '#94a3b8',
    borderRadius: 8,
    padding: '4px 12px',
    cursor: 'pointer',
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  batchBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: 'rgba(16,185,129,0.1)',
    border: '1px solid rgba(16,185,129,0.3)',
    borderRadius: 10,
    padding: '10px 16px',
    marginBottom: 16,
    fontSize: 14,
  },
  dropZone: {
    border: '2px dashed #334155',
    borderRadius: 16,
    padding: '48px 24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: '#1e293b',
    marginBottom: 20,
  },
  dropZoneDrag: {
    border: '2px dashed #818cf8',
    background: 'rgba(99,102,241,0.08)',
    transform: 'scale(1.01)',
  },
  dropIcon: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    background: 'rgba(99,102,241,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  dropText: {
    fontSize: 18,
    fontWeight: 600,
    color: '#e2e8f0',
    margin: '0 0 8px',
  },
  dropSubText: {
    fontSize: 13,
    color: '#64748b',
    margin: 0,
  },
  actionBar: {
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  primaryBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '14px 28px',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
    transition: 'all 0.2s',
    width: '100%',
  },
  btnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  progressWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    background: '#1e293b',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #4f46e5, #a78bfa)',
    borderRadius: 4,
    transition: 'width 0.3s ease',
  },
  progressLabel: {
    fontSize: 13,
    color: '#a78bfa',
    fontWeight: 600,
    minWidth: 36,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 16,
  },
  card: {
    background: '#1e293b',
    borderRadius: 14,
    overflow: 'hidden',
    border: '1px solid #2d3748',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardPreview: {
    position: 'relative',
    width: '100%',
    paddingTop: '75%',
    overflow: 'hidden',
    background: '#0f172a',
  },
  cardImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: '50%',
    background: 'rgba(15,23,42,0.85)',
    border: '1px solid #334155',
    color: '#94a3b8',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    zIndex: 2,
  },
  cardInfo: {
    padding: '10px 12px 4px',
  },
  cardName: {
    margin: '0 0 6px',
    fontSize: 12,
    fontWeight: 500,
    color: '#e2e8f0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '2px 8px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 500,
  },
  cardSizes: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  sizeLabel: {
    fontSize: 11,
    color: '#64748b',
  },
  errorText: {
    fontSize: 11,
    color: '#f87171',
    margin: '4px 0 0',
  },
  cardActions: {
    padding: '8px 12px 12px',
  },
  actionBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 0',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 24px',
    color: '#475569',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 600,
    margin: '16px 0 8px',
    color: '#475569',
  },
  emptySubText: {
    fontSize: 14,
    color: '#334155',
    margin: 0,
  },
  spinner: {
    width: 16,
    height: 16,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    display: 'inline-block',
  },
  countdownBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
    padding: '2px 6px',
    background: 'rgba(245,158,11,0.1)',
    borderRadius: 6,
    border: '1px solid rgba(245,158,11,0.2)',
  },
  countdownBar: {
    marginTop: 6,
    height: 3,
    background: '#0f172a',
    borderRadius: 2,
    overflow: 'hidden',
  },
  countdownFill: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 0.9s linear',
  },
};

// Inject keyframes for spinner
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin { to { transform: rotate(360deg); } }
  `;
  document.head.appendChild(style);
}

export default ExifRemover;
