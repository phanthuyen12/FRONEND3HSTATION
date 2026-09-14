/**
 * exifService.ts — Service xoá EXIF metadata
 * Theo pattern của project: class-based service với API_URL constructor
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

class ExifService {
  private api: string;

  constructor(apiUrl: string = '') {
    this.api = apiUrl;
  }

  /**
   * Lấy thông tin về service (số luồng, format hỗ trợ, v.v.)
   */
  async getInfo(): Promise<ExifServiceInfo> {
    const res = await fetch(`${this.api}/api/tools/exif/info`);
    const body = await res.json();
    if (!res.ok) throw new Error(body?.message || 'Lỗi khi lấy thông tin service');
    return body.data as ExifServiceInfo;
  }

  /**
   * Xoá EXIF khỏi 1 ảnh
   * @param file - File ảnh cần xoá EXIF
   * @returns ExifRemoveResult với blob ảnh sạch
   */
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
    const cleanFilename = getCleanFilename(file.name);

    return {
      filename: file.name,
      cleanFilename,
      originalSize,
      cleanSize,
      blob,
    };
  }

  /**
   * Xoá EXIF khỏi nhiều ảnh (đa luồng trên backend)
   * @param files - Mảng File ảnh
   * @param onProgress - Callback nhận % tiến độ (0-100)
   * @returns ExifBatchResult với ZIP blob
   */
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
          const percent = Math.round((e.loaded / e.total) * 80); // Upload = 0-80%
          onProgress(percent);
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
}

/**
 * Helper: tạo tên file clean từ tên gốc
 */
function getCleanFilename(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return `${filename}_clean`;
  return `${filename.slice(0, lastDot)}_clean${filename.slice(lastDot)}`;
}

export default ExifService;
