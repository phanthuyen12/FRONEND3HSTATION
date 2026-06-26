
import { useSearchParams } from "react-router-dom";
import adminFacebookService from "../../../../services/adminFacebookService";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { PageBreadcrumb } from "../../../../components";

interface FbPage {
  id: number;
  pageId: string;
  pageName: string;
  avatarUrl?: string;
  status: string; // 'connected' | 'disconnected'
  difyApiKey?: string;
  difyApiUrl?: string;
  aiEnabled?: number;
  salesEngineEnabled?: number;
  followUpMessage?: string;
}

interface FbPost {
  id: string;
  message: string;
  created_time: string;
  permalink_url?: string;
  full_picture?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  views?: number | null;
  viewsSource?: "video_views" | "post_insights" | "unavailable";
  engagements?: number;
  impressions?: number | null;
  reach?: number | null;
  engagedUsers?: number | null;
}

interface FbLead {
  id: number | string;
  lead_id?: number | string;
  pageId: string;
  facebookUserId: string;
  difyConversationId?: string;
  leadStatus: string;
  lead_status?: string;
  aiEnabled: number;
  ai_enabled?: number;
  notes?: string;
  phone?: string;
  courseInterest?: string;
  course_interest?: string;
  lastMessageSender?: string;
  lastMessageAt?: string;
  followUpSent: number;
  customer_avatar?: string;
  customer_name?: string;
  customer_id?: string;
  profile_link?: string;
  tags?: string;
  sale_agent?: string;
  updated_time?: string;
  last_message?: string;
}

interface FbChatLog {
  id: number | string;
  pageId?: string;
  facebookUserId?: string;
  messageUser?: string;
  messageBot?: string;
  messageAdmin?: string;
  difyConversationId?: string;
  leadStatus?: string;
  createdAt?: string;
  message?: string;
  from_id?: string;
  from_name?: string;
  created_time?: string;
}

interface FacebookCrmRealtimePayload {
  type: "FACEBOOK_CRM_MESSAGE";
  event: "incoming" | "outgoing";
  source: "user" | "bot" | "admin";
  pageId: string;
  facebookUserId: string;
  leadId?: number | string | null;
  leadStatus?: string | null;
  aiEnabled?: number | null;
  message: string;
  created_time: string;
}

const statusLabel: Record<string, string> = {
  connected: "Đã kết nối",
  disconnected: "Chưa kết nối",
};

const statusColor: Record<string, string> = {
  connected: "bg-emerald-100 text-emerald-700 border-emerald-200",
  disconnected: "bg-slate-100 text-slate-600 border-slate-200",
};

const leadStatusColor: Record<string, string> = {
  new_lead: "bg-slate-100 text-slate-700 border-slate-200",
  asked_course: "bg-sky-100 text-sky-700 border-sky-200",
  asked_level: "bg-indigo-100 text-indigo-700 border-indigo-200",
  asked_budget: "bg-amber-100 text-amber-700 border-amber-200",
  asked_phone: "bg-teal-100 text-teal-700 border-teal-200",
  ready_to_handoff: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const leadStatusLabel: Record<string, string> = {
  new_lead: "Mới tiếp cận",
  asked_course: "Hỏi khóa học",
  asked_level: "Hỏi trình độ",
  asked_budget: "Hỏi học phí",
  asked_phone: "Có SĐT",
  ready_to_handoff: "Sẵn sàng bàn giao",
};


// --- SUB-COMPONENTS FOR PERFORMANCE ---
import React, { useEffect, useMemo, useRef, useState } from "react";

const ChatInputArea = React.memo(({ onSend }: { onSend: (msg: string) => Promise<void> }) => {
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!msg.trim() || sending) return;
    setSending(true);
    try {
      await onSend(msg);
      setMsg("");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex gap-2 z-10 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
      <input
        type="text"
        placeholder="Gõ tin nhắn phản hồi thủ công... (Gửi đi sẽ tự động tắt AI)"
        className="form-input text-sm border-slate-200 rounded-full bg-slate-100 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 py-2.5 px-4 w-full focus:ring-0 focus:border-blue-400 transition-all outline-none"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        disabled={sending}
      />
      <button 
        type="submit" 
        className="btn bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-full text-sm flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={sending || !msg.trim()}
      >
        {sending ? <i className="mgc_loading_4_line animate-spin text-sm"></i> : <i className="mgc_send_line text-sm"></i>}
        Gửi
      </button>
    </form>
  );
});

