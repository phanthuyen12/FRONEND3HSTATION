import React, { useEffect, useMemo, useState } from "react";
import chatWidgetService, {
  ChatWidgetAdminConfig,
  ChatWidgetAdminTopic,
} from "../../../services/chatWidgetService";

type TopicForm = Omit<ChatWidgetAdminTopic, "difyInputs"> & {
  difyInputsText: string;
};

type SettingsForm = Omit<ChatWidgetAdminConfig, "topics"> & {
  topics: TopicForm[];
};

const createTopicId = () => `topic-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;

const toFormState = (config: ChatWidgetAdminConfig): SettingsForm => ({
  ...config,
  topics: (config.topics || []).map((topic) => ({
    ...topic,
    difyInputsText: JSON.stringify(topic.difyInputs || {}, null, 2),
  })),
});

const buildPayload = (form: SettingsForm): ChatWidgetAdminConfig => ({
  ...form,
  topics: form.topics.map(({ difyInputsText, ...topic }) => ({
    ...topic,
    difyInputs: JSON.parse(difyInputsText || "{}"),
  })),
});

const emptyTopic = (): TopicForm => ({
  id: createTopicId(),
  label: "",
  description: "",
  starterQuestion: "",
  openingMessage: "",
  difyInputsText: "{\n  \"topic_code\": \"new-topic\"\n}",
  enabled: true,
});

const ChatWidgetSettings: React.FC = () => {
  const [form, setForm] = useState<SettingsForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    chatWidgetService
      .getAdminConfig()
      .then((data) => {
        if (!cancelled) {
          setForm(toFormState(data));
        }
      })
      .catch((err: any) => {
        if (!cancelled) {
          setError(err.message || "Không thể tải cấu hình AI chat");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const topicCount = useMemo(() => form?.topics.filter((topic) => topic.enabled).length || 0, [form]);

  const setField = (name: keyof SettingsForm, value: any) => {
    setForm((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const setTopicField = (index: number, name: keyof TopicForm, value: any) => {
    setForm((prev) => {
      if (!prev) return prev;
      const nextTopics = [...prev.topics];
      nextTopics[index] = {
        ...nextTopics[index],
        [name]: value,
      };
      return {
        ...prev,
        topics: nextTopics,
      };
    });
  };

  const addTopic = () => {
    setForm((prev) =>
      prev
        ? {
            ...prev,
            topics: [...prev.topics, emptyTopic()],
          }
        : prev
    );
  };

  const removeTopic = (index: number) => {
    setForm((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        topics: prev.topics.filter((_, topicIndex) => topicIndex !== index),
      };
    });
  };

  const handleSave = async () => {
    if (!form) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = buildPayload(form);
      const updated = await chatWidgetService.updateAdminConfig(payload);
      setForm(toFormState(updated));
      setSuccess("Đã lưu cấu hình AI chat widget thành công.");
      window.setTimeout(() => setSuccess(""), 3500);
    } catch (err: any) {
      setError(err.message || "Không thể lưu cấu hình AI chat");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card mt-3">
          <div className="card-body d-flex align-items-center gap-2">
            <div className="spinner-border spinner-border-sm text-primary" role="status" />
          <span className="text-muted">Đang tải cấu hình AI chat widget...</span>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="card mt-3">
        <div className="card-body">
          <div className="alert alert-danger mb-0">{error || "Không tải được cấu hình AI chat widget."}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card mt-4">
      <div className="card-header bg-light d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div>
          <h5 className="mb-1">
            <i className="mdi mdi-robot-excited-outline text-primary me-2" />
            AI Chat Widget + Dify
          </h5>
          <div className="text-muted" style={{ fontSize: 13 }}>
            Admin có thể cấu hình một Dify app dùng chung cho toàn widget, còn từng topic chỉ định nghĩa câu hỏi, nội dung và biến đầu vào riêng.
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-soft-primary text-primary px-3 py-2">
            {topicCount} topic đang bật
          </span>
          <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu AI Chat"}
          </button>
        </div>
      </div>

      <div className="card-body">
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label fw-semibold">Bật widget</label>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={form.enabled}
                onChange={(event) => setField("enabled", event.target.checked)}
              />
              <label className="form-check-label">{form.enabled ? "Đang bật" : "Đang tắt"}</label>
            </div>
          </div>
          <div className="col-md-5">
            <label className="form-label fw-semibold">Tên trợ lý</label>
            <input
              className="form-control"
              value={form.assistantName}
              onChange={(event) => setField("assistantName", event.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Trạng thái hiển thị</label>
            <input
              className="form-control"
              value={form.assistantSubtitle}
              onChange={(event) => setField("assistantSubtitle", event.target.value)}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label fw-semibold">Avatar emoji</label>
            <input
              className="form-control"
              value={form.avatarEmoji}
              onChange={(event) => setField("avatarEmoji", event.target.value)}
            />
          </div>
          <div className="col-md-5">
            <label className="form-label fw-semibold">Placeholder khung chat</label>
            <input
              className="form-control"
              value={form.inputPlaceholder}
              onChange={(event) => setField("inputPlaceholder", event.target.value)}
            />
          </div>
          <div className="col-md-5">
            <label className="form-label fw-semibold">Label nút để lại thông tin</label>
            <input
              className="form-control"
              value={form.leadButtonLabel}
              onChange={(event) => setField("leadButtonLabel", event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Tiêu đề form lead</label>
            <input
              className="form-control"
              value={form.leadTitle}
              onChange={(event) => setField("leadTitle", event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Mô tả form lead</label>
            <input
              className="form-control"
              value={form.leadDescription}
              onChange={(event) => setField("leadDescription", event.target.value)}
            />
          </div>
          <div className="col-12">
            <label className="form-label fw-semibold">Lời chào đầu widget</label>
            <textarea
              className="form-control"
              rows={4}
              value={form.welcomeMessage}
              onChange={(event) => setField("welcomeMessage", event.target.value)}
            />
          </div>
          <div className="col-12">
            <label className="form-label fw-semibold">Tin nhắn xác nhận sau khi để lại thông tin</label>
            <textarea
              className="form-control"
              rows={3}
              value={form.leadSuccessMessage}
              onChange={(event) => setField("leadSuccessMessage", event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Dify API URL dùng chung</label>
            <input
              className="form-control"
              value={form.difyApiUrl}
              onChange={(event) => setField("difyApiUrl", event.target.value)}
              placeholder="https://api.dify.ai/v1"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Dify API Key tổng</label>
            <input
              className="form-control"
              value={form.difyApiKey}
              onChange={(event) => setField("difyApiKey", event.target.value)}
              placeholder="app-xxxxxxxx"
            />
          </div>
          <div className="col-12">
            <div className="border rounded-3 p-3 bg-light-subtle">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div>
                  <div className="fw-semibold">Native AI theo từng user</div>
                  <div className="text-muted" style={{ fontSize: 13 }}>
                    Nếu user đang đăng nhập, hệ thống sẽ tự gửi hồ sơ user và danh sách khóa học/tiến độ học sang Dify để AI trả lời theo ngữ cảnh riêng của user đó.
                  </div>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={form.enableNativeUserContext}
                    onChange={(event) => setField("enableNativeUserContext", event.target.checked)}
                  />
                  <label className="form-check-label">
                    {form.enableNativeUserContext ? "Đang bật" : "Đang tắt"}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
          <div>
            <h6 className="mb-1">Danh sách topic</h6>
            <div className="text-muted" style={{ fontSize: 13 }}>
              Mỗi topic chỉ cần cấu hình nội dung và `difyInputs`. Dify URL/Key được dùng chung ở phía trên cho toàn bộ widget.
            </div>
          </div>
          <button type="button" className="btn btn-outline-primary" onClick={addTopic}>
            <i className="mdi mdi-plus me-1" />
            Thêm topic
          </button>
        </div>

        <div className="d-flex flex-column gap-3">
          {form.topics.map((topic, index) => (
            <div key={topic.id || index} className="border rounded-3 p-3">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <div>
                  <strong>Topic #{index + 1}</strong>
                  <div className="text-muted" style={{ fontSize: 13 }}>
                    ID: {topic.id || "(sẽ tạo tự động)"}
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={topic.enabled}
                      onChange={(event) => setTopicField(index, "enabled", event.target.checked)}
                    />
                    <label className="form-check-label">{topic.enabled ? "Bật" : "Tắt"}</label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeTopic(index)}
                  >
                    Xóa
                  </button>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">ID topic</label>
                  <input
                    className="form-control"
                    value={topic.id}
                    onChange={(event) => setTopicField(index, "id", event.target.value)}
                    placeholder="bootcamp-overview"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Nhãn nút</label>
                  <input
                    className="form-control"
                    value={topic.label}
                    onChange={(event) => setTopicField(index, "label", event.target.value)}
                    placeholder="Bootcamp là gì?"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Mô tả ngắn</label>
                  <input
                    className="form-control"
                    value={topic.description}
                    onChange={(event) => setTopicField(index, "description", event.target.value)}
                    placeholder="Tổng quan chương trình"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Câu hỏi gửi nhanh khi bấm nút</label>
                  <input
                    className="form-control"
                    value={topic.starterQuestion}
                    onChange={(event) => setTopicField(index, "starterQuestion", event.target.value)}
                    placeholder="Học phí gồm những gì?"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Tin nhắn mở đầu khi chọn topic</label>
                  <input
                    className="form-control"
                    value={topic.openingMessage}
                    onChange={(event) => setTopicField(index, "openingMessage", event.target.value)}
                    placeholder="Em sẵn sàng tư vấn topic này cho mình."
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Static inputs JSON gửi sang Dify</label>
                  <textarea
                    className="form-control font-monospace"
                    rows={6}
                    value={topic.difyInputsText}
                    onChange={(event) => setTopicField(index, "difyInputsText", event.target.value)}
                  />
                  <div className="form-text">
                    Ví dụ: {`{ "topic_code": "hoc-phi", "campaign": "bootcamp-cam-ranh" }`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatWidgetSettings;
