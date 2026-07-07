import React, { useEffect, useMemo, useState } from "react";
import chatWidgetService, {
  ChatWidgetHistoryItem,
  ChatWidgetHistoryStats,
} from "../../../services/chatWidgetService";

const defaultStats: ChatWidgetHistoryStats = {
  totalMessages: 0,
  totalSessions: 0,
  totalUserMessages: 0,
  totalAssistantMessages: 0,
  totalLeads: 0,
};

const roleLabel: Record<string, string> = {
  user: "Khách",
  assistant: "AI",
  system: "Hệ thống",
  lead: "Lead",
};

const eventTypeLabel: Record<string, string> = {
  message: "Tin nhắn",
  lead_capture: "Để lại thông tin",
  status: "Trạng thái",
};

const ChatWidgetHistory: React.FC = () => {
  const [items, setItems] = useState<ChatWidgetHistoryItem[]>([]);
  const [stats, setStats] = useState<ChatWidgetHistoryStats>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const loadData = async (nextPage = page, nextSearch = search, nextRole = role) => {
    setLoading(true);
    try {
      const [history, historyStats] = await Promise.all([
        chatWidgetService.getHistory({
          page: nextPage,
          limit: 20,
          search: nextSearch || undefined,
          role: nextRole || undefined,
        }),
        chatWidgetService.getHistoryStats(),
      ]);

      setItems(history.data || []);
      setPagination(history.pagination);
      setStats(historyStats);
    } catch (error) {
      console.error("Không thể tải lịch sử AI chat:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(1, "", "");
  }, []);

  const summaryCards = useMemo(
    () => [
      { label: "Tổng tin nhắn", value: stats.totalMessages, color: "primary" },
      { label: "Phiên chat", value: stats.totalSessions, color: "success" },
      { label: "Khách gửi", value: stats.totalUserMessages, color: "warning" },
      { label: "Lead để lại", value: stats.totalLeads, color: "info" },
    ],
    [stats]
  );

  return (
    <div className="card mt-4">
      <div className="card-header bg-light">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <h5 className="mb-1">
              <i className="mdi mdi-message-text-clock-outline text-primary me-2" />
              Lịch sử chat AI
            </h5>
            <div className="text-muted" style={{ fontSize: 13 }}>
              Theo dõi hội thoại, lead và nội dung mà khách đã nhắn với AI widget.
            </div>
          </div>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => loadData(page, search, role)}
            disabled={loading}
          >
            Làm mới
          </button>
        </div>
      </div>

      <div className="card-body">
        <div className="row g-3 mb-3">
          {summaryCards.map((card) => (
            <div key={card.label} className="col-md-3 col-sm-6">
              <div className={`border rounded-3 p-3 bg-${card.color}-subtle`}>
                <div className="small text-muted">{card.label}</div>
                <div className="fs-4 fw-bold">{card.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-7">
            <input
              className="form-control"
              placeholder="Tìm theo session, topic, nội dung, tên, số điện thoại..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select className="form-select" value={role} onChange={(event) => setRole(event.target.value)}>
              <option value="">Tất cả vai trò</option>
              <option value="user">Khách</option>
              <option value="assistant">AI</option>
              <option value="lead">Lead</option>
              <option value="system">Hệ thống</option>
            </select>
          </div>
          <div className="col-md-2 d-grid">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setPage(1);
                loadData(1, search, role);
              }}
            >
              Lọc
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Vai trò</th>
                <th>Topic</th>
                <th>Nội dung</th>
                <th>Session</th>
                <th>Liên hệ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">
                    Đang tải lịch sử chat...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">
                    Chưa có dữ liệu lịch sử chat.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td style={{ minWidth: 150 }}>
                      <div className="fw-semibold">
                        {new Date(item.createdAt).toLocaleString("vi-VN")}
                      </div>
                      <div className="small text-muted">{eventTypeLabel[item.eventType] || item.eventType}</div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {roleLabel[item.role] || item.role}
                      </span>
                    </td>
                    <td style={{ minWidth: 160 }}>
                      <div className="fw-semibold">{item.topicLabel || "Chưa rõ topic"}</div>
                      <div className="small text-muted">{item.topicId || "-"}</div>
                    </td>
                    <td style={{ minWidth: 280, whiteSpace: "pre-wrap" }}>
                      {item.message || <span className="text-muted">Không có nội dung</span>}
                    </td>
                    <td style={{ minWidth: 180 }}>
                      <code>{item.sessionId}</code>
                      <div className="small text-muted mt-1">{item.sourcePage || "-"}</div>
                    </td>
                    <td style={{ minWidth: 200 }}>
                      <div>{item.contactName || "-"}</div>
                      <div className="small text-muted">{item.contactPhone || "-"}</div>
                      <div className="small text-muted">{item.contactEmail || "-"}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3">
          <div className="text-muted small">
            Trang {pagination.page}/{Math.max(pagination.totalPages, 1)} · Tổng {pagination.total} bản ghi
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              disabled={pagination.page <= 1 || loading}
              onClick={() => {
                const nextPage = page - 1;
                setPage(nextPage);
                loadData(nextPage, search, role);
              }}
            >
              Trước
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              disabled={pagination.page >= pagination.totalPages || loading || pagination.totalPages === 0}
              onClick={() => {
                const nextPage = page + 1;
                setPage(nextPage);
                loadData(nextPage, search, role);
              }}
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWidgetHistory;