const CrmDetailsPanel = React.memo(({
  selectedLead,
  onSave,
  dbTags,
  dbAgents,
  getAgentColor,
  getTagColor
}: any) => {
  const [crmStatus, setCrmStatus] = useState("new_lead");
  const [crmPhone, setCrmPhone] = useState("");
  const [crmCourse, setCrmCourse] = useState("");
  const [crmNotes, setCrmNotes] = useState("");
  const [crmTags, setCrmTags] = useState("");
  const [crmSaleAgent, setCrmSaleAgent] = useState("");
  const [savingCrm, setSavingCrm] = useState(false);

  useEffect(() => {
    if (selectedLead) {
      setCrmStatus(selectedLead.lead_status || selectedLead.leadStatus || "new_lead");
      setCrmPhone(selectedLead.phone || "");
      setCrmCourse(selectedLead.course_interest || selectedLead.courseInterest || "");
      setCrmNotes(selectedLead.notes || "");
      setCrmTags(selectedLead.tags || "");
      setCrmSaleAgent(selectedLead.sale_agent || selectedLead.saleAgent || "");
    }
  }, [selectedLead]);

  const handleSave = async () => {
    if (savingCrm) return;
    setSavingCrm(true);
    try {
      await onSave({
        leadStatus: crmStatus,
        phone: crmPhone,
        courseInterest: crmCourse,
        notes: crmNotes,
        tags: crmTags,
        saleAgent: crmSaleAgent
      });
    } finally {
      setSavingCrm(false);
    }
  };

  return (
    <div className="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center gap-2 sticky top-0 bg-white dark:bg-slate-800 z-10 pt-1">
        <i className="mgc_folder_2_line text-blue-500"></i> Hồ sơ khách hàng CRM
      </h4>

      {/* PROFILE CARD */}
      <div className="flex flex-col items-center p-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/40 dark:to-slate-800/10 rounded-xl border border-slate-100 dark:border-slate-700 text-center gap-2 shadow-sm">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 overflow-hidden border-4 border-white dark:border-slate-700 shadow-sm flex items-center justify-center relative">
          {selectedLead.customer_avatar ? (
            <img src={selectedLead.customer_avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-indigo-600 font-bold text-3xl">
              {selectedLead.customer_name ? selectedLead.customer_name.charAt(0).toUpperCase() : "?"}
            </span>
          )}
        </div>
        <div>
          <div className="font-bold text-base text-slate-800 dark:text-slate-200 mt-1">
            {selectedLead.customer_name || "Khách hàng"}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 font-medium">ID: {selectedLead.customer_id}</div>
        </div>
        {selectedLead.profile_link && (
          <a
            href={selectedLead.profile_link}
            target="_blank"
            rel="noreferrer"
            className="btn bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 text-xs py-1.5 px-3 rounded-full shadow-sm inline-flex items-center gap-1 mt-1 font-medium text-slate-700 dark:text-slate-300"
          >
            <i className="mgc_facebook_fill text-blue-600 text-sm"></i> Xem Facebook
          </a>
        )}
      </div>

      <div className="space-y-3.5 bg-white dark:bg-slate-900 rounded-xl">
        {/* Fanpage ID */}
        <div>
          <label className="text-xs text-slate-500 font-semibold block mb-1">Fanpage nhận</label>
          <div className="text-xs text-slate-700 dark:text-slate-300 font-mono bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700 truncate shadow-inner">
            <i className="mgc_flag_3_fill text-blue-500 mr-1 inline-block align-text-bottom"></i> {selectedLead.pageId}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="text-xs text-slate-500 font-semibold block mb-1">Số điện thoại</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <i className="mgc_phone_line text-slate-400 text-sm"></i>
            </div>
            <input
              type="text"
              className="form-input text-sm border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 rounded-lg py-2 pl-8 w-full focus:border-blue-400 focus:ring-0 transition-colors"
              placeholder="Nhập SĐT..."
              value={crmPhone}
              onChange={(e) => setCrmPhone(e.target.value)}
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="text-xs text-slate-500 font-semibold block mb-1.5">Nhãn phân loại</label>
          <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 max-h-[140px] overflow-y-auto custom-scrollbar shadow-inner">
            {dbTags.length === 0 ? (
              <span className="text-xs text-slate-400 italic">Chưa cấu hình nhãn.</span>
            ) : (
              dbTags.map((tag: any) => {
                const isChecked = crmTags.split(',').map((t: string) => t.trim().toLowerCase()).includes(tag.name.trim().toLowerCase());
                return (
                  <label 
                    key={tag.id} 
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer border text-white transition-all select-none hover:opacity-90 shadow-sm"
                    style={{ backgroundColor: tag.color, borderColor: tag.color, opacity: isChecked ? 1 : 0.4 }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      className="hidden"
                      onChange={(e) => {
                        let tagList = crmTags.split(',').map((t: string) => t.trim()).filter(Boolean);
                        if (e.target.checked) {
                          if (!tagList.some((t: string) => t.toLowerCase() === tag.name.toLowerCase())) {
                            tagList.push(tag.name);
                          }
                        } else {
                          tagList = tagList.filter((t: string) => t.toLowerCase() !== tag.name.toLowerCase());
                        }
                        setCrmTags(tagList.join(', '));
                      }}
                    />
                    {isChecked && <i className="mgc_check_line text-xs"></i>}
                    {tag.name}
                  </label>
                );
              })
            )}
          </div>
        </div>

        {/* Sale Agent */}
        <div>
          <label className="text-xs text-slate-500 font-semibold block mb-1">Phân chia Sale</label>
          <select
            className="form-select text-sm border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg py-2 w-full font-bold focus:border-blue-400 transition-colors"
            value={crmSaleAgent}
            onChange={(e) => setCrmSaleAgent(e.target.value)}
            style={{ color: getAgentColor(crmSaleAgent) }}
          >
            <option value="" style={{ color: '#94a3b8' }}>Chưa phân công</option>
            {dbAgents.map((agent: any) => (
              <option key={agent.id} value={agent.name} style={{ color: agent.color, fontWeight: 'bold' }}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>

        {/* Course */}
        <div>
          <label className="text-xs text-slate-500 font-semibold block mb-1">Khóa học quan tâm</label>
          <select
            className="form-select text-sm border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 rounded-lg py-2 w-full focus:border-blue-400 transition-colors"
            value={crmCourse}
            onChange={(e) => setCrmCourse(e.target.value)}
          >
            <option value="">Chưa xác định</option>
            <option value="Trading">Trading tài chính</option>
            <option value="AI">AI / Trí tuệ nhân tạo</option>
            <option value="Marketing">Marketing & Ads</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="text-xs text-slate-500 font-semibold block mb-1">Trạng thái CRM</label>
          <select
            className="form-select text-sm border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 rounded-lg py-2 w-full focus:border-blue-400 transition-colors font-medium"
            value={crmStatus}
            onChange={(e) => setCrmStatus(e.target.value)}
          >
            <option value="new_lead">Mới tiếp cận</option>
            <option value="asked_course">Hỏi khóa học</option>
            <option value="asked_level">Hỏi trình độ</option>
            <option value="asked_budget">Hỏi học phí</option>
            <option value="asked_phone">Đã có SĐT</option>
            <option value="ready_to_handoff">Sẵn sàng bàn giao</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs text-slate-500 font-semibold block mb-1">Ghi chú hỗ trợ</label>
          <textarea
            rows={3}
            className="form-input text-sm border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 rounded-lg py-2 w-full focus:border-blue-400 transition-colors custom-scrollbar"
            placeholder="Nhập ghi chú chi tiết..."
            value={crmNotes}
            onChange={(e) => setCrmNotes(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="btn bg-blue-600 hover:bg-blue-700 text-white w-full py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
          disabled={savingCrm}
        >
          {savingCrm ? (
            <i className="mgc_loading_4_line animate-spin text-base"></i>
          ) : (
            <i className="mgc_save_line text-base"></i>
          )}
          Lưu hồ sơ CRM
        </button>
      </div>
    </div>
  );
});

const LeadListItem = React.memo(({ 
  lead, 
  isSelected, 
  onClick, 
  getAgentColor, 
  getTagColor,
  leadStatusColor,
  leadStatusLabel
}: any) => {
  const avatarFallback = lead.customer_name ? lead.customer_name.charAt(0).toUpperCase() : (lead.customer_id ? lead.customer_id.charAt(0).toUpperCase() : "?");
  
  return (
    <div
      onClick={() => onClick(lead)}
      className={`p-3.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex gap-3.5 border-b border-slate-100 dark:border-slate-800/40 last:border-0 ${
        isSelected ? "bg-blue-50/50 dark:bg-slate-800 border-l-4 border-blue-500 pl-[10px]" : ""
      }`}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-blue-50 overflow-hidden flex-shrink-0 flex items-center justify-center border border-indigo-100 shadow-sm">
          {lead.customer_avatar ? (
            <img src={lead.customer_avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-indigo-600 font-bold text-xl">{avatarFallback}</span>
          )}
        </div>
        {/* Online Indicator if AI enabled */}
        {lead.ai_enabled === 1 && (
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></span>
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex justify-between items-start mb-0.5 gap-2">
          <div className="font-bold text-slate-800 dark:text-slate-200 truncate text-sm">
            {lead.customer_name || lead.customer_id}
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            {lead.sale_agent && (
              <span 
                className="px-1.5 py-0.5 rounded text-white text-[10px] font-bold shadow-sm leading-none"
                style={{ backgroundColor: getAgentColor(lead.sale_agent) }}
              >
                {lead.sale_agent}
              </span>
            )}
          </div>
        </div>
        
        <div className="text-xs text-slate-500 flex justify-between items-center mt-0.5">
          <span className="truncate pr-2 font-medium text-slate-600 dark:text-slate-400">
            {lead.last_message ? lead.last_message : (lead.phone ? `📞 ${lead.phone}` : "Chưa có cuộc trò chuyện")}
          </span>
          {lead.updated_time && (
            <span className="text-[10px] text-slate-400 flex-shrink-0">
              {new Date(lead.updated_time).toLocaleTimeString("vi-VN", {hour: '2-digit', minute: '2-digit'})}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center mt-2">
           <span className={`text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap font-semibold ${leadStatusColor[lead.lead_status] || leadStatusColor.new_lead}`}>
              {leadStatusLabel[lead.lead_status] || lead.lead_status}
            </span>
            
          {/* Display tags in list */}
          {lead.tags && (
            <div className="flex flex-wrap gap-1 justify-end max-w-[120px] overflow-hidden h-[18px]">
              {lead.tags.split(',').slice(0, 2).map((tag: string, idx: number) => {
                const tColor = getTagColor(tag);
                return (
                  <span 
                    key={idx} 
                    className="text-[9px] px-1.5 py-0.5 rounded font-bold text-white shadow-sm leading-none"
                    style={{ backgroundColor: tColor }}
                  >
                    {tag.trim()}
                  </span>
                );
              })}
              {lead.tags.split(',').length > 2 && <span className="text-[9px] text-slate-400 font-bold">...</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

const ChatHistoryWindow = React.memo(({ chatHistory, filterPageId, selectedLead, loadingChat }: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto bg-[#e5ddd5] dark:bg-slate-900 space-y-3 flex flex-col custom-scrollbar pb-6 relative">
      {/* Nền dạng Zalo/WhatsApp */}
      <div className="absolute inset-0 opacity-40 dark:opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')", backgroundSize: 'cover' }}></div>
      
      <div className="relative z-10 flex-1 flex flex-col space-y-3">
        {loadingChat ? (
          <div className="my-auto text-center text-slate-500 bg-white/80 dark:bg-slate-800/80 p-3 rounded-full mx-auto backdrop-blur-sm text-sm shadow-sm font-medium">
            <i className="mgc_loading_4_line animate-spin text-lg align-text-bottom mr-1"></i>
            Đang tải tin nhắn...
          </div>
        ) : chatHistory.length === 0 ? (
          <div className="my-auto text-center text-slate-500 bg-white/80 dark:bg-slate-800/80 p-6 rounded-2xl mx-auto backdrop-blur-sm flex flex-col items-center shadow-sm">
            <div className="w-14 h-14 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mb-3 shadow-sm text-blue-500">
              <i className="mgc_chat_3_line text-2xl"></i>
            </div>
            <span className="font-medium">Chưa có tin nhắn nào.</span>
            <span className="text-xs text-slate-400 mt-1">Hãy bắt đầu cuộc trò chuyện.</span>
          </div>
        ) : (
          chatHistory.map((msg: any, index: number) => {
            const isFromPage = msg.from_id === filterPageId;
            const showAvatar = index === chatHistory.length - 1 || chatHistory[index + 1]?.from_id !== msg.from_id;
            
            return (
              <div 
                key={msg.id} 
                className={`flex gap-2 max-w-[80%] ${isFromPage ? 'self-end flex-row-reverse' : 'self-start flex-row'}`}
              >
                {!isFromPage && showAvatar ? (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-100 to-blue-50 overflow-hidden flex-shrink-0 mt-auto border border-white shadow-sm self-end mb-1">
                     {selectedLead?.customer_avatar ? (
                       <img src={selectedLead.customer_avatar} alt="avt" className="w-full h-full object-cover" />
                     ) : (
                       <span className="flex items-center justify-center h-full text-indigo-500 font-bold text-xs">{selectedLead?.customer_name?.charAt(0) || '?'}</span>
                     )}
                  </div>
                ) : (
                  <div className="w-7 flex-shrink-0"></div>
                )}
                
                <div className={`flex flex-col ${isFromPage ? 'items-end' : 'items-start'}`}>
                  <div className={`px-3.5 py-2 text-[14.5px] shadow-[0_1px_2px_rgba(0,0,0,0.15)] relative break-words whitespace-pre-wrap leading-relaxed ${
                    isFromPage 
                      ? 'bg-[#dcf8c6] dark:bg-blue-600 text-slate-800 dark:text-white rounded-2xl rounded-tr-sm' 
                      : 'bg-white border border-transparent dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-2xl rounded-tl-sm'
                  }`}>
                    {isFromPage && msg.messageBot && (
                      <span className="absolute -top-2.5 -left-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-white dark:border-slate-800 tracking-wide z-10">AI</span>
                    )}
                    {msg.message}
                    <div className={`text-[9px] mt-1 font-medium flex items-center justify-end gap-1 opacity-70 ${isFromPage ? 'text-emerald-700 dark:text-blue-200' : 'text-slate-400'}`}>
                      {new Date(msg.created_time).toLocaleTimeString("vi-VN", {hour: '2-digit', minute: '2-digit'})}
                      {isFromPage && <i className="mgc_check_double_line text-[10px]"></i>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});

const FacebookPosts: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const pageParam = searchParams.get("page");

  const debugPostsLog = (step: string, payload?: unknown) => {
    if (!import.meta.env.DEV) return;
    console.log(`[FacebookPosts] ${step}`, payload ?? "");
  };

  const formatFullNumber = (value?: number | null) => {
    const safeValue = Number(value ?? 0);
    if (!Number.isFinite(safeValue)) return "0";
    return safeValue.toLocaleString("vi-VN");
  };

  const formatCompactNumber = (value?: number | null) => {
    const safeValue = Number(value ?? 0);
    if (!Number.isFinite(safeValue)) return "0";
    return new Intl.NumberFormat("vi-VN", {
      notation: "compact",
      maximumFractionDigits: safeValue >= 100000 ? 0 : 1,
    }).format(safeValue);
  };

  const getViewsTitle = (post: FbPost) => {
    const sourceLabel: Record<string, string> = {
      video_views: "Nguồn: video/Reel views",
      post_insights: "Nguồn: post insights",
      unavailable: "Bài viết này không có view count công khai từ Meta API",
    };

    if (post.views == null) {
      return sourceLabel[post.viewsSource || "unavailable"];
    }

    return `${formatFullNumber(post.views)} lượt xem - ${sourceLabel[post.viewsSource || "video_views"]}`;
  };

  const formatViewsCell = (post: FbPost) => {
    if (post.views == null) return "--";
    return formatFullNumber(post.views);
  };

  const formatDateTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Custom scrollbar style injection
  useEffect(() => {
    if (!document.getElementById('crm-chat-styles')) {
      const style = document.createElement('style');
      style.id = 'crm-chat-styles';
      style.innerHTML = `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
        
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; }
        .dark .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #64748b; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Tabs: 'posts' | 'crm_chat' | 'tags_agents'
  const [activeTab, setActiveTab] = useState<"posts" | "crm_chat" | "tags_agents">(
    (tabParam as "posts" | "crm_chat" | "tags_agents") ||
    (localStorage.getItem("fb_active_tab") as "posts" | "crm_chat" | "tags_agents") ||
    "posts"
  );

  const updateRouteParams = (nextTab: string, nextPageId?: string) => {
    setSearchParams((current) => {
      const params = new URLSearchParams(current);
      params.set("tab", nextTab);

      if (nextPageId) {
        params.set("page", nextPageId);
      } else {
        params.delete("page");
      }

      return params;
    }, { replace: true });
  };

  const [pages, setPages] = useState<FbPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<FbPage | null>(null);
  const [pageDetails, setPageDetails] = useState<any>(null);
  const [posts, setPosts] = useState<FbPost[]>([]);
  const [loadingPages, setLoadingPages] = useState<boolean>(false);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(false);
  const [since, setSince] = useState<string>("");
  const [until, setUntil] = useState<string>("");
  const [sort, setSort] = useState<string>("created_time");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewingPost, setViewingPost] = useState<FbPost | null>(null);
  const pageSize = 10;
  const latestPostsRequestIdRef = useRef(0);
  const hasMountedSortEffectRef = useRef(false);
  const lastFetchedChatKeyRef = useRef<string>("");
  const realtimeChatRefreshTimeoutRef = useRef<number | null>(null);

  // CRM Chat States
  const [leads, setLeads] = useState<FbLead[]>([]);
  const [selectedLead, setSelectedLead] = useState<FbLead | null>(null);
  const [chatHistory, setChatHistory] = useState<FbChatLog[]>([]);
  const [loadingLeads, setLoadingLeads] = useState<boolean>(false);
  const [loadingChat, setLoadingChat] = useState<boolean>(false);
  
  // Search / Filters CRM
  const [searchLeadQuery, setSearchLeadQuery] = useState<string>("");
  const [filterPageId, setFilterPageId] = useState<string>("");
  
  // Admin Reply Inputs
  const [replyMessage, setReplyMessage] = useState<string>("");
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);

  // CRM Details Edit Form
  const [crmStatus, setCrmStatus] = useState<string>("new_lead");
  const [crmPhone, setCrmPhone] = useState<string>("");
  const [crmCourse, setCrmCourse] = useState<string>("");
  const [crmNotes, setCrmNotes] = useState<string>("");
  const [crmTags, setCrmTags] = useState<string>("");
  const [crmSaleAgent, setCrmSaleAgent] = useState<string>("");
  const [savingCrm, setSavingCrm] = useState<boolean>(false);

  // Tags/Agents settings states
  const [dbTags, setDbTags] = useState<any[]>([]);
  const [dbAgents, setDbAgents] = useState<any[]>([]);
  const [newTagName, setNewTagName] = useState<string>("");
  const [newTagColor, setNewTagColor] = useState<string>("#3b82f6");
  const [newAgentName, setNewAgentName] = useState<string>("");
  const [newAgentColor, setNewAgentColor] = useState<string>("#8b5cf6");

  const buildPostsQueryParams = () => {
    const params = new URLSearchParams();
    const shouldFetchAll = Boolean(since || until);
    const shouldIncludeViews = !shouldFetchAll || sort === "views";

    if (since) params.set("since", since);
    if (until) params.set("until", until);
    params.set("sort", sort);
    params.set("limit", shouldFetchAll ? "500" : "100");
    params.set("includeViews", shouldIncludeViews ? "1" : "0");

    if (shouldFetchAll) {
      params.set("fetchAll", "1");
    }

    return `?${params.toString()}`;
  };

  useEffect(() => {
    localStorage.setItem("fb_active_tab", activeTab);
    const currentTab = searchParams.get("tab");
    const currentPage = searchParams.get("page") || filterPageId || selectedPage?.pageId || "";
    if (currentTab !== activeTab) {
      updateRouteParams(activeTab, currentPage);
    }
  }, [activeTab, filterPageId, selectedPage, searchParams]);

  useEffect(() => {
    if (tabParam && (tabParam === "posts" || tabParam === "crm_chat" || tabParam === "tags_agents")) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    if (!pages.length) return;
    if (!pageParam) return;

    const matchedPage = pages.find((page) => page.pageId === pageParam);
    if (matchedPage && matchedPage.pageId !== selectedPage?.pageId) {
      setSelectedPage(matchedPage);
      setFilterPageId(matchedPage.pageId);
      localStorage.setItem("fb_selected_page_id", matchedPage.pageId);
    }
  }, [pageParam, pages, selectedPage]);

  const applyPageSelection = (page: FbPage | null) => {
    setSelectedPage(page);
    setFilterPageId(page?.pageId || "");
    setPageDetails(null);
    setPosts([]);
    setCurrentPage(1);

    if (page?.pageId) {
      localStorage.setItem("fb_selected_page_id", page.pageId);
    } else {
      localStorage.removeItem("fb_selected_page_id");
    }

    updateRouteParams(activeTab, page?.pageId || "");
  };

  const loadTagsAndAgents = async () => {
    try {
      const tagsRes = await adminFacebookService.getTags();
      setDbTags(tagsRes || []);
      const agentsRes = await adminFacebookService.getAgents();
      setDbAgents(agentsRes || []);
    } catch (error) {
      console.error("Failed to load tags and agents:", error);
    }
  };

  useEffect(() => {
    loadTagsAndAgents();
  }, []);

  const getTagColor = (tagName: string) => {
    const tag = dbTags.find(t => t.name.trim().toLowerCase() === tagName.trim().toLowerCase());
    return tag ? tag.color : '#64748b'; // default slate-500 color
  };

  const getAgentColor = (agentName: string) => {
    const agent = dbAgents.find(a => a.name.trim().toLowerCase() === agentName.trim().toLowerCase());
    return agent ? agent.color : '#3b82f6'; // default blue color
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    try {
      const added = await adminFacebookService.createTag({
        name: newTagName.trim(),
        color: newTagColor,
      });
      setDbTags((prev) => [...prev, added]);
      setNewTagName("");
      Swal.fire({
        icon: "success",
        title: "Đã thêm thẻ nhãn",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: err.message || "Không thể tạo nhãn.",
      });
    }
  };

  const handleDeleteTag = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Nhãn phân loại này sẽ bị xóa khỏi danh sách cấu hình.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý xóa",
      cancelButtonText: "Hủy",
    });

    if (confirm.isConfirmed) {
      try {
        await adminFacebookService.deleteTag(id);
        setDbTags((prev) => prev.filter((t) => t.id !== id));
        Swal.fire({
          icon: "success",
          title: "Đã xóa nhãn",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err: any) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: err.message || "Không thể xóa nhãn.",
        });
      }
    }
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim()) return;
    try {
      const added = await adminFacebookService.createAgent({
        name: newAgentName.trim(),
        color: newAgentColor,
      });
      setDbAgents((prev) => [...prev, added]);
      setNewAgentName("");
      Swal.fire({
        icon: "success",
        title: "Đã thêm nhân viên",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: err.message || "Không thể thêm nhân viên.",
      });
    }
  };

  const handleDeleteAgent = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Nhân viên Sale này sẽ bị xóa khỏi danh sách cấu hình.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý xóa",
      cancelButtonText: "Hủy",
    });

    if (confirm.isConfirmed) {
      try {
        await adminFacebookService.deleteAgent(id);
        setDbAgents((prev) => prev.filter((a) => a.id !== id));
        Swal.fire({
          icon: "success",
          title: "Đã xóa nhân viên",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err: any) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: err.message || "Không thể xóa nhân viên.",
        });
      }
    }
  };

  // Page AI Config Modal State
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [configDifyUrl, setConfigDifyUrl] = useState<string>("https://api.dify.ai/v1");
  const [configDifyKey, setConfigDifyKey] = useState<string>("");
  const [configAiEnabled, setConfigAiEnabled] = useState<boolean>(false);
  const [configSalesEnabled, setConfigSalesEnabled] = useState<boolean>(false);
  const [configFollowUpMsg, setConfigFollowUpMsg] = useState<string>("");
  const [savingConfig, setSavingConfig] = useState<boolean>(false);
  const [showKeyText, setShowKeyText] = useState<boolean>(false);

  const loadPages = async () => {
    setLoadingPages(true);
    try {
      const res = await adminFacebookService.getPages();
      setPages(res || []);
      if (res && res.length > 0) {
        const savedPageId = localStorage.getItem("fb_selected_page_id");
        let pageToSelect = null;
        if (pageParam) {
          pageToSelect = res.find(p => p.pageId === pageParam);
        }
        if (!pageToSelect && savedPageId) {
          pageToSelect = res.find(p => p.pageId === savedPageId);
        }
        if (!pageToSelect) {
          pageToSelect = res.find(p => p.status === 'connected') || res[0];
        }
        if (pageToSelect) {
          applyPageSelection(pageToSelect);
        }
      }
    } catch (err: any) {
      console.error("Failed to load pages", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể tải danh sách Page.",
        confirmButtonText: "Đã hiểu",
      });
    } finally {
      setLoadingPages(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  // Gọi mỗi khi selectedPage thay đổi (áp dụng cho Tab Bài viết)
  useEffect(() => {
    if (selectedPage && selectedPage.status === "connected" && activeTab === "posts") {
      loadPageDetailsAndPosts(selectedPage);
    }
  }, [selectedPage, activeTab]);

  const loadPageDetailsAndPosts = async (page: FbPage) => {
    const requestId = ++latestPostsRequestIdRef.current;
    const queryParams = buildPostsQueryParams();

    setLoadingPosts(true);
    try {
      debugPostsLog("UI reached loading state: Đang tải bài viết...", {
        requestId,
        source: "loadPageDetailsAndPosts",
        pageId: page.pageId,
        pageName: page.pageName,
        queryParams,
      });
      debugPostsLog("Starting loadPageDetailsAndPosts", {
        requestId,
        pageId: page.pageId,
        pageName: page.pageName,
        since,
        until,
        sort,
      });

      const details = await adminFacebookService.getPageDetails(page.pageId);
      if (requestId !== latestPostsRequestIdRef.current) {
        debugPostsLog("Stale page details ignored", {
          requestId,
          pageId: page.pageId,
        });
        return;
      }
      debugPostsLog("Page details loaded", {
        requestId,
        pageId: page.pageId,
        pageName: details?.name,
      });
      setPageDetails(details);
      
      debugPostsLog("Fetching posts", {
        requestId,
        pageId: page.pageId,
        queryParams,
      });
      const res = await adminFacebookService.getPosts(page.pageId, queryParams);
      if (requestId !== latestPostsRequestIdRef.current) {
        debugPostsLog("Stale posts response ignored", {
          requestId,
          pageId: page.pageId,
          count: Array.isArray(res) ? res.length : 0,
        });
        return;
      }
      debugPostsLog("Posts API resolved", {
        requestId,
        pageId: page.pageId,
        count: Array.isArray(res) ? res.length : 0,
        firstPostId: Array.isArray(res) && res.length > 0 ? res[0]?.id : null,
      });
      setPosts(res || []);
      setCurrentPage(1);
      debugPostsLog("Posts loading finished", {
        requestId,
        pageId: page.pageId,
        postCount: Array.isArray(res) ? res.length : 0,
      });
    } catch (err: any) {
      if (requestId !== latestPostsRequestIdRef.current) {
        debugPostsLog("Stale posts error ignored", {
          requestId,
          pageId: page.pageId,
          message: err?.message,
        });
        return;
      }
      debugPostsLog("Failed to load posts", {
        requestId,
        pageId: page.pageId,
        message: err?.message,
        error: err,
      });
      console.error("Failed to load posts", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể tải danh sách bài viết.",
        confirmButtonText: "Đã hiểu",
      });
    } finally {
      if (requestId === latestPostsRequestIdRef.current) {
        setLoadingPosts(false);
      }
    }
  };

  const handleSelectPage = (page: FbPage) => {
    applyPageSelection(page);
  };

  const handleApplyFilter = async (reason = "manual-filter") => {
    if (selectedPage && selectedPage.status === "connected") {
      const page = selectedPage;
      const requestId = ++latestPostsRequestIdRef.current;
      const queryParams = buildPostsQueryParams();

      setLoadingPosts(true);
      try {
        debugPostsLog("UI reached loading state: Đang tải bài viết...", {
          requestId,
          source: reason,
          pageId: page.pageId,
          pageName: page.pageName,
          queryParams,
        });
        debugPostsLog("Applying posts filter", {
          requestId,
          pageId: page.pageId,
          queryParams,
        });
        const res = await adminFacebookService.getPosts(page.pageId, queryParams);
        if (requestId !== latestPostsRequestIdRef.current) {
          debugPostsLog("Stale filtered posts response ignored", {
            requestId,
            pageId: page.pageId,
            count: Array.isArray(res) ? res.length : 0,
          });
          return;
        }
        debugPostsLog("Filtered posts API resolved", {
          requestId,
          pageId: page.pageId,
          count: Array.isArray(res) ? res.length : 0,
        });
        setPosts(res || []);
        setCurrentPage(1);
        debugPostsLog("Posts loading finished", {
          requestId,
          pageId: page.pageId,
          postCount: Array.isArray(res) ? res.length : 0,
        });
      } catch (err: any) {
        if (requestId !== latestPostsRequestIdRef.current) {
          debugPostsLog("Stale filtered posts error ignored", {
            requestId,
            pageId: page.pageId,
            message: err?.message,
          });
          return;
        }
        debugPostsLog("Failed to apply posts filter", {
          requestId,
          pageId: page.pageId,
          message: err?.message,
          error: err,
        });
        console.error("Lỗi khi lọc bài viết:", err);
      } finally {
        if (requestId === latestPostsRequestIdRef.current) {
          setLoadingPosts(false);
        }
      }
    }
  };

  useEffect(() => {
    if (selectedPage && activeTab === "posts") {
      if (!hasMountedSortEffectRef.current) {
        hasMountedSortEffectRef.current = true;
        return;
      }
      handleApplyFilter("sort-change");
    }
  }, [sort]);



  useEffect(() => {
    return () => {
      if (realtimeChatRefreshTimeoutRef.current) {
        window.clearTimeout(realtimeChatRefreshTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (activeTab !== "crm_chat") return;

    const handleRealtimeMessage = (rawEvent: Event) => {
      const event = rawEvent as CustomEvent<FacebookCrmRealtimePayload>;
      const payload = event.detail;

      if (payload?.type !== "FACEBOOK_CRM_MESSAGE") return;
      if (!payload.pageId || !payload.facebookUserId || !payload.message) return;

      const activePageId = filterPageId || selectedLead?.pageId || "";
      if (activePageId && payload.pageId !== activePageId) return;

      const selectedLeadUserId = String(selectedLead?.customer_id || "");
      const isSelectedLead =
        Boolean(selectedLeadUserId) &&
        selectedLeadUserId === String(payload.facebookUserId);

      let isNewCustomer = false;
      setLeads((prev) => {
        const nextLeads = [...prev];
        const existingIndex = nextLeads.findIndex(
          (item: any) =>
            String(item.customer_id || "") === String(payload.facebookUserId) &&
            String(item.pageId || filterPageId || "") === String(payload.pageId)
        );

        if (existingIndex >= 0) {
          const existingLead = nextLeads[existingIndex];
          const updatedLead = {
            ...existingLead,
            pageId: existingLead.pageId || payload.pageId,
            customer_id: existingLead.customer_id || payload.facebookUserId,
            last_message: payload.message,
            updated_time: payload.created_time,
            lead_status: payload.leadStatus || existingLead.lead_status,
            ai_enabled: payload.aiEnabled ?? existingLead.ai_enabled,
          };

          nextLeads.splice(existingIndex, 1);
          nextLeads.unshift(updatedLead);
          return nextLeads;
        } else {
          isNewCustomer = true;
        }

        return prev;
      });

      if (isSelectedLead) {
        setSelectedLead((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            last_message: payload.message,
            updated_time: payload.created_time,
            lead_status: payload.leadStatus || prev.lead_status,
            ai_enabled: payload.aiEnabled ?? prev.ai_enabled,
          };
        });
      }

      if (isSelectedLead) {
        const nextMessage = {
          id: `realtime:${payload.source}:${payload.pageId}:${payload.facebookUserId}:${payload.created_time}`,
          message: payload.message,
          from_id: payload.source === "user" ? payload.facebookUserId : payload.pageId,
          from_name: payload.source === "user" ? (selectedLead?.customer_name || "Khách") : (selectedPage?.pageName || "Page"),
          created_time: payload.created_time,
        };

        setChatHistory((prev) => {
          const existed = prev.some(
            (item: any) =>
              item.id === nextMessage.id ||
              (
                item.message === nextMessage.message &&
                item.from_id === nextMessage.from_id &&
                item.created_time === nextMessage.created_time
              )
          );

          if (existed) return prev;
          return [...prev, nextMessage];
        });
      }

      if (isNewCustomer && filterPageId) {
        loadLeads(searchLeadQuery, filterPageId, true);
      }

      if (isSelectedLead && activePageId) {
        if (realtimeChatRefreshTimeoutRef.current) {
          window.clearTimeout(realtimeChatRefreshTimeoutRef.current);
        }

        const selectedLeadSnapshot = selectedLead;
        realtimeChatRefreshTimeoutRef.current = window.setTimeout(() => {
          fetchLeadChatHistory(selectedLeadSnapshot, activePageId, true, true);
        }, 1200);
      }
    };

    window.addEventListener("app:socket-message", handleRealtimeMessage as EventListener);
    return () => {
      window.removeEventListener("app:socket-message", handleRealtimeMessage as EventListener);
    };
  }, [activeTab, filterPageId, searchLeadQuery, selectedLead, selectedPage]);

  async function handleSelectLead(lead: any, options?: { skipFetch?: boolean }) {
    setSelectedLead(lead);
    
    if (lead) {
      localStorage.setItem("fb_selected_lead_id", String(lead.id));
      

      if (!options?.skipFetch) {
        await fetchLeadChatHistory(lead, filterPageId, false);
      }
    } else {
      localStorage.removeItem("fb_selected_lead_id");
      lastFetchedChatKeyRef.current = "";
      setChatHistory([]);
    }
  }

  async function loadLeads(search = "", pageId = "", silent = false) {
    if (!silent) {
      setLoadingLeads(true);
    }
    try {
      const activePageId = pageId || filterPageId;
      if (!activePageId) {
        setLeads([]);
        return;
      }
      const res = await adminFacebookService.getFacebookConversations(activePageId);
      
      let filtered = res || [];
      if (search) {
        const cleanSearch = search.toLowerCase();
        filtered = filtered.filter((item: any) => 
          item.customer_name?.toLowerCase().includes(cleanSearch) || 
          item.customer_id?.includes(cleanSearch) ||
          item.phone?.includes(cleanSearch) ||
          item.notes?.toLowerCase().includes(cleanSearch)
        );
      }

      setLeads(filtered);
      
      // Restore selected lead from localStorage if it exists in the new list,
      // otherwise select the first lead.
      if (filtered.length > 0) {
        const savedLeadId = localStorage.getItem("fb_selected_lead_id");
        const restoredLead = filtered.find((l: any) => String(l.id) === savedLeadId);
        const nextLead = restoredLead || filtered[0];

        if (selectedLead && String(selectedLead.id) === String(nextLead.id)) {
          setSelectedLead(nextLead);
          
        } else {
          if (!silent) {
            await handleSelectLead(nextLead);
          }
        }
      } else {
        setSelectedLead(null);
        lastFetchedChatKeyRef.current = "";
        setChatHistory([]);
      }
    } catch (err: any) {
      console.error("Failed to load leads", err);
      setLeads([]);
    } finally {
      if (!silent) {
        setLoadingLeads(false);
      }
    }
  }

  const handleConnect = async () => {
    const appId = "1798186884217998";
    const redirectUri = encodeURIComponent(`${window.location.origin}/admin/facebook/callback`);
    const scope = "pages_show_list,pages_manage_metadata,pages_messaging,pages_read_engagement,business_management,read_insights,pages_read_user_content,pages_manage_posts";
    const oauthUrl = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&auth_type=rerequest`;
    window.location.href = oauthUrl;
  };

  const handleDisconnectPage = async (page: FbPage) => {
    const result = await Swal.fire({
      title: "Hủy kết nối Page?",
      text: `Bạn có chắc chắn muốn hủy kết nối với trang "${page.pageName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await adminFacebookService.disconnectPage(page.pageId);
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: `Đã hủy kết nối với trang "${page.pageName}".`,
          confirmButtonText: "Đã hiểu",
        });
        loadPages();
      } catch (err: any) {
        console.error("Failed to disconnect page", err);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể hủy kết nối Page.",
          confirmButtonText: "Đã hiểu",
        });
      }
    }
  };

  // ==================== CRM CHAT CRM FUNCTIONS ====================
  const hydrateLeadForm = (lead: any) => {
    setCrmStatus(lead.lead_status || lead.leadStatus || "new_lead");
    setCrmPhone(lead.phone || "");
    setCrmCourse(lead.course_interest || lead.courseInterest || "");
    setCrmNotes(lead.notes || "");
    setCrmTags(lead.tags || "");
    setCrmSaleAgent(lead.sale_agent || lead.saleAgent || "");
  };

  const buildChatFetchKey = (pageId: string, lead: any) => `${pageId}::${String(lead?.id || "")}`;

  async function fetchLeadChatHistory(lead: any, pageId: string, force = false, silent = false) {
    if (!lead || !pageId) return;

    const nextKey = buildChatFetchKey(pageId, lead);
    if (!force && lastFetchedChatKeyRef.current === nextKey) {
      return;
    }

    lastFetchedChatKeyRef.current = nextKey;
    if (!silent) {
      setLoadingChat(true);
    }
    try {
      const history = await adminFacebookService.getFacebookMessages(pageId, String(lead.id));
      setChatHistory(history || []);
    } catch (err: any) {
      console.error("Error loading chat history:", err);
      setChatHistory([]);
      lastFetchedChatKeyRef.current = "";
    } finally {
      if (!silent) {
        setLoadingChat(false);
      }
    }
  }

  useEffect(() => {
    if (activeTab === "crm_chat") {
      loadLeads(searchLeadQuery, filterPageId);
    }
  }, [activeTab, filterPageId]);

  const handleSearchLeads = (e: React.FormEvent) => {
    e.preventDefault();
    loadLeads(searchLeadQuery, filterPageId);
  };


  // Toggle AI for individual Lead
  const handleToggleLeadAi = async (checked: boolean) => {
    if (!selectedLead) return;
    try {
      const updated = await adminFacebookService.updateLead(selectedLead.lead_id || selectedLead.id, { aiEnabled: checked ? 1 : 0 });
      
      const updatedLead = { ...selectedLead, ai_enabled: updated.aiEnabled };
      setSelectedLead(updatedLead);
      
      // Cập nhật lại trong mảng leads
      setLeads(prev => prev.map(l => l.lead_id === updated.id ? updatedLead : l));
      
      const toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      toast.fire({
        icon: 'success',
        title: checked ? 'Đã BẬT AI tự động cho khách này' : 'Đã TẮT AI tự động (Handoff thủ công)'
      });
    } catch (err: any) {
      console.error("Failed to toggle AI for lead", err);
    }
  };

  // Gửi tin nhắn thủ công
  const handleSendManualMessage = async (msg: string) => {
    if (!selectedLead || !msg.trim()) return;

    const tempId = `temp:${Date.now()}`;
    const newMsgObj: FbChatLog = {
      id: tempId,
      message: msg.trim(),
      from_id: filterPageId,
      created_time: new Date().toISOString()
    };

    // Optimistically update chat history
    setChatHistory(prev => [...prev, newMsgObj]);

    // Optimistically update the active lead and place it at the top of the leads list
    const updatedLead = { 
      ...selectedLead, 
      ai_enabled: 0, 
      updated_time: new Date().toISOString(),
      last_message: msg.trim()
    };
    setSelectedLead(updatedLead);
    setLeads(prev => {
      const filtered = prev.filter(l => String(l.id) !== String(updatedLead.id));
      return [updatedLead, ...filtered];
    });

    try {
      await adminFacebookService.sendManualMessage(selectedLead.lead_id || selectedLead.id, msg.trim());
      
      // Reload tin nhắn từ FB ngầm (silent)
      await fetchLeadChatHistory(selectedLead, filterPageId, true, true);
      
    } catch (err: any) {
      console.error("Failed to send message", err);
      // Rollback optimistic updates
      setChatHistory(prev => prev.filter(m => m.id !== tempId));
      setSelectedLead(selectedLead);
      
      Swal.fire({
        icon: "error",
        title: "Lỗi gửi tin nhắn",
        text: err.message || "Không thể gửi tin nhắn đi.",
      });
      throw err;
    }
  };

  // Lưu thông tin CRM của Lead
  const handleSaveCrmDetails = async (data: any) => {
    if (!selectedLead) return;
    try {
      const leadIdToUpdate = selectedLead.lead_id || selectedLead.id;
      const updated = await adminFacebookService.updateLead(leadIdToUpdate, data);
      
      const updatedLead = { 
        ...selectedLead, 
        lead_status: updated.leadStatus,
        leadStatus: updated.leadStatus,
        phone: updated.phone,
        course_interest: updated.courseInterest,
        courseInterest: updated.courseInterest,
        notes: updated.notes,
        tags: updated.tags,
        sale_agent: updated.saleAgent,
        saleAgent: updated.saleAgent
      };
      setSelectedLead(updatedLead);
      setLeads(prev => prev.map(l => (l.lead_id || l.id) === updated.id ? updatedLead : l));
      
      Swal.fire({
        icon: "success",
        title: "Đã lưu",
        text: "Cập nhật thông tin CRM thành công!",
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err: any) {
      console.error("Failed to save CRM Details", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể lưu thông tin khách hàng.",
      });
      throw err;
    }
  };

  // Mở popup cấu hình AI Dify
  const handleOpenConfigModal = () => {
    const page = pages.find(p => p.pageId === filterPageId);
    if (!page) {
      Swal.fire({
        icon: "warning",
        title: "Chú ý",
        text: "Vui lòng chọn một Fanpage đã kết nối để cấu hình.",
      });
      return;
    }
    
    setConfigDifyUrl(page.difyApiUrl || "https://api.dify.ai/v1");
    setConfigDifyKey(page.difyApiKey || "");
    setConfigAiEnabled(page.aiEnabled === 1);
    setConfigSalesEnabled(page.salesEngineEnabled === 1);
    setConfigFollowUpMsg(page.followUpMessage || "");
    setShowConfigModal(true);
  };

  // Lưu cấu hình AI Dify
  const handleSaveAiConfig = async () => {
    const page = pages.find(p => p.pageId === filterPageId);
    if (!page || savingConfig) return;

    setSavingConfig(true);
    try {
      const updated = await adminFacebookService.updatePageAiConfig(page.pageId, {
        difyApiKey: configDifyKey,
        difyApiUrl: configDifyUrl,
        aiEnabled: configAiEnabled ? 1 : 0,
        salesEngineEnabled: configSalesEnabled ? 1 : 0,
        followUpMessage: configFollowUpMsg
      });

      // Cập nhật lại trong danh sách page cục bộ
      setPages(prev => prev.map(p => p.pageId === page.pageId ? { ...p, ...updated } : p));
      setShowConfigModal(false);

      Swal.fire({
        icon: "success",
        title: "Cấu hình thành công",
        text: `Đã cập nhật cài đặt AI Dify cho fanpage: ${page.pageName}`,
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err: any) {
      console.error("Failed to save AI config", err);
      Swal.fire({
        icon: "error",
        title: "Cập nhật thất bại",
        text: err.message || "Đã xảy ra lỗi khi lưu cấu hình.",
      });
    } finally {
      setSavingConfig(false);
    }
  };

  const totalConnectedPages = pages.filter((p) => p.status === "connected").length;
  const totalDisconnectedPages = pages.filter((p) => p.status === "disconnected").length;

  const totalPages = Math.ceil(posts.length / pageSize);
  const { totalViews, totalEngagements, totalLikes, totalComments } = useMemo(() => {
    return posts.reduce(
      (acc, post) => {
        acc.totalViews += Number(post.views) || 0;
        acc.totalEngagements += Number(post.engagements) || 0;
        acc.totalLikes += Number(post.likes) || 0;
        acc.totalComments += Number(post.comments) || 0;
        return acc;
      },
      { totalViews: 0, totalEngagements: 0, totalLikes: 0, totalComments: 0 }
    );
  }, [posts]);

  const currentPosts = posts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <PageBreadcrumb
        title="Quản lý Facebook"
        name="Quản lý Facebook"
        breadCrumbItems={["Konrix", "Apps", "Facebook"]}
      />

      {/* STATS TILES */}
      <div className="grid xl:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-3 mb-4">
        <div className="card p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Tổng số Page</p>
          <div className="text-2xl font-semibold text-slate-900 tabular-nums">{formatFullNumber(pages.length)}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-slate-500 font-medium">Đã kết nối</div>
          <div className="text-2xl font-semibold text-emerald-600 tabular-nums">{formatFullNumber(totalConnectedPages)}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-left">
          <div className="text-sm text-slate-500 font-medium">Chưa kết nối</div>
          <div className="text-2xl font-semibold text-slate-600 tabular-nums">{formatFullNumber(totalDisconnectedPages)}</div>
        </div>
      </div>

      {/* TAB BAR NAVIGATION */}
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-700 mb-6">
        <button
          onClick={() => setActiveTab("posts")}
          className={`pb-3 font-semibold text-sm transition-colors relative ${
            activeTab === "posts" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <i className="mgc_paper_line mr-1 align-middle"></i>Bài viết & Phân tích
        </button>
        <button
          onClick={() => setActiveTab("crm_chat")}
          className={`pb-3 font-semibold text-sm transition-colors relative ${
            activeTab === "crm_chat" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <i className="mgc_message_3_line mr-1 align-middle"></i>Trò chuyện & Chăm sóc AI (CRM)
        </button>
        <button
          onClick={() => setActiveTab("tags_agents")}
          className={`pb-3 font-semibold text-sm transition-colors relative ${
            activeTab === "tags_agents" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <i className="mgc_settings_line mr-1 align-middle"></i>Quản lý Nhãn & Nhân sự
        </button>
      </div>

      {/* ==================== TAB 1: POSTS & STATISTICS ==================== */}
      {activeTab === "posts" && (
        <div className="grid xl:grid-cols-3 gap-4 mb-4">
          {/* Cột Danh sách Page */}
          <div className="card xl:col-span-1">
            <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-700">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Danh sách Page</h3>
                  <p className="text-sm text-slate-500">Chọn page để xem thống kê</p>
                </div>
                <button
                  type="button"
                  className="btn bg-blue-600 text-white text-sm"
                  onClick={handleConnect}
                >
                  <i className="mgc_add_line mr-1" />
                  Kết nối Page
                </button>
              </div>
            </div>

            <div className="p-0 overflow-y-auto max-h-[600px]">
              {loadingPages ? (
                <div className="p-4 text-center text-slate-500">Đang tải danh sách...</div>
              ) : pages.length === 0 ? (
                <div className="p-4 text-center text-slate-500">Chưa có Page nào.</div>
              ) : (
                <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                  {pages.map((page) => (
                    <li
                      key={page.id}
                      className={`p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                        selectedPage?.pageId === page.pageId ? "bg-slate-50 dark:bg-slate-800 border-l-4 border-blue-500" : ""
                      }`}
                      onClick={() => handleSelectPage(page)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {page.avatarUrl ? (
                              <img src={page.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                              <i className="mgc_facebook_fill text-2xl text-blue-600"></i>
                            )}
                          </div>
                          <div>
                            <h4 className="text-md font-semibold text-slate-800 dark:text-slate-200">
                              {page.pageName}
                            </h4>
                            <div className="text-xs text-slate-500 mt-1">ID: {page.pageId}</div>
                          </div>
                        </div>
                        <div>
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border ${
                              statusColor[page.status] || statusColor.disconnected
                            }`}
                          >
                            {statusLabel[page.status] || page.status}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Cột Chi tiết Page & Bài viết */}
          <div className="card xl:col-span-2">
            <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold mb-1">Chi tiết Page & Bài viết</h3>
                <p className="text-sm text-slate-500">
                  {selectedPage
                    ? `Đang xem thông tin của: ${selectedPage.pageName}`
                    : "Vui lòng chọn một Page để xem chi tiết."}
                </p>
              </div>
            </div>

            <div className="p-4 md:p-5">
              {!selectedPage ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 text-center">
                  Chọn một Page ở danh sách bên trái để xem thống kê.
                </div>
              ) : selectedPage.status !== "connected" ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <div className="text-sm text-slate-500 mb-4">
                    Page này chưa được kết nối. Bạn cần kết nối để quản lý.
                  </div>
                  <button
                    type="button"
                    className="btn bg-blue-600 text-white"
                    onClick={handleConnect}
                  >
                    <i className="mgc_plugin_line mr-1" />
                    Kết nối Page này
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* PAGE INFO CARD */}
                  {pageDetails && (
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-5 border border-slate-200 dark:border-slate-700 flex flex-col gap-5 xl:flex-row xl:items-center">
                      {pageDetails.picture && (
                        <img src={pageDetails.picture} alt="Page Avatar" className="w-20 h-20 rounded-full shadow-sm object-cover" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">{pageDetails.name}</h4>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-2">{pageDetails.about || "Chưa có mô tả"}</p>
                        <div className="grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-3">
                          <div className="rounded-lg border border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-900/40">
                            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                              <i className="mgc_group_line text-sm"></i>
                              Người theo dõi
                            </div>
                            <div
                              className="mt-1 text-lg font-semibold text-slate-800 dark:text-slate-100 tabular-nums leading-none"
                              title={formatFullNumber(pageDetails.followers_count)}
                            >
                              {formatCompactNumber(pageDetails.followers_count)}
                            </div>
                          </div>
                          <div className="rounded-lg border border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-900/40">
                            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                              <i className="mgc_thumb_up_line text-sm"></i>
                              Lượt thích
                            </div>
                            <div
                              className="mt-1 text-lg font-semibold text-slate-800 dark:text-slate-100 tabular-nums leading-none"
                              title={formatFullNumber(pageDetails.fan_count)}
                            >
                              {formatCompactNumber(pageDetails.fan_count)}
                            </div>
                          </div>
                          {pageDetails.category && (
                            <div className="rounded-lg border border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-900/40">
                              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                                <i className="mgc_tag_line text-sm"></i>
                                Danh mục
                              </div>
                              <div className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200 break-words">
                                {pageDetails.category}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {pageDetails.link && (
                        <a href={pageDetails.link} target="_blank" rel="noreferrer" className="btn bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm whitespace-nowrap">
                          <i className="mgc_external_link_line mr-1"></i> Xem trên FB
                        </a>
                      )}
                    </div>
                  )}

                  {/* POSTS STATS */}
                  {posts.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-4">
                      <div className="rounded-lg border border-slate-200 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-900/40 shadow-sm">
                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                          <i className="mgc_eye_line text-sm text-blue-500"></i>
                          Tổng lượt xem
                        </div>
                        <div className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                          {formatFullNumber(totalViews)}
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-900/40 shadow-sm">
                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                          <i className="mgc_chart_bar_line text-sm text-emerald-500"></i>
                          Tổng tương tác
                        </div>
                        <div className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                          {formatFullNumber(totalEngagements)}
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-900/40 shadow-sm">
                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                          <i className="mgc_thumb_up_line text-sm text-indigo-500"></i>
                          Tổng lượt thích
                        </div>
                        <div className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                          {formatFullNumber(totalLikes)}
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-900/40 shadow-sm">
                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                          <i className="mgc_chat_4_line text-sm text-amber-500"></i>
                          Tổng bình luận
                        </div>
                        <div className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                          {formatFullNumber(totalComments)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* POSTS TABLE */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
                    <h4 className="text-md font-semibold text-slate-800">Bài viết & Tương tác</h4>
                    <div className="flex flex-wrap gap-2 items-center">
                      <select
                        className="form-select text-sm border-slate-200 rounded-md py-1.5 w-auto"
                        value={selectedPage?.pageId || ""}
                        onChange={(e) => {
                          const nextPage = pages.find((page) => page.pageId === e.target.value) || null;
                          applyPageSelection(nextPage);
                        }}
                      >
                        {pages.filter((page) => page.status === "connected").map((page) => (
                          <option key={page.pageId} value={page.pageId}>
                            {page.pageName}
                          </option>
                        ))}
                      </select>
                      <input 
                        type="date" 
                        className="form-input text-sm border-slate-200 rounded-md py-1.5"
                        value={since}
                        onChange={(e) => setSince(e.target.value)}
                      />
                      <span className="text-slate-500">-</span>
                      <input 
                        type="date" 
                        className="form-input text-sm border-slate-200 rounded-md py-1.5"
                        value={until}
                        onChange={(e) => setUntil(e.target.value)}
                      />
                      <button type="button" onClick={() => handleApplyFilter()} className="btn bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 py-1.5 px-3 text-sm">
                        <i className="mgc_filter_line mr-1"></i>Lọc
                      </button>
                      <select 
                        className="form-select text-sm border-slate-200 rounded-md py-1.5 w-auto"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                      >
                        <option value="created_time">Mới nhất</option>
                        <option value="views">Lượt xem (Top Views)</option>
                        <option value="engagements">Tương tác (Top Engagements)</option>
                        <option value="likes">Lượt thích (Top Likes)</option>
                        <option value="comments">Bình luận (Top Comments)</option>
                      </select>
                    </div>
                  </div>

                  {loadingPosts && posts.length > 0 && (
                    <div className="mb-3 flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">
                      <i className="mgc_loading_4_line animate-spin text-sm"></i>
                      Đang cập nhật danh sách bài viết, dữ liệu hiện tại vẫn được giữ để bạn theo dõi.
                    </div>
                  )}

                  <div className="relative overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-700/60">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-slate-500 whitespace-nowrap">Nội dung</th>
                          <th className="w-[132px] px-4 py-3 text-right font-medium text-slate-500 whitespace-nowrap">Lượt xem</th>
                          <th className="w-[132px] px-4 py-3 text-right font-medium text-slate-500 whitespace-nowrap">Tương tác</th>
                          <th className="w-[132px] px-4 py-3 text-right font-medium text-slate-500 whitespace-nowrap">Thích</th>
                          <th className="w-[132px] px-4 py-3 text-right font-medium text-slate-500 whitespace-nowrap">Bình luận</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {loadingPosts && posts.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                              <i className="mgc_loading_4_line animate-spin text-2xl mb-2 block text-blue-500"></i>
                              Đang tải bài viết...
                            </td>
                          </tr>
                        ) : posts.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                              Không tìm thấy bài viết nào.
                            </td>
                          </tr>
                        ) : (
                          currentPosts.map((post) => (
                            <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                              <td className="px-4 py-3 align-top min-w-[300px]">
                                <p className="line-clamp-2 text-slate-700 font-medium mb-1">{post.message}</p>
                                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                  <span><i className="mgc_time_line mr-1 align-text-bottom" />{formatDateTime(post.created_time)}</span>
                                  <button type="button" onClick={() => setViewingPost(post)} className="text-emerald-600 hover:underline">
                                    <i className="mgc_eye_line mr-1 align-text-bottom" />Xem chi tiết
                                  </button>
                                  {post.permalink_url && (
                                    <a href={post.permalink_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                                      <i className="mgc_external_link_line mr-1 align-text-bottom" />Mở bài viết
                                    </a>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">
                                <span className="inline-block min-w-[88px] font-semibold text-slate-700" title={getViewsTitle(post)}>
                                  {formatViewsCell(post)}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">
                                <span className="inline-block min-w-[88px] font-semibold text-slate-700" title={formatFullNumber(post.engagements)}>
                                  {formatFullNumber(post.engagements)}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">
                                <span className="inline-block min-w-[88px] font-semibold text-slate-700" title={formatFullNumber(post.likes)}>
                                  {formatFullNumber(post.likes)}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">
                                <span className="inline-block min-w-[88px] font-semibold text-slate-700" title={formatFullNumber(post.comments)}>
                                  {formatFullNumber(post.comments)}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                    
                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex justify-between items-center px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60">
                        <div className="text-sm text-slate-500">
                          Hiển thị <span className="font-semibold text-slate-800 dark:text-slate-200">{(currentPage - 1) * pageSize + 1}</span> đến <span className="font-semibold text-slate-800 dark:text-slate-200">{Math.min(currentPage * pageSize, posts.length)}</span> trong số <span className="font-semibold text-slate-800 dark:text-slate-200">{posts.length}</span> bài viết
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded text-sm text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                          >
                            Trang trước
                          </button>
                          <button 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded text-sm text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                          >
                            Trang sau
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: CRM AI CHAT WORKSPACE ==================== */}
      {activeTab === "crm_chat" && (
        <div className="space-y-4">
          {/* TOP CONTROLS */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 justify-between items-center">
            <form onSubmit={handleSearchLeads} className="flex gap-2 max-w-md w-full">
              <input
                type="text"
                placeholder="Tìm user ID, SĐT, ghi chú..."
                className="form-input text-sm border-slate-200 rounded-md py-1.5 w-full"
                value={searchLeadQuery}
                onChange={(e) => setSearchLeadQuery(e.target.value)}
              />
              <button type="submit" className="btn bg-blue-600 text-white py-1.5 px-4 text-sm whitespace-nowrap">
                Tìm kiếm
              </button>
            </form>
            
            <div className="flex gap-3 items-center">
              <select
                className="form-select text-sm border-slate-200 rounded-md py-1.5 w-auto"
                value={filterPageId}
                onChange={(e) => {
                  const val = e.target.value;
                  const pg = pages.find(p => p.pageId === val) || null;
                  applyPageSelection(pg);
                }}
              >
                <option value="">Tất cả Page</option>
                {pages.filter(p => p.status === 'connected').map(page => (
                  <option key={page.pageId} value={page.pageId}>
                    {page.pageName}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="btn bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 py-1.5 px-4 text-sm"
                onClick={handleOpenConfigModal}
              >
                <i className="mgc_settings_line mr-1 align-text-bottom"></i> Cấu hình AI Page
              </button>
            </div>
          </div>

          {/* 3-COLUMN FULL-HEIGHT LAYOUT */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 items-stretch xl:h-[700px] h-auto">
            {/* COLUMN 1: LEADS LIST */}
            <div className="card xl:col-span-1 flex flex-col h-[500px] xl:h-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-100 flex justify-between items-center bg-white dark:bg-slate-800 z-10 shadow-sm">
                <span className="flex items-center gap-2"><i className="mgc_group_line text-blue-600 dark:text-blue-400 text-lg"></i> Khách hàng nhắn tin</span>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs px-2.5 py-0.5 rounded-full font-bold">{leads.length}</span>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900 pb-2">
                {loadingLeads ? (
                  <div className="p-8 text-center text-slate-400 text-sm flex flex-col items-center">
                    <i className="mgc_loading_4_line animate-spin text-3xl mb-3 text-blue-500"></i>
                    Đang tải danh sách...
                  </div>
                ) : leads.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm flex flex-col items-center mt-10">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 text-slate-300">
                      <i className="mgc_ghost_line text-3xl"></i>
                    </div>
                    Chưa có hội thoại nào.
                  </div>
                ) : (
                  leads.map((lead: any) => (
                    <LeadListItem 
                      key={lead.id} 
                      lead={lead} 
                      isSelected={selectedLead?.id === lead.id} 
                      onClick={handleSelectLead} 
                      getAgentColor={getAgentColor} 
                      getTagColor={getTagColor}
                      leadStatusColor={leadStatusColor}
                      leadStatusLabel={leadStatusLabel}
                    />
                  ))
                )}
              </div>
            </div>

            {/* COLUMN 2 & 3: CHAT WINDOW */}
            <div className="card xl:col-span-2 flex flex-col h-[600px] xl:h-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm relative rounded-xl bg-white dark:bg-slate-800">
              {!selectedLead ? (
                <div className="flex-1 flex flex-col justify-center items-center p-6 text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-4 border border-slate-100 dark:border-slate-700">
                    <i className="mgc_chat_3_line text-5xl text-slate-300"></i>
                  </div>
                  <p className="text-base font-medium text-slate-500">Chọn một khách hàng để xem cuộc trò chuyện</p>
                </div>
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="p-3.5 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center shadow-sm z-10">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-100 to-blue-50 overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-200 shadow-sm relative">
                        {selectedLead.customer_avatar ? (
                          <img src={selectedLead.customer_avatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-indigo-600 font-bold text-lg">{selectedLead.customer_name ? selectedLead.customer_name.charAt(0).toUpperCase() : "?"}</span>
                        )}
                        {selectedLead.ai_enabled === 1 && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-[1.5px] border-white dark:border-slate-800 rounded-full"></span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-100 text-[15px] flex items-center gap-1.5 leading-tight">
                          {selectedLead.customer_name || selectedLead.customer_id}
                          {selectedLead.profile_link && (
                            <a 
                              href={selectedLead.profile_link} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-blue-500 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded text-[10px] inline-flex items-center gap-0.5 ml-1 transition-colors"
                              title="Xem trang cá nhân Facebook"
                            >
                              <i className="mgc_external_link_line text-[10px]"></i> Profile
                            </a>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 font-medium flex items-center gap-1">
                          <i className="mgc_time_line text-xs"></i> Cập nhật lúc {selectedLead.updated_time ? new Date(selectedLead.updated_time).toLocaleTimeString("vi-VN", {hour: '2-digit', minute: '2-digit'}) : '--'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Toggle AI Mode */}
                    <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-bold flex items-center gap-1 cursor-pointer select-none" onClick={() => handleToggleLeadAi(selectedLead.ai_enabled !== 1)}>
                        <i className={`\${selectedLead.ai_enabled === 1 ? 'mgc_robot_fill text-emerald-500' : 'mgc_robot_line text-slate-400'} text-sm`}></i> 
                        {selectedLead.ai_enabled === 1 ? 'AI Auto-rep đang Bật' : 'AI đang Tắt'}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer ml-1">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={selectedLead.ai_enabled === 1}
                          onChange={(e) => handleToggleLeadAi(e.target.checked)}
                        />
                        <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
                      </label>
                    </div>
                  </div>

                  <ChatHistoryWindow 
                    chatHistory={chatHistory} 
                    filterPageId={filterPageId} 
                    selectedLead={selectedLead} 
                    loadingChat={loadingChat} 
                  />

                  <ChatInputArea onSend={handleSendManualMessage} />
                </>
              )}
            </div>

            {/* COLUMN 4: CRM LEAD DETAILS */}
            <div className="card xl:col-span-1 p-4 flex flex-col h-auto xl:h-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 rounded-xl relative">
              {!selectedLead ? (
                <div className="flex-1 flex flex-col justify-center items-center text-slate-400 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                    <i className="mgc_profile_line text-4xl text-slate-300"></i>
                  </div>
                  <p className="text-sm text-center font-medium">Chọn khách hàng để xem hồ sơ</p>
                </div>
              ) : (
                <CrmDetailsPanel 
                  selectedLead={selectedLead} 
                  onSave={handleSaveCrmDetails} 
                  dbTags={dbTags} 
                  dbAgents={dbAgents}
                  getAgentColor={getAgentColor}
                  getTagColor={getTagColor}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== POST DETAILS MODAL ==================== */}
      {viewingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Chi tiết Bài viết</h3>
              <button onClick={() => setViewingPost(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <i className="mgc_close_line text-2xl"></i>
              </button>
            </div>
            <div className="p-5 overflow-y-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden">
                   {pageDetails?.picture && <img src={pageDetails.picture} alt="Avatar" className="w-full h-full object-cover" />}
                </div>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{pageDetails?.name || "Page Name"}</div>
                  <div className="text-xs text-slate-500">{formatDateTime(viewingPost.created_time)}</div>
                </div>
              </div>
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap mb-4 text-sm">
                {viewingPost.message !== '[Chỉ chứa Hình ảnh/Video]' ? viewingPost.message : <span className="italic text-slate-400">[Không có nội dung văn bản]</span>}
              </p>
              {viewingPost.full_picture && (
                <div className="mb-4 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img src={viewingPost.full_picture} alt="Post media" className="w-full object-contain max-h-[400px] bg-slate-50 dark:bg-slate-900" />
                </div>
              )}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-1.5 text-blue-600 font-medium">
                  <i className="mgc_thumb_up_fill"></i> {viewingPost.likes?.toLocaleString() || 0}
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium">
                  <i className="mgc_chat_2_fill"></i> {viewingPost.comments?.toLocaleString() || 0}
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium">
                   <i className="mgc_eye_2_fill"></i> {viewingPost.views == null ? "--" : viewingPost.views.toLocaleString()} lượt xem
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium">
                   <i className="mgc_mouse_pointer_fill"></i> {viewingPost.engagements?.toLocaleString() || 0} tương tác
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
              {viewingPost.permalink_url && (
                <a href={viewingPost.permalink_url} target="_blank" rel="noreferrer" className="btn border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                  Mở trên Facebook
                </a>
              )}
              <button onClick={() => setViewingPost(null)} className="btn bg-blue-600 text-white hover:bg-blue-700">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: TAGS & AGENTS SETTINGS ==================== */}
      {activeTab === "tags_agents" && (
        <div className="grid xl:grid-cols-2 gap-6">
          {/* COLUMN 1: TAGS MANAGEMENT */}
          <div className="card p-5">
            <h3 className="text-lg font-bold mb-1 text-slate-800 flex items-center gap-2">
              <i className="mgc_tag_line text-blue-600"></i> Quản lý Thẻ / Nhãn
            </h3>
            <p className="text-xs text-slate-500 mb-4">Tạo nhãn màu phân loại cuộc trò chuyện khách hàng</p>

            {/* Form to create tag */}
            <form onSubmit={handleCreateTag} className="flex gap-2 mb-4 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Tên nhãn (VD: Cần hỗ trợ gấp)"
                  className="form-input text-xs border-slate-200 rounded-md py-2 w-full"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  required
                />
              </div>
              <div className="w-16 flex items-center justify-center">
                <input
                  type="color"
                  className="w-10 h-8 cursor-pointer rounded border border-slate-300"
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                />
              </div>
              <button type="submit" className="btn bg-blue-600 text-white text-xs font-semibold px-4">
                Thêm Nhãn
              </button>
            </form>

            {/* List of tags */}
            <div className="overflow-y-auto max-h-[350px] divide-y divide-slate-100 dark:divide-slate-700">
              {dbTags.length === 0 ? (
                <div className="text-center p-6 text-slate-400 text-xs">Chưa có nhãn nào được cấu hình.</div>
              ) : (
                dbTags.map((tag) => (
                  <div key={tag.id} className="flex justify-between items-center py-2.5">
                    <div className="flex items-center gap-2">
                      <span 
                        className="inline-block w-4 h-4 rounded-full border border-slate-200" 
                        style={{ backgroundColor: tag.color }}
                      ></span>
                      <span 
                        className="px-2 py-0.5 rounded text-white text-xs font-bold"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleDeleteTag(tag.id)} 
                      className="text-red-500 hover:text-red-700 text-sm"
                      title="Xóa nhãn"
                    >
                      <i className="mgc_delete_2_line"></i>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* COLUMN 2: SALES AGENT MANAGEMENT */}
          <div className="card p-5">
            <h3 className="text-lg font-bold mb-1 text-slate-800 flex items-center gap-2">
              <i className="mgc_user_3_line text-indigo-600"></i> Quản lý Nhân viên Sale
            </h3>
            <p className="text-xs text-slate-500 mb-4">Cấu hình danh sách nhân viên Sale và mã màu đại diện</p>

            {/* Form to create agent */}
            <form onSubmit={handleCreateAgent} className="flex gap-2 mb-4 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Tên nhân viên (VD: Sale 5 - Văn Minh)"
                  className="form-input text-xs border-slate-200 rounded-md py-2 w-full"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  required
                />
              </div>
              <div className="w-16 flex items-center justify-center">
                <input
                  type="color"
                  className="w-10 h-8 cursor-pointer rounded border border-slate-300"
                  value={newAgentColor}
                  onChange={(e) => setNewAgentColor(e.target.value)}
                />
              </div>
              <button type="submit" className="btn bg-indigo-600 text-white text-xs font-semibold px-4">
                Thêm Sale
              </button>
            </form>

            {/* List of agents */}
            <div className="overflow-y-auto max-h-[350px] divide-y divide-slate-100 dark:divide-slate-700">
              {dbAgents.length === 0 ? (
                <div className="text-center p-6 text-slate-400 text-xs">Chưa có nhân viên sale nào được cấu hình.</div>
              ) : (
                dbAgents.map((agent) => (
                  <div key={agent.id} className="flex justify-between items-center py-2.5">
                    <div className="flex items-center gap-2">
                      <span 
                        className="inline-block w-4 h-4 rounded-full border border-slate-200" 
                        style={{ backgroundColor: agent.color }}
                      ></span>
                      <span 
                        className="px-2 py-0.5 rounded text-white text-xs font-bold"
                        style={{ backgroundColor: agent.color }}
                      >
                        {agent.name}
                      </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleDeleteAgent(agent.id)} 
                      className="text-red-500 hover:text-red-700 text-sm"
                      title="Xóa nhân viên"
                    >
                      <i className="mgc_delete_2_line"></i>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== CONFIG DIFY MODAL ==================== */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">
                Cấu hình Dify AI - Page: {pages.find(p => p.pageId === filterPageId)?.pageName}
              </h3>
              <button onClick={() => setShowConfigModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <i className="mgc_close_line text-2xl"></i>
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              {/* API URL */}
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Dify API URL</label>
                <input
                  type="text"
                  className="form-input text-xs border-slate-200 rounded-md py-2 w-full"
                  value={configDifyUrl}
                  onChange={(e) => setConfigDifyUrl(e.target.value)}
                  placeholder="VD: https://api.dify.ai/v1"
                />
              </div>

              {/* API KEY */}
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Dify API Key</label>
                <div className="relative">
                  <input
                    type={showKeyText ? "text" : "password"}
                    className="form-input text-xs border-slate-200 rounded-md py-2 w-full pr-10"
                    value={configDifyKey}
                    onChange={(e) => setConfigDifyKey(e.target.value)}
                    placeholder="app-xxxxxxxxxxxxxxxxxxxxxxxx"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeyText(!showKeyText)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    <i className={showKeyText ? "mgc_eye_line" : "mgc_eye_close_line"}></i>
                  </button>
                </div>
              </div>

              {/* Global AI toggle */}
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <span className="text-xs text-slate-700 font-semibold block">Bật AI Tự Động Trả Lời</span>
                  <span className="text-[10px] text-slate-400">Cho phép hệ thống AI Dify tự rep tin nhắn khi khách chat.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={configAiEnabled}
                    onChange={(e) => setConfigAiEnabled(e.target.checked)}
                  />
                  <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Sales Engine toggle */}
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <span className="text-xs text-slate-700 font-semibold block">Bật Sales Engine Phân Tích</span>
                  <span className="text-[10px] text-slate-400">Tự động nhận dạng SĐT, khóa học và chuyển trạng thái CRM khách.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={configSalesEnabled}
                    onChange={(e) => setConfigSalesEnabled(e.target.checked)}
                  />
                  <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Follow-up Message */}
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">
                  Tin nhắn tự động Follow-up (Gửi sau 5 phút im lặng)
                </label>
                <textarea
                  rows={3}
                  className="form-input text-xs border-slate-200 rounded-md py-1.5 w-full"
                  value={configFollowUpMsg}
                  onChange={(e) => setConfigFollowUpMsg(e.target.value)}
                  placeholder="VD: Dạ em gửi lại thông tin khóa học..."
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2 bg-slate-50 dark:bg-slate-800/50">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="btn border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveAiConfig}
                className="btn bg-blue-600 text-white text-xs font-semibold"
                disabled={savingConfig}
              >
                {savingConfig ? (
                  <i className="mgc_loading_4_line animate-spin text-xs mr-1"></i>
                ) : (
                  <i className="mgc_save_line text-xs mr-1"></i>
                )}
                Lưu cấu hình
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FacebookPosts;
