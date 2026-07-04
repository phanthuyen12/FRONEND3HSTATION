import React from 'react';
import FeatherIcon from 'feather-icons-react';

interface FacebookConnectPopupProps {
  onClose: () => void;
  onConnect: (type: 'page' | 'businessManager') => void;
}

const FacebookConnectPopup: React.FC<FacebookConnectPopupProps> = ({ onClose, onConnect }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-[#0d1412] p-8 rounded-lg shadow-xl border border-white/[0.03] w-96">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Kết nối Facebook</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <FeatherIcon icon="x" size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-400">Chọn loại tài khoản bạn muốn kết nối:</p>
          <button
            onClick={() => onConnect('page')}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0d1412]/5 border border-white/[0.03] hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#FBBF24]/10 text-[#FBBF24] flex items-center justify-center">
                <FeatherIcon icon="flag" size={18} />
              </div>
              <span className="text-[13px] font-bold text-white group-hover:text-[#FBBF24]">Facebook Page</span>
            </div>
            <FeatherIcon icon="chevron-right" size={14} className="text-gray-400 group-hover:text-[#FBBF24]" />
          </button>
          <button
            onClick={() => onConnect('businessManager')}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-[#0d1412]/5 border border-white/[0.03] hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#FBBF24]/10 text-[#FBBF24] flex items-center justify-center">
                <FeatherIcon icon="briefcase" size={18} />
              </div>
              <span className="text-[13px] font-bold text-white group-hover:text-[#FBBF24]">Business Manager</span>
            </div>
            <FeatherIcon icon="chevron-right" size={14} className="text-gray-400 group-hover:text-[#FBBF24]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacebookConnectPopup;
