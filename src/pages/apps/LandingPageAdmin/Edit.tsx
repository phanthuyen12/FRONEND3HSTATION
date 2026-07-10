import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { PageBreadcrumb } from '../../../components';
import { landingPageService, API_URL, authService } from '../../../config';
import {
  LandingPage,
  LandingPageDomain,
  LandingPageVersion,
  LandingPageSubmission,
  LandingPageLog
} from '../../../services/landingPageService';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

const LandingPageEdit: React.FC = () => {
  const { id } = useParams();
  const isEditMode = id !== undefined && id !== 'new';
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'editor';

  const isReadOnly = authService.getUser()?.role === 'viewer';

  // State for basic page info
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('');
  const [pathSlug, setPathSlug] = useState('');
  const [status, setStatus] = useState<LandingPage['status']>('draft');
  const [publishStart, setPublishStart] = useState('');
  const [publishEnd, setPublishEnd] = useState('');
  const [previewToken, setPreviewToken] = useState('');

  // Code editor states
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [hasAssets, setHasAssets] = useState(false);

  // Lists & metadata
  const [domains, setDomains] = useState<LandingPageDomain[]>([]);
  const [versions, setVersions] = useState<LandingPageVersion[]>([]);
  const [submissions, setSubmissions] = useState<LandingPageSubmission[]>([]);
  const [logs, setLogs] = useState<LandingPageLog[]>([]);
  
  // App UI states
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Version comment
  const [versionDesc, setVersionDesc] = useState('');
  const [pendingZip, setPendingZip] = useState<File | null>(null);

  // File Upload Reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Leads UX states
  const [leadsSearch, setLeadsSearch] = useState('');
  const [leadsViewMode, setLeadsViewMode] = useState<'table' | 'grid'>('table');
  const [selectedLead, setSelectedLead] = useState<LandingPageSubmission | null>(null);

  const exportLeadsToCSV = () => {
    if (submissions.length === 0) return;
    
    // Header row
    const headers = ['Thời điểm', ...submissionCols, 'IP', 'User Agent'];
    
    // Rows data
    const rows = submissions.map(sub => {
      const rowData = [
        new Date(sub.submitted_at).toLocaleString('vi-VN'),
        ...submissionCols.map(col => {
          const val = sub.data?.[col];
          return val !== undefined ? `"${String(val).replace(/"/g, '""')}"` : '';
        }),
        sub.ip_address || '',
        `"${(sub.user_agent || '').replace(/"/g, '""')}"`
      ];
      return rowData.join(',');
    });
    
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n'); // UTF-8 BOM
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_landing_page_${id || 'data'}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        // Load domains
        const domList = await landingPageService.getDomains();
        setDomains(domList || []);
        if (domList.length > 0 && !isEditMode) {
          setDomain(domList[0].domain);
        }

        if (isEditMode) {
          const lp = await landingPageService.getLandingPage(Number(id));
          setTitle(lp.title);
          setDomain(lp.domain);
          setPathSlug(lp.path);
          setStatus(lp.status);
          setPublishStart(lp.publish_start_at ? lp.publish_start_at.slice(0, 16) : '');
          setPublishEnd(lp.publish_end_at ? lp.publish_end_at.slice(0, 16) : '');
          setHtmlCode(lp.draft_html || '');
          setCssCode(lp.draft_css || '');
          setJsCode(lp.draft_js || '');
          setPreviewToken(lp.preview_token);
          setHasAssets(!!lp.draft_assets_path);

          // Fetch tab lists
          loadVersions();
          loadSubmissions();
          loadLogs();
        }
      } catch (err: any) {
        console.error('Failed to initialize page details:', err);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể tải thông tin Landing Page',
          confirmButtonText: 'Đóng'
        });
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [id]);

  const loadVersions = async () => {
    if (!isEditMode) return;
    try {
      const data = await landingPageService.getVersions(Number(id));
      setVersions(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const loadSubmissions = async () => {
    if (!isEditMode) return;
    try {
      const data = await landingPageService.getSubmissions(Number(id));
      setSubmissions(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const loadLogs = async () => {
    if (!isEditMode) return;
    try {
      const data = await landingPageService.getLogs(Number(id));
      setLogs(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  // Compile helper to inject css and js into html code for local srcDoc preview
  const getCompiledSrcDoc = () => {
    let compiled = htmlCode || '<html><body><div style="padding: 20px; font-family: sans-serif; text-align: center;"><h3>Nhập mã HTML hoặc tải lên ZIP để bắt đầu</h3></div></body></html>';
    
    if (cssCode) {
      const styleTag = `\n<style>\n${cssCode}\n</style>\n`;
      if (compiled.includes('</head>')) {
        compiled = compiled.replace('</head>', `${styleTag}</head>`);
      } else {
        compiled = styleTag + compiled;
      }
    }

    if (jsCode) {
      const scriptTag = `\n<script>\n${jsCode}\n</script>\n`;
      if (compiled.includes('</body>')) {
        compiled = compiled.replace('</body>', `${scriptTag}</body>`);
      } else {
        compiled = compiled + scriptTag;
      }
    }

    return compiled;
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !domain || !pathSlug) {
      Swal.fire({ icon: 'warning', title: 'Thiếu thông tin', text: 'Vui lòng điền tiêu đề, tên miền và đường dẫn', confirmButtonText: 'Đóng' });
      return;
    }

    setSaving(true);
    const payload = {
      title,
      domain,
      path: pathSlug,
      status,
      publish_start_at: publishStart || null,
      publish_end_at: publishEnd || null,
      draft_html: htmlCode,
      draft_css: cssCode,
      draft_js: jsCode
    };

    try {
      if (isEditMode) {
        await landingPageService.updateLandingPage(Number(id), payload);
        Swal.fire({ icon: 'success', title: 'Lưu thành công!', text: 'Đã cập nhật Landing Page', timer: 1500, showConfirmButton: false });
        loadLogs();
      } else {
        const lp = await landingPageService.createLandingPage(payload);
        
        // If a ZIP was selected in create mode, upload & extract it now
        if (pendingZip) {
          Swal.fire({
            title: 'Đang tải lên...',
            text: 'Đang tải lên và giải nén file tài nguyên ZIP...',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
          try {
            await landingPageService.uploadZip(lp.id, pendingZip);
          } catch (uploadErr: any) {
            console.error('Failed to upload pending zip:', uploadErr);
            Swal.fire({
              icon: 'warning',
              title: 'Đã tạo trang nhưng lỗi ZIP',
              text: `Đã tạo Landing Page thành công nhưng không thể giải nén file ZIP đính kèm: ${uploadErr.message || 'Lỗi không xác định'}. Bạn có thể thử tải lại tệp ZIP này trong phần chỉnh sửa trang.`,
              confirmButtonText: 'Đóng'
            }).then(() => {
              navigate(`/admin/landing-pages/${lp.id}`);
            });
            return;
          }
        }

        Swal.fire({ icon: 'success', title: 'Tạo thành công!', text: 'Landing Page mới đã được tạo', timer: 1500, showConfirmButton: false });
        navigate(`/admin/landing-pages/${lp.id}`);
      }
    } catch (err: any) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Thất bại', text: err.message || 'Lưu Landing Page thất bại', confirmButtonText: 'Đóng' });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const isZip = file.name.toLowerCase().endsWith('.zip');
    const isHtml = file.name.toLowerCase().endsWith('.html') || file.name.toLowerCase().endsWith('.htm');

    if (!isZip && !isHtml) {
      Swal.fire({
        icon: 'error',
        title: 'Định dạng không hỗ trợ',
        text: 'Chỉ chấp nhận file định dạng .zip hoặc .html',
        confirmButtonText: 'Đóng'
      });
      return;
    }

    if (isHtml) {
      setUploading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setHtmlCode(event.target.result as string);
          Swal.fire({
            icon: 'success',
            title: 'Nhập HTML thành công!',
            text: 'Mã nguồn từ file HTML đã được điền vào trình soạn thảo.',
            timer: 1500,
            showConfirmButton: false
          });
        }
        setUploading(false);
      };
      reader.onerror = () => {
        Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể đọc file HTML', confirmButtonText: 'Đóng' });
        setUploading(false);
      };
      reader.readAsText(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (isZip) {
      if (isEditMode) {
        setUploading(true);
        try {
          const lp = await landingPageService.uploadZip(Number(id), file);
          setHtmlCode(lp.draft_html || '');
          setHasAssets(true);
          Swal.fire({
            icon: 'success',
            title: 'Tải lên thành công!',
            text: 'File zip đã được giải nén thành công vào thư mục của trang.',
            confirmButtonText: 'Đóng'
          });
          loadLogs();
        } catch (err: any) {
          console.error(err);
          Swal.fire({ icon: 'error', title: 'Lỗi giải nén', text: err.message || 'Giải nén và tải lên ZIP thất bại', confirmButtonText: 'Đóng' });
        } finally {
          setUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      } else {
        setPendingZip(file);
        setHasAssets(true);
        Swal.fire({
          icon: 'success',
          title: 'Đã nhận file ZIP!',
          text: `Đã chọn file "${file.name}". File này sẽ được tải lên và giải nén tự động sau khi bạn click nút "Tạo mới".`,
          confirmButtonText: 'Đóng'
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await landingPageService.publishLandingPage(Number(id), versionDesc.trim());
      setVersionDesc('');
      Swal.fire({
        icon: 'success',
        title: 'Xuất bản thành công!',
        text: 'Một phiên bản mới của website đã được xuất bản ra môi trường hoạt động.',
        confirmButtonText: 'Đóng'
      });
      loadVersions();
      loadLogs();
      
      // Reload page info to update active_version_id
      const lp = await landingPageService.getLandingPage(Number(id));
      setStatus(lp.status);
    } catch (err: any) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Lỗi xuất bản', text: err.message || 'Không thể xuất bản trang', confirmButtonText: 'Đóng' });
    } finally {
      setPublishing(false);
    }
  };

  const handleRestoreVersion = async (version: LandingPageVersion) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Phục hồi phiên bản?',
      text: `Xác nhận khôi phục phiên bản ${version.version_number} hoạt động trên website công khai? Nội dung nháp hiện tại của bạn sẽ được ghi đè bằng code phiên bản này.`,
      showCancelButton: true,
      confirmButtonText: 'Phục hồi',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
      const lp = await landingPageService.restoreVersion(Number(id), version.id);
      setHtmlCode(lp.draft_html || '');
      setCssCode(lp.draft_css || '');
      setJsCode(lp.draft_js || '');
      setHasAssets(!!lp.draft_assets_path);
      
      Swal.fire({
        icon: 'success',
        title: 'Phục hồi thành công!',
        text: `Đã khôi phục phiên bản hoạt động số ${version.version_number}.`,
        confirmButtonText: 'Đóng',
        timer: 2000
      });
      loadVersions();
      loadLogs();
    } catch (err: any) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: err.message || 'Phục hồi phiên bản thất bại', confirmButtonText: 'Đóng' });
    }
  };

  const handleDeleteLead = async (leadId: number) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Xóa Lead này?',
      text: 'Thao tác này sẽ xóa thông tin đăng ký của khách hàng.',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
      await landingPageService.deleteSubmission(leadId);
      setSubmissions(prev => prev.filter(s => s.id !== leadId));
      Swal.fire({ icon: 'success', title: 'Đã xóa', text: 'Thông tin đăng ký đã được xóa.', timer: 1000, showConfirmButton: false });
    } catch (err: any) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: err.message || 'Không thể xóa lead', confirmButtonText: 'Đóng' });
    }
  };

  const handleInsertFormTemplate = () => {
    const targetId = id || 'new';
    const formHtml = `\n<!-- Form đăng ký nhận thông tin khách hàng (Leads) -->
<div class="form-container">
  <h2>Đăng Ký Tư Vấn</h2>
  <form id="landingForm" action="/api/admin/landing-pages/${targetId}/submit" method="POST">
    <div class="form-group">
      <input type="text" name="name" required placeholder="Họ và tên" />
    </div>
    <div class="form-group">
      <input type="tel" name="phone" required placeholder="Số điện thoại" />
    </div>
    <div class="form-group">
      <input type="email" name="email" placeholder="Địa chỉ Email" />
    </div>
    <button type="submit">Gửi thông tin</button>
  </form>
</div>\n`;

    const formCss = `\n/* Style cho Form Đăng Ký */
.form-container {
  max-width: 450px;
  margin: 40px auto;
  padding: 30px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.form-container h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #1e293b;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
}
.form-group {
  margin-bottom: 15px;
}
.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  box-sizing: border-box;
  transition: all 0.2s ease;
}
.form-group input:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
.form-container button {
  width: 100%;
  padding: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}
.form-container button:hover {
  background: #2563eb;
}\n`;

    const formJs = `\n// AJAX Form Submission (Tự động gom cả tham số URL như ?ref=..., ?utm=...)
document.getElementById('landingForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  if (btn) btn.disabled = true;

  const formData = new FormData(this);
  const data = {};

  // Tự động lấy các tham số trên URL (ví dụ: ?ref=facebook, ?utm_source=google)
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.forEach((val, key) => {
    data[key] = val;
  });

  // Gom thêm dữ liệu điền từ form
  formData.forEach((val, key) => {
    data[key] = val;
  });

  let submitUrl = this.getAttribute('action') || '';
  if (window.location.port === '5173') {
    submitUrl = 'https://api.aetrading.vn' + submitUrl;
  }

  try {
    const res = await fetch(submitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (res.ok && result.success) {
      alert(result.message || 'Cảm ơn bạn! Đăng ký thành công.');
      this.reset();
    } else {
      alert('Lỗi: ' + (result.message || 'Đăng ký thất bại'));
    }
  } catch (err) {
    alert('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
  } finally {
    if (btn) btn.disabled = false;
  }
});\n`;

    setHtmlCode(prev => prev + formHtml);
    setCssCode(prev => prev + formCss);
    setJsCode(prev => prev + formJs);

    Swal.fire({
      icon: 'success',
      title: 'Đã chèn Form mẫu',
      text: 'Đã tự động chèn code HTML, CSS và JavaScript xử lý AJAX cho form đăng ký.',
      timer: 2000,
      showConfirmButton: false
    });
  };

  // Dynamically extract unique keys from all submissions to build the table columns dynamically
  const getSubmissionsColumns = () => {
    const keys = new Set<string>();
    submissions.forEach(sub => {
      if (sub.data && typeof sub.data === 'object') {
        Object.keys(sub.data).forEach(k => keys.add(k));
      }
    });
    return Array.from(keys);
  };

  const submissionCols = getSubmissionsColumns();

  const filteredSubmissions = submissions.filter(sub => {
    if (!leadsSearch) return true;
    const query = leadsSearch.toLowerCase();
    
    // Search in fields data
    if (sub.data && typeof sub.data === 'object') {
      return Object.values(sub.data).some(val => 
        String(val).toLowerCase().includes(query)
      );
    }
    return false;
  });

  return (
    <>
      <PageBreadcrumb
        name={isEditMode ? `Cấu hình: ${title}` : 'Tạo Landing Page mới'}
        title="Landing Pages"
        breadCrumbItems={['3HSTATION', 'Landing Pages', isEditMode ? 'Chỉnh sửa' : 'Thêm mới']}
      />

      {loading ? (
        <div className="text-center py-20 text-slate-500">Đang tải thông tin trang...</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* LEFT PANEL: SETTINGS & CONFIG */}
          <div className="xl:col-span-1 flex flex-col gap-6">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Cấu hình chung</h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleSaveSettings} className="flex flex-col gap-4">
                  <div>
                    <label className="text-slate-600 dark:text-slate-400 text-sm font-semibold mb-1 block">
                      Tên trang
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="Ví dụ: Đăng ký Khóa học AI"
                      required
                      disabled={isReadOnly}
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 dark:text-slate-400 text-sm font-semibold mb-1 block">
                      Tên miền cấu hình
                    </label>
                    <select
                      className="form-select"
                      value={domain}
                      onChange={e => setDomain(e.target.value)}
                      required
                      disabled={isReadOnly}
                    >
                      <option value="">-- Chọn tên miền --</option>
                      {domains.map(d => (
                        <option key={d.id} value={d.domain}>
                          {d.domain}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-600 dark:text-slate-400 text-sm font-semibold mb-1 block">
                      Đường dẫn riêng (Slug)
                    </label>
                    <input
                      type="text"
                      className="form-input font-mono"
                      value={pathSlug}
                      onChange={e => setPathSlug(e.target.value)}
                      placeholder="Ví dụ: /khuyen-mai"
                      required
                      disabled={isReadOnly}
                    />
                    <span className="text-xs text-slate-400 mt-1 block">
                      Phải bắt đầu bằng dấu gạch chéo `/`. Dùng `/` nếu muốn làm trang chủ của tên miền.
                    </span>
                  </div>

                  <div>
                    <label className="text-slate-600 dark:text-slate-400 text-sm font-semibold mb-1 block">
                      Trạng thái hoạt động
                    </label>
                    <select
                      className="form-select"
                      value={status}
                      onChange={e => setStatus(e.target.value as any)}
                      disabled={isReadOnly}
                    >
                      <option value="draft">Bản nháp (Draft)</option>
                      <option value="published">Đã xuất bản (Active)</option>
                      <option value="scheduled">Đã lên lịch (Scheduled)</option>
                      <option value="hidden">Tạm ẩn (Hidden)</option>
                      <option value="expired">Hết hạn (Expired)</option>
                    </select>
                  </div>

                  {/* Date Pickers for Schedule & Expiration */}
                  {(status === 'scheduled' || status === 'published') && (
                    <div className="border border-slate-100 dark:border-slate-800 p-3 rounded bg-slate-50 dark:bg-slate-800/40 flex flex-col gap-3">
                      <div className="font-semibold text-xs text-slate-500 uppercase tracking-wider">
                        Cấu hình lịch phát hành
                      </div>
                      <div>
                        <label className="text-slate-600 dark:text-slate-400 text-xs font-semibold mb-1 block">
                          Thời gian tự động hiển thị (bắt đầu)
                        </label>
                        <input
                          type="datetime-local"
                          className="form-input text-sm"
                          value={publishStart}
                          onChange={e => setPublishStart(e.target.value)}
                          disabled={isReadOnly}
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 dark:text-slate-400 text-xs font-semibold mb-1 block">
                          Thời gian kết thúc (hết hạn)
                        </label>
                        <input
                          type="datetime-local"
                          className="form-input text-sm"
                          value={publishEnd}
                          onChange={e => setPublishEnd(e.target.value)}
                          disabled={isReadOnly}
                        />
                      </div>
                    </div>
                  )}

                  {!isReadOnly && (
                    <button
                      type="submit"
                      className="btn bg-primary text-white w-full"
                      disabled={saving}
                    >
                      {saving ? 'Đang lưu...' : isEditMode ? 'Lưu cấu hình' : 'Tạo mới'}
                    </button>
                  )}
                </form>
              </div>
            </div>

            {/* QUICK ACTIONS PANEL (ONLY FOR EDIT MODE) */}
            {isEditMode && (
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Xem trước & Liên kết</h4>
                </div>
                <div className="card-body flex flex-col gap-4">
                  {!isReadOnly && (
                    <>
                      <div className="text-xs text-slate-500">
                        Nội dung soạn thảo hiện tại được lưu dưới dạng Bản nháp và không làm ảnh hưởng ngay tới website đang hoạt động.
                      </div>
                      <div>
                        <label className="text-slate-600 dark:text-slate-400 text-xs font-semibold mb-1 block">
                          Ghi chú phiên bản (không bắt buộc)
                        </label>
                        <textarea
                          placeholder="Mô tả các thay đổi..."
                          className="form-input text-sm min-h-[60px]"
                          value={versionDesc}
                          onChange={e => setVersionDesc(e.target.value)}
                        />
                      </div>
                      <button
                        onClick={handlePublish}
                        className="btn bg-success text-white w-full flex items-center justify-center gap-1.5"
                        disabled={publishing || saving}
                      >
                        <i className="mgc_rocket_line text-lg" />
                        {publishing ? 'Đang xuất bản...' : 'Cập nhật xuất bản công khai'}
                      </button>
                    </>
                  )}
                  <div className="flex gap-2">
                    <a
                      href={`${API_URL}/preview/lp/${previewToken}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 w-full flex items-center justify-center gap-1"
                    >
                      <i className="mgc_eye_line text-base" /> Preview
                    </a>
                  </div>
                  {status === 'published' && (
                    <div className="flex gap-2">
                      <a
                        href={`${window.location.protocol}//${domain}${pathSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn bg-slate-150 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 w-full flex items-center justify-center gap-1"
                      >
                        <i className="mgc_external_link_line text-base" /> Live Link
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANEL: EDITOR / PREVIEW / LOGS / LEADS */}
          <div className="xl:col-span-3">
            <div className="card h-full">
              {/* Tab Selector */}
              <div className="card-header border-b border-slate-200 dark:border-slate-700 flex justify-between items-center p-0">
                <nav className="flex gap-6 px-6" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('editor')}
                    className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition-all ${
                      activeTab === 'editor'
                        ? 'border-primary text-primary font-semibold'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <i className="mgc_code_line text-base" />
                    Trình soạn thảo code
                  </button>

                  <button
                    onClick={() => setActiveTab('templates')}
                    className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition-all ${
                      activeTab === 'templates'
                        ? 'border-primary text-primary font-semibold'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <i className="mgc_layout_line text-base" />
                    Code mẫu Form
                  </button>
                  
                  {isEditMode && (
                    <>
                      <button
                        onClick={() => {
                          setActiveTab('versions');
                          loadVersions();
                        }}
                        className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition-all ${
                          activeTab === 'versions'
                            ? 'border-primary text-primary font-semibold'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <i className="mgc_history_line text-base" />
                        Lịch sử phiên bản
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('leads');
                          loadSubmissions();
                        }}
                        className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition-all ${
                          activeTab === 'leads'
                            ? 'border-primary text-primary font-semibold'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <i className="mgc_user_3_line text-base" />
                        Biểu mẫu đăng ký (Leads)
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('logs');
                          loadLogs();
                        }}
                        className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition-all ${
                          activeTab === 'logs'
                            ? 'border-primary text-primary font-semibold'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <i className="mgc_file_list_line text-base" />
                        Lịch sử hoạt động
                      </button>
                    </>
                  )}
                </nav>
              </div>

              <div className="card-body">
                {/* 1. EDITOR TAB */}
                {activeTab === 'editor' && (
                  <div className="flex flex-col gap-6">
                    {/* File Upload Zone (Supports both ZIP and HTML) */}
                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 p-6 rounded text-center bg-slate-50 dark:bg-slate-800/20">
                      <i className="mgc_file_zip_line text-4xl text-slate-400 mb-2 block" />
                      <h5 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Tải lên tệp nguồn (.html) hoặc tài nguyên (.zip)
                      </h5>
                      <p className="text-xs text-slate-400 mb-4 max-w-md mx-auto">
                        Hỗ trợ tải lên trực tiếp tệp tin rời dạng **.html** để nhập code vào trình soạn thảo, hoặc tệp nén **.zip** chứa thư mục gốc gồm `index.html` và các file CSS, JS, hình ảnh đi kèm.
                      </p>
                      <button
                        type="button"
                        className="btn bg-primary/10 text-primary hover:bg-primary/20"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading || isReadOnly}
                      >
                        {uploading ? 'Đang xử lý...' : 'Chọn file nguồn (.html, .zip)'}
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".zip,.html,.htm"
                        className="hidden"
                      />
                      {pendingZip && (
                        <div className="mt-3 text-xs text-blue-600 flex items-center justify-center gap-1">
                          <i className="mgc_time_line" /> Đã chọn file ZIP: <strong>{pendingZip.name}</strong> (sẽ giải nén tự động sau khi bấm Tạo mới)
                        </div>
                      )}
                      {!pendingZip && hasAssets && (
                        <div className="mt-3 text-xs text-green-600 flex items-center justify-center gap-1">
                          <i className="mgc_check_circle_fill" /> Đã chứa tệp đính kèm/hình ảnh đã giải nén
                        </div>
                      )}
                    </div>

                    {/* Hướng dẫn cài đặt form */}
                    <div className="border border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-lg flex gap-3 text-slate-700 dark:text-slate-300">
                      <i className="mgc_information_line text-blue-500 text-xl flex-shrink-0 mt-0.5" />
                      <div className="text-xs flex-1 flex flex-col gap-2">
                        <div className="font-semibold text-blue-700 dark:text-blue-400 text-sm">💡 Hướng dẫn tạo Form đăng ký thu thập Leads</div>
                        <p>
                          Bạn có thể sử dụng nút <strong>"Chèn Form Đăng Ký"</strong> ngay trong thanh tiêu đề của trình soạn thảo <code>index.html</code> bên dưới để chèn nhanh một form mẫu đầy đủ CSS định dạng và JavaScript xử lý gửi dữ liệu AJAX.
                        </p>
                        <p>
                          Nếu tự viết form của riêng bạn, hãy trỏ thuộc tính <code>action</code> của thẻ <code>&lt;form&gt;</code> hoặc đường dẫn gọi API Javascript tới: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono font-semibold text-red-500">/api/admin/landing-pages/{id || 'ID_TRANG'}/submit</code> (Phương thức <strong>POST</strong>). Hệ thống sẽ tự động bắt tất cả dữ liệu từ các trường nhập có thuộc tính <code>name</code> và lưu vào cơ sở dữ liệu.
                        </p>
                      </div>
                    </div>

                    {/* Direct Code Editor and Preview side-by-side */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-[550px]">
                      
                      {/* Form Code Input */}
                      <div className="flex flex-col gap-5">
                        {/* HTML Editor */}
                        <div>
                          <label className="text-slate-600 dark:text-slate-400 text-xs font-semibold mb-1.5 block flex items-center gap-1">
                            <i className="mgc_html5_line text-orange-500 text-sm" /> Mã nguồn HTML (Cấu trúc trang)
                          </label>
                          <div className="flex flex-col rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 shadow-md">
                            <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                              <div className="flex gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-400 block" />
                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 block" />
                                <span className="w-2.5 h-2.5 rounded-full bg-green-400 block" />
                              </div>
                              <div className="flex items-center gap-2">
                                {!isReadOnly && (
                                  <button
                                    type="button"
                                    onClick={handleInsertFormTemplate}
                                    className="text-[10px] bg-primary/10 text-primary hover:bg-primary/20 px-2 py-0.5 rounded font-semibold transition-all flex items-center gap-1"
                                  >
                                    <i className="mgc_add_line" /> Chèn Form Đăng Ký
                                  </button>
                                )}
                                <span className="text-[10px] text-slate-400 font-mono select-none">index.html</span>
                              </div>
                            </div>
                            <textarea
                              className="w-full font-mono text-xs min-h-[300px] bg-slate-950 text-slate-200 p-4 border-0 focus:ring-0 outline-none resize-y"
                              value={htmlCode}
                              onChange={e => setHtmlCode(e.target.value)}
                              placeholder="<!-- Nhập mã HTML vào đây -->&#10;<div>&#10;  <h1>Xin chào!</h1>&#10;</div>"
                              readOnly={isReadOnly}
                            />
                          </div>
                        </div>

                        {/* CSS and JS Editors */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {/* CSS Editor */}
                          <div>
                            <label className="text-slate-600 dark:text-slate-400 text-xs font-semibold mb-1.5 block flex items-center gap-1">
                              <i className="mgc_css3_line text-blue-500 text-sm" /> Mã nguồn CSS (Định dạng)
                            </label>
                            <div className="flex flex-col rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 shadow-md">
                              <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                                <div className="flex gap-1.5">
                                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 block" />
                                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 block" />
                                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 block" />
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono select-none">styles.css</span>
                              </div>
                              <textarea
                                className="w-full font-mono text-xs min-h-[160px] bg-slate-950 text-slate-200 p-4 border-0 focus:ring-0 outline-none resize-y"
                                value={cssCode}
                                onChange={e => setCssCode(e.target.value)}
                                placeholder="/* Viết CSS ở đây */&#10;h1 { color: #3b82f6; }"
                                readOnly={isReadOnly}
                              />
                            </div>
                          </div>

                          {/* JS Editor */}
                          <div>
                            <label className="text-slate-600 dark:text-slate-400 text-xs font-semibold mb-1.5 block flex items-center gap-1">
                              <i className="mgc_javascript_line text-yellow-500 text-sm" /> Mã nguồn JavaScript (Logic)
                            </label>
                            <div className="flex flex-col rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 shadow-md">
                              <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                                <div className="flex gap-1.5">
                                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 block" />
                                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 block" />
                                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 block" />
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono select-none">script.js</span>
                              </div>
                              <textarea
                                className="w-full font-mono text-xs min-h-[160px] bg-slate-950 text-slate-200 p-4 border-0 focus:ring-0 outline-none resize-y"
                                value={jsCode}
                                onChange={e => setJsCode(e.target.value)}
                                placeholder="// Viết Javascript ở đây&#10;console.log('Page loaded');"
                                readOnly={isReadOnly}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Viewport Preview */}
                      <div className="flex flex-col border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900/40">
                        <div className="bg-white dark:bg-slate-800 p-3 flex justify-between items-center border-b border-slate-200 dark:border-slate-700 shadow-sm">
                          <span className="font-semibold text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1">
                            <i className="mgc_eye_line text-sm text-slate-500" /> Trình xem trước giao diện
                          </span>
                          <div className="flex bg-slate-150 dark:bg-slate-700 p-0.5 rounded-lg gap-0.5">
                            <button
                              type="button"
                              className={`px-3 py-1 rounded-md text-xs flex items-center gap-1 transition-all ${
                                previewMode === 'desktop'
                                  ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold shadow-sm'
                                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                              }`}
                              onClick={() => setPreviewMode('desktop')}
                            >
                              <i className="mgc_computer_line text-sm" /> Desktop
                            </button>
                            <button
                              type="button"
                              className={`px-3 py-1 rounded-md text-xs flex items-center gap-1 transition-all ${
                                previewMode === 'tablet'
                                  ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold shadow-sm'
                                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                              }`}
                              onClick={() => setPreviewMode('tablet')}
                            >
                              <i className="mgc_tablet_line text-sm" /> Tablet
                            </button>
                            <button
                              type="button"
                              className={`px-3 py-1 rounded-md text-xs flex items-center gap-1 transition-all ${
                                previewMode === 'mobile'
                                  ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold shadow-sm'
                                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                              }`}
                              onClick={() => setPreviewMode('mobile')}
                            >
                              <i className="mgc_cellphone_line text-sm" /> Mobile
                            </button>
                          </div>
                        </div>

                        {/* Rendering sandbox iframe inside realistic device mockups */}
                        <div className="flex-1 bg-slate-100 dark:bg-slate-900/60 p-6 flex items-center justify-center min-h-[450px]">
                          {previewMode === 'mobile' ? (
                            <div className="relative mx-auto my-2 transition-all duration-300 ease-in-out shadow-2xl" style={{ width: '360px', height: '640px' }}>
                              {/* Notch */}
                              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-4 w-32 bg-slate-800 rounded-b-xl z-20 flex items-center justify-center">
                                <span className="w-10 h-1 bg-slate-700 rounded-full mb-0.5 block" />
                              </div>
                              {/* Device Screen */}
                              <div className="w-full h-full border-[10px] border-slate-800 dark:border-slate-700 rounded-[32px] overflow-hidden bg-white relative z-10">
                                <iframe
                                  style={{ width: '100%', height: '100%', border: 'none' }}
                                  title="Landing page preview mobile"
                                  src={isEditMode && hasAssets ? `${API_URL}/preview/lp/${previewToken}` : undefined}
                                  srcDoc={isEditMode && hasAssets ? undefined : getCompiledSrcDoc()}
                                  sandbox="allow-scripts allow-forms allow-same-origin"
                                />
                              </div>
                            </div>
                          ) : previewMode === 'tablet' ? (
                            <div className="relative mx-auto my-2 transition-all duration-300 ease-in-out shadow-2xl" style={{ width: '680px', height: '800px' }}>
                              {/* Device Screen */}
                              <div className="w-full h-full border-[12px] border-slate-800 dark:border-slate-700 rounded-[20px] overflow-hidden bg-white relative z-10">
                                <iframe
                                  style={{ width: '100%', height: '100%', border: 'none' }}
                                  title="Landing page preview tablet"
                                  src={isEditMode && hasAssets ? `${API_URL}/preview/lp/${previewToken}` : undefined}
                                  srcDoc={isEditMode && hasAssets ? undefined : getCompiledSrcDoc()}
                                  sandbox="allow-scripts allow-forms allow-same-origin"
                                />
                              </div>
                            </div>
                          ) : (
                            /* Desktop mock browser bar */
                            <div className="w-full h-full flex flex-col border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-lg bg-white transition-all duration-300">
                              <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700">
                                <div className="flex gap-1.5 mr-4">
                                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 block" />
                                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 block" />
                                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 block" />
                                </div>
                                <div className="bg-white/60 dark:bg-slate-900/60 text-[10px] text-slate-500 font-mono px-3 py-1 rounded w-full max-w-lg mx-auto text-center truncate select-all border border-slate-200/50 dark:border-slate-700/50">
                                  {isEditMode && hasAssets ? `http://${domain}${pathSlug}` : `https://api.aetrading.vn${pathSlug}`}
                                </div>
                              </div>
                              <div className="flex-1 min-h-[500px]">
                                <iframe
                                  style={{ width: '100%', height: '100%', minHeight: '500px', border: 'none' }}
                                  title="Landing page preview desktop"
                                  src={isEditMode && hasAssets ? `${API_URL}/preview/lp/${previewToken}` : undefined}
                                  srcDoc={isEditMode && hasAssets ? undefined : getCompiledSrcDoc()}
                                  sandbox="allow-scripts allow-forms allow-same-origin"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. VERSIONS TAB */}
                {activeTab === 'versions' && (
                  <div>
                    <h5 className="font-semibold text-slate-700 dark:text-slate-300 mb-4">
                      Lịch sử xuất bản của website
                    </h5>
                    {versions.length === 0 ? (
                      <div className="text-center py-10 text-slate-500">Chưa có phiên bản xuất bản nào được lưu.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full table-auto">
                          <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                                Phiên bản
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                                Mô tả / Ghi chú
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                                Người xuất bản
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                                Thời gian
                              </th>
                              {!isReadOnly && (
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300">
                                  Thao tác
                                </th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {versions.map(ver => (
                              <tr key={ver.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">
                                  Ver {ver.version_number}
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                  {ver.description || 'Không có ghi chú'}
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                  {ver.creator_name || 'Hệ thống'}
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                                  {new Date(ver.created_at).toLocaleString('vi-VN')}
                                </td>
                                {!isReadOnly && (
                                  <td className="px-4 py-3 text-right">
                                    <button
                                      onClick={() => handleRestoreVersion(ver)}
                                      className="btn btn-sm bg-primary/10 text-primary hover:bg-primary/20"
                                      title="Khôi phục lại phiên bản này"
                                    >
                                      Phục hồi
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. LEADS (SUBMISSIONS) TAB */}
                {activeTab === 'leads' && (
                  <div className="flex flex-col gap-6">
                    {/* Header Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="flex flex-col gap-1">
                        <h5 className="font-semibold text-slate-800 dark:text-slate-200">
                          Khách hàng đăng ký (Leads)
                        </h5>
                        <span className="text-xs text-slate-500">
                          Tìm thấy {filteredSubmissions.length} trên tổng số {submissions.length} Leads
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        {/* Search Input */}
                        <div className="relative w-full sm:w-64">
                          <input
                            type="text"
                            placeholder="Tìm kiếm thông tin..."
                            className="form-input text-xs pl-8 pr-3 py-1.5 w-full rounded-lg"
                            value={leadsSearch}
                            onChange={e => setLeadsSearch(e.target.value)}
                          />
                          <i className="mgc_search_line absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm" />
                        </div>

                        {/* View Switcher Toggle */}
                        <div className="flex bg-slate-100 dark:bg-slate-700 p-0.5 rounded-lg gap-0.5">
                          <button
                            type="button"
                            onClick={() => setLeadsViewMode('table')}
                            className={`px-3 py-1.5 rounded-md text-xs flex items-center gap-1 transition-all ${
                              leadsViewMode === 'table'
                                ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                            }`}
                            title="Xem dạng bảng"
                          >
                            <i className="mgc_align_justify_line text-sm" /> Bảng
                          </button>
                          <button
                            type="button"
                            onClick={() => setLeadsViewMode('grid')}
                            className={`px-3 py-1.5 rounded-md text-xs flex items-center gap-1 transition-all ${
                              leadsViewMode === 'grid'
                                ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                            }`}
                            title="Xem dạng thẻ"
                          >
                            <i className="mgc_grid_line text-sm" /> Thẻ (Cards)
                          </button>
                        </div>

                        {/* CSV Export Button */}
                        <button
                          type="button"
                          onClick={exportLeadsToCSV}
                          className="btn btn-sm bg-success text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs shadow-sm hover:bg-success-dark transition-all"
                          disabled={submissions.length === 0}
                        >
                          <i className="mgc_download_line text-sm" /> Xuất Excel/CSV
                        </button>
                      </div>
                    </div>

                    {submissions.length === 0 ? (
                      <div className="text-center py-20 text-slate-500 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                        <i className="mgc_user_3_line text-5xl text-slate-300 mb-3 block" />
                        <p className="font-medium text-slate-600 dark:text-slate-400">Chưa nhận được biểu mẫu đăng ký nào</p>
                        <p className="text-xs text-slate-400 mt-1">Các thông tin khách hàng đăng ký sẽ tự động xuất hiện ở đây.</p>
                      </div>
                    ) : filteredSubmissions.length === 0 ? (
                      <div className="text-center py-10 text-slate-500 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                        Không tìm thấy Lead nào phù hợp với từ khóa tìm kiếm.
                      </div>
                    ) : leadsViewMode === 'table' ? (
                      /* Spacious Table View */
                      <div className="overflow-x-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm">
                        <table className="min-w-full table-auto">
                          <thead className="bg-slate-50/70 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                              <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Thời điểm gửi
                              </th>
                              
                              {submissionCols.map(col => (
                                <th key={col} className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                  {col}
                                </th>
                              ))}

                              <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                IP & Thiết bị
                              </th>
                              <th className="px-5 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Thao tác
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredSubmissions.map(sub => (
                              <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer" onClick={() => setSelectedLead(sub)}>
                                <td className="px-5 py-4 text-xs font-semibold text-slate-500 whitespace-nowrap">
                                  {new Date(sub.submitted_at).toLocaleString('vi-VN')}
                                </td>

                                {submissionCols.map(col => {
                                  const val = sub.data?.[col];
                                  const isRefOrUtm = col.toLowerCase().includes('ref') || col.toLowerCase().includes('utm');
                                  
                                  if (isRefOrUtm && val) {
                                    return (
                                      <td key={col} className="px-5 py-4 text-xs">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30">
                                          {String(val)}
                                        </span>
                                      </td>
                                    );
                                  }

                                  return (
                                    <td key={col} className="px-5 py-4 text-sm font-medium text-slate-800 dark:text-slate-200">
                                      {val !== undefined ? String(val) : '-'}
                                    </td>
                                  );
                                })}

                                <td className="px-5 py-4 text-xs text-slate-500">
                                  <div className="font-semibold text-slate-600 dark:text-slate-400">IP: {sub.ip_address || 'N/A'}</div>
                                  <div className="truncate max-w-[150px] text-[10px]" title={sub.user_agent || ''}>
                                    {sub.user_agent || 'N/A'}
                                  </div>
                                </td>

                                <td className="px-5 py-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                                  <div className="flex justify-end items-center gap-2">
                                    <button
                                      onClick={() => setSelectedLead(sub)}
                                      className="btn btn-sm bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300"
                                      title="Xem chi tiết"
                                    >
                                      <i className="mgc_eye_line text-base" />
                                    </button>
                                    {!isReadOnly && (
                                      <button
                                        onClick={() => handleDeleteLead(sub.id)}
                                        className="btn btn-sm bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400"
                                        title="Xóa Lead"
                                      >
                                        <i className="mgc_delete_2_line text-base" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      /* Grid / Cards View */
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSubmissions.map(sub => (
                          <div
                            key={sub.id}
                            className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-xl p-5 hover:shadow-md transition-all flex flex-col gap-4 cursor-pointer relative"
                            onClick={() => setSelectedLead(sub)}
                          >
                            {/* Card Header */}
                            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
                              <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded">
                                {new Date(sub.submitted_at).toLocaleString('vi-VN')}
                              </span>
                              <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                                <button
                                  onClick={() => setSelectedLead(sub)}
                                  className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
                                  title="Chi tiết"
                                >
                                  <i className="mgc_eye_line text-lg" />
                                </button>
                                {!isReadOnly && (
                                  <button
                                    onClick={() => handleDeleteLead(sub.id)}
                                    className="text-red-500 hover:text-red-700 transition"
                                    title="Xóa Lead"
                                  >
                                    <i className="mgc_delete_2_line text-lg" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Card Body */}
                            <div className="flex flex-col gap-2.5 flex-1">
                              {submissionCols.map(col => {
                                const val = sub.data?.[col];
                                const isRefOrUtm = col.toLowerCase().includes('ref') || col.toLowerCase().includes('utm');
                                
                                return (
                                  <div key={col} className="flex justify-between text-xs gap-3">
                                    <span className="text-slate-400 font-medium uppercase tracking-wider">{col}:</span>
                                    {isRefOrUtm && val ? (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30 max-w-[150px] truncate" title={String(val)}>
                                        {String(val)}
                                      </span>
                                    ) : (
                                      <span className="font-semibold text-slate-700 dark:text-slate-300 max-w-[180px] truncate" title={val !== undefined ? String(val) : '-'}>
                                        {val !== undefined ? String(val) : '-'}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Card Footer (Metadata) */}
                            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center text-[10px] text-slate-400">
                              <span>IP: {sub.ip_address || 'N/A'}</span>
                              <span className="truncate max-w-[150px]" title={sub.user_agent || ''}>
                                {sub.user_agent || 'N/A'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Leads Detail Side-Drawer / Modal */}
                    {selectedLead && (
                      <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-end" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
                        {/* Background Overlay */}
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedLead(null)} />
                        
                        {/* Side panel */}
                        <div className="relative w-full max-w-lg h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col transition-all duration-300 ease-in-out border-l border-slate-200 dark:border-slate-850">
                          {/* Close button inside drawer */}
                          <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/30">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                              <span className="font-bold text-slate-800 dark:text-slate-200 text-base">Thông tin Lead chi tiết</span>
                            </div>
                            <button
                              type="button"
                              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                              onClick={() => setSelectedLead(null)}
                            >
                              <i className="mgc_close_line text-2xl" />
                            </button>
                          </div>

                          {/* Detail Content */}
                          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                            {/* Lead submission timestamp */}
                            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                              <span className="text-xs text-slate-400 font-semibold uppercase">Thời điểm đăng ký</span>
                              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                {new Date(selectedLead.submitted_at).toLocaleString('vi-VN')}
                              </span>
                            </div>

                            {/* Data block */}
                            <div className="flex flex-col gap-3">
                              <h6 className="font-bold text-slate-800 dark:text-slate-200 text-sm border-b border-slate-100 dark:border-slate-850 pb-2">
                                Dữ liệu điền biểu mẫu (Fields)
                              </h6>
                              {Object.entries(selectedLead.data || {}).map(([key, val]) => {
                                const isRefOrUtm = key.toLowerCase().includes('ref') || key.toLowerCase().includes('utm');
                                return (
                                  <div key={key} className="flex flex-col bg-slate-50/30 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-850 gap-1.5 hover:border-slate-200 transition-all">
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{key}</span>
                                    {isRefOrUtm ? (
                                      <div>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30">
                                          {String(val)}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 break-words">{String(val)}</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Connection Details */}
                            <div className="flex flex-col gap-3">
                              <h6 className="font-bold text-slate-800 dark:text-slate-200 text-sm border-b border-slate-100 dark:border-slate-850 pb-2">
                                Chi tiết kết nối
                              </h6>
                              <div className="flex justify-between text-xs py-1">
                                <span className="text-slate-400 font-semibold">Địa chỉ IP:</span>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedLead.ip_address || 'N/A'}</span>
                              </div>
                              <div className="flex flex-col text-xs py-1 gap-1">
                                <span className="text-slate-400 font-semibold">Thiết bị & Trình duyệt (User Agent):</span>
                                <span className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg font-mono text-[10px] leading-relaxed text-slate-600 dark:text-slate-400 break-all select-all">
                                  {selectedLead.user_agent || 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Footer action drawer */}
                          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/30 flex justify-end gap-3">
                             {!isReadOnly && (
                               <button
                                 type="button"
                                 onClick={() => {
                                   handleDeleteLead(selectedLead.id);
                                   setSelectedLead(null);
                                 }}
                                 className="btn bg-red-500 hover:bg-red-600 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-sm transition-all"
                               >
                                 Xóa Lead này
                               </button>
                             )}
                            <button
                              type="button"
                              className="btn bg-slate-150 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 font-semibold text-xs px-4 py-2 rounded-lg transition-all"
                              onClick={() => setSelectedLead(null)}
                            >
                              Đóng
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/* 4. AUDIT LOGS TAB */}
                {activeTab === 'logs' && (
                  <div>
                    <h5 className="font-semibold text-slate-700 dark:text-slate-300 mb-4">
                      Lịch sử thao tác quản lý trang
                    </h5>
                    {logs.length === 0 ? (
                      <div className="text-center py-10 text-slate-500">Chưa có thao tác nào được ghi nhận.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full table-auto">
                          <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                                Thời điểm
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                                Người thực hiện
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                                Thao tác
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">
                                Chi tiết
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {logs.map(log => (
                              <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                                  {new Date(log.created_at).toLocaleString('vi-VN')}
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                                  {log.user_name || 'Hệ thống'}
                                </td>
                                <td className="px-4 py-3">
                                  <span className="badge bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold px-2 py-0.5 uppercase">
                                    {log.action}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                  {log.details || '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. FORM TEMPLATES TAB */}
                {activeTab === 'templates' && (
                  <div className="flex flex-col gap-6">
                    <div className="border border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-lg flex gap-3 text-slate-700 dark:text-slate-300">
                      <i className="mgc_information_line text-blue-500 text-xl flex-shrink-0 mt-0.5" />
                      <div className="text-xs flex-1 flex flex-col gap-2">
                        <div className="font-semibold text-blue-700 dark:text-blue-400 text-sm">💡 Nguyên lý hoạt động của Form</div>
                        <p>
                          Hệ thống tự động lưu trữ toàn bộ các tham số URL hiện có của khách truy cập (như <code>ref</code>, <code>utm_source</code>, <code>utm_campaign</code>, v.v.) cùng với các ô nhập liệu trong form khi được gửi lên máy chủ. Bạn có thể sao chép trực tiếp các đoạn code dưới đây vào trang của mình.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      {/* Mẫu 1: AJAX Form */}
                      <div className="card border border-slate-200 dark:border-slate-700 shadow-none mb-0">
                        <div className="card-header bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-700 py-3">
                          <h5 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Mẫu 1: Form AJAX sử dụng Javascript (Khuyên dùng - Không reload trang)</h5>
                        </div>
                        <div className="card-body">
                          <p className="text-xs text-slate-500 mb-3">
                            Mẫu này sử dụng đoạn mã JavaScript để tự động gom toàn bộ tham số từ URL hiện tại gửi kèm theo dữ liệu trong form.
                          </p>
                          <textarea
                            readOnly
                            onClick={e => (e.target as HTMLTextAreaElement).select()}
                            className="w-full font-mono text-xs h-[300px] bg-slate-950 text-slate-200 p-4 rounded-lg outline-none cursor-pointer"
                            value={`<!-- Giao diện HTML của Form -->
<div class="form-container">
  <h2>Đăng Ký Tư Vấn</h2>
  <form id="landingForm" action="/api/admin/landing-pages/${id || 'ID_TRANG'}/submit" method="POST">
    <div class="form-group">
      <input type="text" name="name" required placeholder="Họ và tên" />
    </div>
    <div class="form-group">
      <input type="tel" name="phone" required placeholder="Số điện thoại" />
    </div>
    <div class="form-group">
      <input type="email" name="email" placeholder="Địa chỉ Email" />
    </div>
    <button type="submit">Gửi thông tin</button>
  </form>
</div>

<!-- Copy đoạn CSS này chèn vào thẻ style hoặc ô CSS của landing page -->
<style>
.form-container {
  max-width: 450px;
  margin: 40px auto;
  padding: 30px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.form-container h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #1e293b;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
}
.form-group {
  margin-bottom: 15px;
}
.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  box-sizing: border-box;
  transition: all 0.2s ease;
}
.form-group input:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
.form-container button {
  width: 100%;
  padding: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}
.form-container button:hover {
  background: #2563eb;
}
</style>

<!-- Copy đoạn JS này chèn vào thẻ script hoặc ô Javascript của landing page -->
<script>
document.getElementById('landingForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  if (btn) btn.disabled = true;

  const formData = new FormData(this);
  const data = {};

  // Tự động gom các tham số URL hiện có (ví dụ: ?ref=facebook)
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.forEach((val, key) => {
    data[key] = val;
  });

  // Gom thêm dữ liệu điền từ form
  formData.forEach((val, key) => {
    data[key] = val;
  });

  let submitUrl = this.getAttribute('action') || '';
  if (window.location.port === '5173') {
    submitUrl = 'https://api.aetrading.vn' + submitUrl;
  }

  try {
    const res = await fetch(submitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (res.ok && result.success) {
      alert(result.message || 'Cảm ơn bạn! Đăng ký thành công.');
      this.reset();
    } else {
      alert('Lỗi: ' + (result.message || 'Đăng ký thất bại'));
    }
  } catch (err) {
    alert('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
  } finally {
    if (btn) btn.disabled = false;
  }
});
</script>`}
                          />
                        </div>
                      </div>

                      {/* Mẫu 2: Standard HTML Form */}
                      <div className="card border border-slate-200 dark:border-slate-700 shadow-none mb-0">
                        <div className="card-header bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-700 py-3">
                          <h5 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Mẫu 2: HTML Form truyền thống (Chuyển hướng về trang Cảm ơn)</h5>
                        </div>
                        <div className="card-body">
                          <p className="text-xs text-slate-500 mb-3">
                            Mẫu này sử dụng cơ chế submit HTML gốc, chuyển hướng sang trang cảm ơn khi đăng ký thành công.
                          </p>
                          <textarea
                            readOnly
                            onClick={e => (e.target as HTMLTextAreaElement).select()}
                            className="w-full font-mono text-xs h-[220px] bg-slate-950 text-slate-200 p-4 rounded-lg outline-none cursor-pointer"
                            value={`<form action="/api/admin/landing-pages/${id || 'ID_TRANG'}/submit" method="POST">
  <!-- Trang cảm ơn sau khi đăng ký thành công -->
  <input type="hidden" name="redirect_url" value="https://ten-mien-cua-ban.com/thank-you.html" />
  
  <!-- Các trường ẩn để tự động lưu tham số giới thiệu từ URL nếu có -->
  <input type="hidden" id="utm_ref" name="ref" value="" />
  <input type="hidden" id="utm_source" name="utm_source" value="" />

  <input type="text" name="name" required placeholder="Họ và tên" />
  <input type="tel" name="phone" required placeholder="Số điện thoại" />
  
  <button type="submit">Đăng ký ngay</button>
</form>

<script>
  // Tự động gán tham số từ URL vào các input ẩn trước khi gửi đi
  const urlParams = new URLSearchParams(window.location.search);
  if(urlParams.get('ref')) document.getElementById('utm_ref').value = urlParams.get('ref');
  if(urlParams.get('utm_source')) document.getElementById('utm_source').value = urlParams.get('utm_source');
</script>`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LandingPageEdit;
