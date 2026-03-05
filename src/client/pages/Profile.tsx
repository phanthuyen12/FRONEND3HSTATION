import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageBreadcrumb } from "../../components";
import { authService, userService } from "../../config";
import { User } from "../../services/authService";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [changePasswordMode, setChangePasswordMode] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [refInfo, setRefInfo] = useState<{
    refCode?: string | null;
    refCount?: number;
    refCommission?: number;
    apiToken?: string | null;
  }>({});

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        // Lấy user từ localStorage trước
        const localUser = authService.getUser();
        if (localUser) {
          setUser(localUser);
          setFormData({
            name: localUser.name || "",
            email: localUser.email || "",
            phone: localUser.phone || "",
          });
          setRefInfo({
            refCode: (localUser as any).refCode || (localUser as any).ref_code,
            refCount: (localUser as any).refCount || (localUser as any).ref_count,
            refCommission: (localUser as any).refCommission || (localUser as any).ref_commission,
            apiToken: (localUser as any).apiToken || (localUser as any).api_token,
          });
        }

        // Nếu có API getProfile, gọi để lấy thông tin mới nhất
        try {
          const profileData = await authService.getProfile();
          if (profileData) {
            setUser(profileData);
            setFormData({
              name: profileData.name || "",
              email: profileData.email || "",
              phone: profileData.phone || "",
            });
            setRefInfo({
              refCode: (profileData as any).refCode || (profileData as any).ref_code,
              refCount: (profileData as any).refCount || (profileData as any).ref_count,
              refCommission: (profileData as any).refCommission || (profileData as any).ref_commission,
              apiToken: (profileData as any).apiToken || (profileData as any).api_token,
            });
            // Cập nhật localStorage
            localStorage.setItem('auth_user', JSON.stringify(profileData));
          }
        } catch (error) {
          // Nếu API không có, dùng dữ liệu từ localStorage
          // eslint-disable-next-line no-console
          console.log("Using local user data");
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Không thể tải profile", error);
      } finally {
        setLoading(false);
      }
    };

    if (authService.isAuthenticated()) {
      loadProfile();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async () => {
    if (!user?.id) return;

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      await Swal.fire({
        icon: 'warning',
        title: 'Tên không hợp lệ',
        text: 'Tên phải có ít nhất 2 ký tự.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    try {
      setSaving(true);
      // Cập nhật profile qua authService
      const updated = await authService.updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim() || undefined,
      });

      // Cập nhật state
      setUser(updated);

      await Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Đã cập nhật thông tin cá nhân.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#10b981',
      });
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("Cập nhật profile thất bại", error);
      await Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error?.message || 'Không thể cập nhật thông tin. Vui lòng thử lại.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword) {
      await Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin',
        text: 'Vui lòng nhập mật khẩu hiện tại.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      await Swal.fire({
        icon: 'warning',
        title: 'Mật khẩu mới không hợp lệ',
        text: 'Mật khẩu mới phải có ít nhất 6 ký tự.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      await Swal.fire({
        icon: 'warning',
        title: 'Mật khẩu không khớp',
        text: 'Mật khẩu xác nhận không khớp với mật khẩu mới.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    try {
      setSaving(true);
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      await Swal.fire({
        icon: 'success',
        title: 'Đổi mật khẩu thành công',
        text: 'Mật khẩu của bạn đã được thay đổi thành công.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#10b981',
      });

      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setChangePasswordMode(false);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("Đổi mật khẩu thất bại", error);
      await Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error?.message || 'Không thể đổi mật khẩu. Vui lòng thử lại.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: 'question',
      title: 'Xác nhận đăng xuất',
      text: 'Bạn có chắc chắn muốn đăng xuất?',
      showCancelButton: true,
      confirmButtonText: 'Đăng xuất',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
    });

    if (!result.isConfirmed) return;

    try {
      await authService.logout();
      await Swal.fire({
        icon: 'success',
        title: 'Đã đăng xuất',
        text: 'Bạn đã đăng xuất thành công.',
        confirmButtonText: 'Đã hiểu',
        confirmButtonColor: '#10b981',
      });
      navigate("/");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Đăng xuất thất bại", error);
    }
  };

  if (loading) {
    return (
      <>
        <PageBreadcrumb
          name="Đang tải..."
          title="Hồ sơ cá nhân"
          breadCrumbItems={["Client", "Hồ sơ cá nhân"]}
        />
        <div className="card">
          <div className="p-6 text-center text-slate-600">
            Đang tải thông tin...
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <PageBreadcrumb
        name="Hồ sơ cá nhân"
        title="Hồ sơ cá nhân"
        breadCrumbItems={["Client", "Hồ sơ cá nhân"]}
      />

      <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
        <div className="card">
          <div className="p-6 flex flex-col items-center text-center gap-3">
            <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center text-2xl font-semibold text-amber-600">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">{user.name}</h3>
              <p className="text-xs text-slate-500 mb-2">{user.email}</p>
            </div>
            <div className="w-full border-t border-slate-100 pt-4 mt-2 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Số điện thoại:</span>
                  <span className="font-medium">{user.phone}</span>
                </div>
              )}
              {user.role && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Vai trò:</span>
                  <span className="font-medium">
                    {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                  </span>
                </div>
              )}
              {refInfo.apiToken && (
                <div className="flex justify-between items-center mt-2 group">
                  <span className="text-slate-500">API Token:</span>
                  <div className="flex gap-1 items-center">
                    <span className="font-mono text-[10px] break-all max-w-[120px] truncate" title={refInfo.apiToken}>
                      {refInfo.apiToken.substring(0, 15)}...
                    </span>
                    <button
                      onClick={() => {
                        if (refInfo.apiToken) {
                          navigator.clipboard.writeText(refInfo.apiToken);
                          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã copy', showConfirmButton: false, timer: 1500 });
                        }
                      }}
                      className="text-primary hover:text-primary-dark transition-colors"
                      title="Copy Token"
                    >
                      <i className="mgc_copy_line text-sm border p-0.5 rounded shadow-sm bg-slate-50"></i>
                    </button>
                  </div>
                </div>
              )}
              {refInfo.refCode && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mã giới thiệu:</span>
                    <span className="font-mono text-xs break-all">{refInfo.refCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Số người đã giới thiệu:</span>
                    <span className="font-medium">{refInfo.refCount ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tổng hoa hồng:</span>
                    <span className="font-medium">{(refInfo.refCommission ?? 0).toLocaleString('vi-VN')} đ</span>
                  </div>
                </>
              )}
            </div>
            <button
              type="button"
              className="btn btn-sm bg-rose-50 text-rose-600 w-full mt-4"
              onClick={handleLogout}
            >
              <i className="mgc_logout_line mr-1" />
              Đăng xuất
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Card Tiếp thị liên kết */}
          <div className="card border-2 border-primary/20">
            <div className="card-header bg-gradient-to-r from-primary/10 to-purple-500/10">
              <h4 className="card-title mb-0 flex items-center gap-2">
                <i className="mgc_share_line text-primary text-xl"></i>
                Tiếp thị liên kết
              </h4>
            </div>
            <div className="p-6 space-y-4">
              {/* Thống kê */}
              <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Số tiền đã nhận</span>
                    <i className="mgc_money_2_line text-green-600 text-lg"></i>
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {(refInfo.refCommission ?? 0).toLocaleString('vi-VN')} đ
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Số người đã giới thiệu</span>
                    <i className="mgc_user_group_line text-blue-600 text-lg"></i>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {refInfo.refCount ?? 0}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Tỷ lệ hoa hồng</span>
                    <i className="mgc_percent_line text-purple-600 text-lg"></i>
                  </div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    30%
                  </div>
                </div>
              </div>

              {/* Chính sách */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <i className="mgc_info_line text-amber-600 text-xl mt-0.5"></i>
                  <div className="flex-1">
                    <h5 className="font-semibold text-amber-900 dark:text-amber-200 mb-1">Chính sách tiếp thị liên kết</h5>
                    <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1 list-disc list-inside">
                      <li>Bạn sẽ nhận <strong>30% giá trị đơn hàng</strong> khi người được giới thiệu phát sinh giao dịch thành công</li>
                      <li>Hoa hồng được cộng trực tiếp vào số dư tài khoản của bạn</li>
                      <li>Hoa hồng được tính ngay sau khi đơn hàng được thanh toán thành công</li>
                      <li>Không giới hạn số lượng người giới thiệu</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Link giới thiệu */}
              {refInfo.refCode ? (
                <div className="space-y-2">
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-medium block">
                    Link giới thiệu của bạn
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="form-input flex-1 text-sm font-mono"
                      readOnly
                      value={`${window.location.origin}/register?ref=${encodeURIComponent(refInfo.refCode)}`}
                    />
                    <button
                      type="button"
                      className="btn bg-primary text-white whitespace-nowrap"
                      onClick={async () => {
                        const refLink = `${window.location.origin}/register?ref=${encodeURIComponent(refInfo.refCode || '')}`;
                        try {
                          await navigator.clipboard.writeText(refLink);
                          await Swal.fire({
                            icon: 'success',
                            title: 'Đã sao chép!',
                            text: 'Link giới thiệu đã được sao chép vào clipboard',
                            timer: 2000,
                            timerProgressBar: true,
                            confirmButtonColor: '#10b981',
                          });
                        } catch (error) {
                          // Fallback cho trình duyệt cũ
                          const textArea = document.createElement('textarea');
                          textArea.value = refLink;
                          document.body.appendChild(textArea);
                          textArea.select();
                          document.execCommand('copy');
                          document.body.removeChild(textArea);
                          await Swal.fire({
                            icon: 'success',
                            title: 'Đã sao chép!',
                            text: 'Link giới thiệu đã được sao chép',
                            timer: 2000,
                            timerProgressBar: true,
                            confirmButtonColor: '#10b981',
                          });
                        }
                      }}
                    >
                      <i className="mgc_copy_line mr-1"></i>
                      Sao chép link
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <i className="mgc_qr_code_line"></i>
                    <span>Mã giới thiệu: <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-mono">{refInfo.refCode}</code></span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-center">
                  <i className="mgc_loading_line text-2xl text-slate-400 mb-2"></i>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Đang tạo mã giới thiệu cho bạn...
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Thông tin cơ bản</h4>
            </div>
            <div className="p-6 grid md:grid-cols-2 grid-cols-1 gap-4 text-sm">
              <div>
                <label className="text-slate-500 text-xs mb-1 block">
                  Họ và tên <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleFieldChange}
                  disabled={saving}
                />
              </div>
              <div>
                <label className="text-slate-500 text-xs mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  disabled
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Email không thể thay đổi
                </p>
              </div>
              <div>
                <label className="text-slate-500 text-xs mb-1 block">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleFieldChange}
                  placeholder="Nhập số điện thoại"
                  disabled={saving}
                />
              </div>
            </div>
            <div className="card-footer">
              <button
                type="button"
                className="btn bg-primary text-white disabled:opacity-60"
                onClick={handleUpdateProfile}
                disabled={saving}
              >
                {saving ? "Đang lưu..." : "Lưu thông tin"}
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header flex items-center justify-between">
              <h4 className="card-title mb-0">Đổi mật khẩu</h4>
              {!changePasswordMode && (
                <button
                  type="button"
                  className="btn btn-sm bg-slate-100 text-xs"
                  onClick={() => setChangePasswordMode(true)}
                >
                  Đổi mật khẩu
                </button>
              )}
            </div>
            {changePasswordMode && (
              <div className="p-6 space-y-4 text-sm">
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">
                    Mật khẩu hiện tại <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      name="currentPassword"
                      className="form-input pr-10"
                      placeholder="Nhập mật khẩu hiện tại"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      disabled={saving}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    >
                      <i className={showPasswords.current ? "mgc_eye_off_line" : "mgc_eye_line"} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">
                    Mật khẩu mới <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="newPassword"
                      className="form-input pr-10"
                      placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      disabled={saving}
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    >
                      <i className={showPasswords.new ? "mgc_eye_off_line" : "mgc_eye_line"} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-slate-500 text-xs mb-1 block">
                    Xác nhận mật khẩu mới <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      name="confirmPassword"
                      className="form-input pr-10"
                      placeholder="Nhập lại mật khẩu mới"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      disabled={saving}
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    >
                      <i className={showPasswords.confirm ? "mgc_eye_off_line" : "mgc_eye_line"} />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn bg-primary text-white disabled:opacity-60"
                    onClick={handleChangePassword}
                    disabled={saving}
                  >
                    {saving ? "Đang lưu..." : "Lưu mật khẩu mới"}
                  </button>
                  <button
                    type="button"
                    className="btn bg-slate-100 text-slate-700"
                    onClick={() => {
                      setChangePasswordMode(false);
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                    disabled={saving}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
