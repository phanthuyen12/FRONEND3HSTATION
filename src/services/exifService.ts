/**
 * exifService.ts — Service xoá/inject EXIF metadata
 */

export interface ExifRemoveResult {
  filename: string;
  cleanFilename: string;
  originalSize: number;
  cleanSize: number;
  blob: Blob;
}

export interface ExifBatchResult {
  zipBlob: Blob;
  successCount: number;
  failCount: number;
}

export interface ExifServiceInfo {
  service: string;
  maxConcurrency: number;
  cpuCount: number;
  supportedFormats: string[];
  maxBatchSize: number;
}

export interface ExifDevice {
  key: string;
  label: string;
}

export interface ExifInjectResult {
  filename: string;
  injectedFilename: string;
  originalSize: number;
  injectedSize: number;
  device: string;
  datetime: string;
  blob: Blob;
}

class ExifService {
  private api: string;

  constructor(apiUrl: string = '') {
    this.api = apiUrl;
  }

  async getInfo(): Promise<ExifServiceInfo> {
    const res = await fetch(`${this.api}/api/tools/exif/info`);
    const body = await res.json();
    if (!res.ok) throw new Error(body?.message || 'Lỗi khi lấy thông tin service');
    return body.data as ExifServiceInfo;
  }

  async getDevices(): Promise<ExifDevice[]> {
    const res = await fetch(`${this.api}/api/tools/exif/devices`);
    const body = await res.json();
    if (!res.ok) throw new Error(body?.message || 'Lỗi khi lấy danh sách thiết bị');
    return body.data as ExifDevice[];
  }

  async removeExif(file: File): Promise<ExifRemoveResult> {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${this.api}/api/tools/exif/remove`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.message || 'Xoá EXIF thất bại');
    }

    const blob = await res.blob();
    const originalSize = parseInt(res.headers.get('X-Original-Size') || '0', 10);
    const cleanSize = parseInt(res.headers.get('X-Clean-Size') || '0', 10);
    const cleanFilename = getSuffixFilename(file.name, '_clean');

    return { filename: file.name, cleanFilename, originalSize, cleanSize, blob };
  }

  async removeExifBatch(
    files: File[],
    onProgress?: (percent: number) => void
  ): Promise<ExifBatchResult> {
    const formData = new FormData();
    files.forEach((f) => formData.append('images', f));

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 80));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          if (onProgress) onProgress(100);
          const zipBlob = xhr.response as Blob;
          const successCount = parseInt(xhr.getResponseHeader('X-Success-Count') || '0', 10);
          const failCount = parseInt(xhr.getResponseHeader('X-Fail-Count') || '0', 10);
          resolve({ zipBlob, successCount, failCount });
        } else {
          reject(new Error(`Lỗi server: ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Lỗi kết nối tới server'));
      xhr.open('POST', `${this.api}/api/tools/exif/remove-batch`);
      xhr.responseType = 'blob';
      xhr.send(formData);
    });
  }

  /**
   * Inject metadata giả vào ảnh (giả lập thiết bị chụp)
   */
  async injectMetadata(
    file: File,
    options: {
      device: string;
      datetime?: string;
      addGps?: boolean;
      lat?: string;
      lon?: string;
    }
  ): Promise<ExifInjectResult> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('device', options.device);
    if (options.datetime) formData.append('datetime', options.datetime);
    if (options.addGps) {
      formData.append('addGps', 'true');
      if (options.lat) formData.append('lat', options.lat);
      if (options.lon) formData.append('lon', options.lon);
    }

    const res = await fetch(`${this.api}/api/tools/exif/inject`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.message || 'Inject metadata thất bại');
    }

    const blob = await res.blob();
    const originalSize = parseInt(res.headers.get('X-Original-Size') || String(file.size), 10);
    const injectedSize = parseInt(res.headers.get('Content-Length') || '0', 10);
    const device = res.headers.get('X-Device') || options.device;
    const datetime = res.headers.get('X-DateTime') || '';
    const injectedFilename = getSuffixFilename(file.name, '_injected', '.jpg');

    return { filename: file.name, injectedFilename, originalSize, injectedSize, device, datetime, blob };
  }
}

function getSuffixFilename(filename: string, suffix: string, forceExt?: string): string {
  const lastDot = filename.lastIndexOf('.');
  const base = lastDot === -1 ? filename : filename.slice(0, lastDot);
  const ext = forceExt || (lastDot === -1 ? '' : filename.slice(lastDot));
  return `${base}${suffix}${ext}`;
}

export default ExifService;
