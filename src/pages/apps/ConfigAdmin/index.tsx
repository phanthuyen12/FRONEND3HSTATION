import React, { useEffect, useState, useRef } from 'react';
import configService, { SystemConfig } from '../../../services/configService';

const defaultConfig: SystemConfig = {
    support_phone: '',
    domain_name: '',
    logo: '',
    header_description: '',
    notification: '',
    commission_rate: '0',
};

const ConfigAdmin: React.FC = () => {
    const [formData, setFormData] = useState<SystemConfig>(defaultConfig);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            setLoading(true);
            const data = await configService.getConfigs();
            setFormData(data);
            if (data.logo) setLogoPreview(data.logo);
        } catch (err: any) {
            setError(err.message || 'Không thể tải cấu hình hệ thống');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'logo') setLogoPreview(value);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            const base64 = ev.target?.result as string;
            setLogoPreview(base64);
            setFormData(prev => ({ ...prev, logo: base64 }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess(null);
        setError(null);
        setSaving(true);
        try {
            await configService.updateConfigs(formData);
            setSuccess('Cấu hình đã được lưu thành công!');
            setTimeout(() => setSuccess(null), 4000);
        } catch (err: any) {
            setError(err.message || 'Lỗi khi lưu cấu hình');
        } finally {
            setSaving(false);
        }
    };

    const commissionExample = (
        1_000_000 * (parseFloat(formData.commission_rate || '0') / 100)
    ).toLocaleString('vi-VN');

    if (loading) {
        return (
            <div className="flex justify-center items-center" style={{ minHeight: 300 }}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary me-3" />
                <span className="text-slate-500">Đang tải cấu hình...</span>
            </div>
        );
    }

    return (
        <>
            {/* Page header */}
            <div className="page-title-box">
                <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                        <li className="breadcrumb-item">
                            <a href="/admin/dashboard">Admin</a>
                        </li>
                        <li className="breadcrumb-item active">Cấu hình hệ thống</li>
                    </ol>
                </div>
                <h4 className="page-title">
                    <i className="mdi mdi-cog-outline me-2 text-primary" />
                    Cấu hình hệ thống
                </h4>
            </div>

            {/* Alerts */}
            {success && (
                <div className="alert alert-success alert-dismissible d-flex align-items-center mb-3" role="alert">
                    <i className="mdi mdi-check-circle-outline me-2 fs-5" />
                    <span>{success}</span>
                    <button type="button" className="btn-close ms-auto" onClick={() => setSuccess(null)} />
                </div>
            )}
            {error && (
                <div className="alert alert-danger alert-dismissible d-flex align-items-center mb-3" role="alert">
                    <i className="mdi mdi-alert-circle-outline me-2 fs-5" />
                    <span>{error}</span>
                    <button type="button" className="btn-close ms-auto" onClick={() => setError(null)} />
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="row">
                    {/* ====== LEFT COLUMN ====== */}
                    <div className="col-xl-8">
                        {/* Card: Thông tin chung */}
                        <div className="card">
                            <div className="card-header bg-light d-flex align-items-center gap-2">
                                <i className="mdi mdi-information-outline fs-5 text-primary" />
                                <h5 className="mb-0">Thông tin chung</h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">
                                            <i className="mdi mdi-phone me-1 text-success" />
                                            Số điện thoại hỗ trợ
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="mdi mdi-phone" />
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="support_phone"
                                                value={formData.support_phone}
                                                onChange={handleChange}
                                                placeholder="VD: 0909 123 456"
                                            />
                                        </div>
                                        <div className="form-text text-muted">
                                            Hiển thị trên header và trang liên hệ
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">
                                            <i className="mdi mdi-domain me-1 text-info" />
                                            Tên miền (Domain)
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="mdi mdi-web" />
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="domain_name"
                                                value={formData.domain_name}
                                                onChange={handleChange}
                                                placeholder="VD: 3hstation.com"
                                            />
                                        </div>
                                        <div className="form-text text-muted">
                                            Tên miền chính của hệ thống
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-semibold">
                                            <i className="mdi mdi-text-box-outline me-1 text-warning" />
                                            Mô tả Header
                                        </label>
                                        <textarea
                                            className="form-control"
                                            rows={3}
                                            name="header_description"
                                            value={formData.header_description}
                                            onChange={handleChange}
                                            placeholder="Mô tả ngắn hiển thị trên header website..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card: Thông báo */}
                        <div className="card mt-3">
                            <div className="card-header bg-light d-flex align-items-center gap-2">
                                <i className="mdi mdi-bell-outline fs-5 text-warning" />
                                <h5 className="mb-0">Thông báo hệ thống</h5>
                            </div>
                            <div className="card-body">
                                <label className="form-label fw-semibold">Nội dung thông báo</label>
                                <textarea
                                    className="form-control"
                                    rows={4}
                                    name="notification"
                                    value={formData.notification}
                                    onChange={handleChange}
                                    placeholder="Nhập thông báo hiển thị cho người dùng (để trống để tắt)..."
                                />
                                <div className="form-text text-muted">
                                    Thông báo sẽ hiển thị dạng banner trên toàn hệ thống. Để trống để ẩn.
                                </div>

                                {/* Preview */}
                                {formData.notification && (
                                    <div className="mt-3">
                                        <span className="text-muted small d-block mb-1">Preview:</span>
                                        <div className="alert alert-warning d-flex align-items-start gap-2 mb-0">
                                            <i className="mdi mdi-bell-ring fs-5 mt-1 flex-shrink-0" />
                                            <span style={{ fontSize: 14 }}>{formData.notification}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Card: Hoa hồng */}
                        <div className="card mt-3">
                            <div className="card-header bg-light d-flex align-items-center gap-2">
                                <i className="mdi mdi-percent fs-5 text-danger" />
                                <h5 className="mb-0">Cài đặt hoa hồng</h5>
                            </div>
                            <div className="card-body">
                                <div className="row align-items-center g-3">
                                    <div className="col-md-5">
                                        <label className="form-label fw-semibold">Tỷ lệ hoa hồng (%)</label>
                                        <div className="input-group">
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="commission_rate"
                                                value={formData.commission_rate}
                                                onChange={handleChange}
                                                placeholder="VD: 10"
                                                min="0"
                                                max="100"
                                                step="0.1"
                                            />
                                            <span className="input-group-text">
                                                <i className="mdi mdi-percent" />
                                            </span>
                                        </div>
                                        <div className="form-text text-muted">
                                            Phần trăm hoa hồng cho đại lý / cộng tác viên
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <div className="bg-light rounded-2 p-3">
                                            <p className="mb-1 text-muted" style={{ fontSize: 12 }}>Ví dụ tính toán</p>
                                            <p className="mb-0 fw-semibold">
                                                Đơn hàng <strong>1.000.000đ</strong> →&nbsp;
                                                Hoa hồng:&nbsp;
                                                <span className="text-success">{commissionExample}đ</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ====== RIGHT COLUMN: Logo ====== */}
                    <div className="col-xl-4">
                        <div className="card" style={{ position: 'sticky', top: 80 }}>
                            <div className="card-header bg-light d-flex align-items-center gap-2">
                                <i className="mdi mdi-image-outline fs-5 text-primary" />
                                <h5 className="mb-0">Logo hệ thống</h5>
                            </div>
                            <div className="card-body text-center">
                                {/* Logo preview box */}
                                <div
                                    className="border rounded-3 d-flex align-items-center justify-content-center mb-3"
                                    style={{
                                        width: '100%',
                                        height: 200,
                                        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {logoPreview ? (
                                        <img
                                            src={logoPreview}
                                            alt="Logo Preview"
                                            style={{ maxWidth: '100%', maxHeight: 180, objectFit: 'contain' }}
                                            onError={() => setLogoPreview('')}
                                        />
                                    ) : (
                                        <div className="text-center text-muted">
                                            <i className="mdi mdi-image-off-outline" style={{ fontSize: 48 }} />
                                            <p className="mt-2 mb-0 small">Chưa có logo</p>
                                        </div>
                                    )}
                                </div>

                                {/* Upload button */}
                                <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm w-100 mb-3"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <i className="mdi mdi-upload me-1" />
                                    Tải lên ảnh logo
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="d-none"
                                    onChange={handleFileChange}
                                />

                                {/* Divider */}
                                <div className="d-flex align-items-center gap-2 my-2">
                                    <hr className="flex-fill" />
                                    <span className="text-muted small">hoặc nhập URL</span>
                                    <hr className="flex-fill" />
                                </div>

                                {/* URL input */}
                                <div className="text-start">
                                    <label className="form-label small fw-semibold">URL Logo</label>
                                    <input
                                        type="url"
                                        className="form-control form-control-sm"
                                        name="logo"
                                        value={formData.logo.startsWith('data:') ? '' : formData.logo}
                                        onChange={handleChange}
                                        placeholder="https://example.com/logo.png"
                                    />
                                    <div className="form-text text-muted">PNG, SVG, JPG — Khuyến nghị nền trong suốt</div>
                                </div>

                                {/* Quick summary */}
                                <div className="mt-4 pt-3 border-top text-start">
                                    <p className="small fw-semibold text-muted mb-2">Tổng quan cài đặt</p>
                                    <div className="d-flex justify-content-between small mb-1">
                                        <span className="text-muted">Điện thoại:</span>
                                        <span className="fw-semibold">{formData.support_phone || '—'}</span>
                                    </div>
                                    <div className="d-flex justify-content-between small mb-1">
                                        <span className="text-muted">Domain:</span>
                                        <span className="fw-semibold">{formData.domain_name || '—'}</span>
                                    </div>
                                    <div className="d-flex justify-content-between small">
                                        <span className="text-muted">Hoa hồng:</span>
                                        <span className="fw-semibold text-success">{formData.commission_rate}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="d-flex justify-content-end gap-2 mt-2 mb-4">
                    <button
                        type="button"
                        className="btn btn-light"
                        onClick={fetchConfigs}
                        disabled={saving || loading}
                    >
                        <i className="mdi mdi-refresh me-1" />
                        Làm mới
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={saving}
                        style={{ minWidth: 160 }}
                    >
                        {saving ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <i className="mdi mdi-content-save me-1" />
                                Lưu cấu hình
                            </>
                        )}
                    </button>
                </div>
            </form>
        </>
    );
};

export default ConfigAdmin;
