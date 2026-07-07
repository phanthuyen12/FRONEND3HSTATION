import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import chatWidgetService, {
  ChatWidgetPublicConfig,
  ChatWidgetTopic,
} from "../services/chatWidgetService";
import "./ai-chat-widget.css";

type WidgetMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  timestamp: string;
};

type WidgetIconName =
  | "robot"
  | "expand"
  | "collapse"
  | "close"
  | "arrowRight"
  | "send"
  | "school"
  | "money"
  | "map"
  | "calendar"
  | "gift"
  | "mentor"
  | "certificate"
  | "phone"
  | "signup"
  | "chat"
  | "shield";

const ADMIN_QR_MARKER = "[[ADMIN_QR]]";

const TOPIC_ICON_RULES: Array<{ pattern: RegExp; icon: WidgetIconName }> = [
  { pattern: /bootcamp|chương trình|khoá|khóa|tổng quan/i, icon: "school" },
  { pattern: /giá|học phí|chi phí|bao nhiêu/i, icon: "money" },
  { pattern: /địa điểm|ở đâu|địa chỉ|location|nơi/i, icon: "map" },
  { pattern: /lịch|khi nào|thời gian|ngày/i, icon: "calendar" },
  { pattern: /ưu đãi|quà|tặng|khuyến mãi/i, icon: "gift" },
  { pattern: /mentor|giảng viên|người hướng dẫn/i, icon: "mentor" },
  { pattern: /chứng chỉ|certificate/i, icon: "certificate" },
  { pattern: /liên hệ|gọi|hotline|tư vấn/i, icon: "phone" },
];

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const WidgetIcon: React.FC<{ name: WidgetIconName; className?: string }> = ({ name, className }) => {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const renderPath = () => {
    switch (name) {
      case "robot":
        return (
          <>
            <rect x="5" y="8" width="14" height="10" rx="3" {...common} />
            <path d="M12 5v3M9 13h.01M15 13h.01M9 18v2M15 18v2M3 12h2M19 12h2" {...common} />
          </>
        );
      case "expand":
        return <path d="M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5M3 8l6-5M21 8l-6-5M3 16l6 5M21 16l-6 5" {...common} />;
      case "collapse":
        return <path d="M9 3H3v6M15 3h6v6M3 15v6h6M21 15v6h-6M3 9l6-6M21 9l-6-6M3 15l6 6M21 15l-6 6" {...common} />;
      case "close":
        return <path d="M6 6l12 12M18 6L6 18" {...common} />;
      case "arrowRight":
        return <path d="M9 6l6 6-6 6M5 12h10" {...common} />;
      case "send":
        return (
          <>
            <path d="M4 11.5L20 4l-4.6 16-3.1-5.2L4 11.5z" fill="currentColor" stroke="none" />
            <path d="M11.8 14.8L20 4" {...common} strokeWidth={2.2} />
          </>
        );
      case "school":
        return <path d="M3 9l9-5 9 5-9 5-9-5zM7 11v4c0 1.7 2.2 3 5 3s5-1.3 5-3v-4M21 10v6" {...common} />;
      case "money":
        return <path d="M4 7h16v10H4zM9 12h6M12 9v6" {...common} />;
      case "map":
        return <path d="M12 21s6-4.8 6-10a6 6 0 10-12 0c0 5.2 6 10 6 10zM12 11.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" {...common} />;
      case "calendar":
        return <path d="M7 3v4M17 3v4M4 8h16M5 6h14a1 1 0 011 1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7a1 1 0 011-1z" {...common} />;
      case "gift":
        return <path d="M12 7v14M4 10h16v4H4zM5 21h14V10H5zM12 7H8.5a2.5 2.5 0 110-5c2.5 0 3.5 3 3.5 5zM12 7h3.5a2.5 2.5 0 100-5C13 2 12 5 12 7z" {...common} />;
      case "mentor":
        return <path d="M12 12a4 4 0 100-8 4 4 0 000 8zM5 20a7 7 0 0114 0M18 8h3M19.5 6.5v3" {...common} />;
      case "certificate":
        return <path d="M7 4h10a2 2 0 012 2v7a2 2 0 01-2 2h-3l-2 5-2-5H7a2 2 0 01-2-2V6a2 2 0 012-2zM9 9h6" {...common} />;
      case "phone":
        return <path d="M8 4h3l1 4-2 1a14 14 0 006 6l1-2 4 1v3a2 2 0 01-2 2A17 17 0 015 5a2 2 0 013-1z" {...common} />;
      case "signup":
        return <path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 20a8 8 0 0116 0M19 8h4M21 6v4" {...common} />;
      case "chat":
        return <path d="M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H9l-4 3v-3H5a2 2 0 01-2-2V8a2 2 0 012-2z" {...common} />;
      case "shield":
        return <path d="M12 3l7 3v5c0 4.4-3 8.2-7 10-4-1.8-7-5.6-7-10V6l7-3zM9 12l2 2 4-4" {...common} />;
      default:
        return null;
    }
  };

  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      {renderPath()}
    </svg>
  );
};

const getTopicIcon = (topic: ChatWidgetTopic) => {
  const haystack = `${topic.label} ${topic.description} ${topic.starterQuestion}`.trim();
  const matched = TOPIC_ICON_RULES.find((rule) => rule.pattern.test(haystack));
  return matched?.icon || "chat";
};

const renderTextWithLineBreaks = (text: string) =>
  text.split("\n").map((line, index, lines) => (
    <React.Fragment key={`line-${index}`}>
      {line}
      {index < lines.length - 1 ? <br /> : null}
    </React.Fragment>
  ));

const parseMessageParts = (text: string) => text.split(ADMIN_QR_MARKER);

const AIChatWidget: React.FC = () => {
  const location = useLocation();
  const socketRef = useRef<WebSocket | null>(null);
  const socketPromiseRef = useRef<Promise<WebSocket> | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLTextAreaElement | null>(null);
  const sessionIdRef = useRef<string>(chatWidgetService.getStoredSessionId());
  const [config, setConfig] = useState<ChatWidgetPublicConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showMessagesPanel, setShowMessagesPanel] = useState(false);
  const [messages, setMessages] = useState<WidgetMessage[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: "",
    phone: "",
    email: "",
    note: "",
  });

  const shouldHide = useMemo(
    () => location.pathname.startsWith("/admin") || location.pathname.startsWith("/charius"),
    [location.pathname]
  );

  const appendMessage = (role: WidgetMessage["role"], text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: createId(),
        role,
        text,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const resetWelcome = (nextConfig: ChatWidgetPublicConfig) => {
    setMessages([
      {
        id: "welcome-message",
        role: "assistant",
        text: nextConfig.welcomeMessage,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  useEffect(() => {
    if (!messagesRef.current) return;
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages, isTyping, leadOpen]);

  useEffect(() => {
    const textarea = composerRef.current;
    if (!textarea) return;

    textarea.style.height = "0px";
    const nextHeight = Math.min(Math.max(textarea.scrollHeight, 58), 160);
    textarea.style.height = `${nextHeight}px`;
  }, [draft, open, expanded]);

  useEffect(() => {
    if (shouldHide) return;

    let cancelled = false;
    setLoading(true);

    chatWidgetService
      .getPublicConfig()
      .then((data) => {
        if (cancelled || !data?.enabled) {
          setConfig(data || null);
          return;
        }

        setConfig(data);
        resetWelcome(data);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("AI chat widget config error:", err);
          setConfig(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [shouldHide]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        try {
          socketRef.current.close();
        } catch (_error) {
          // Ignore cleanup close errors.
        }
      }
    };
  }, []);

  const connectSocket = async (): Promise<WebSocket> => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return socketRef.current;
    }

    if (socketPromiseRef.current) {
      return socketPromiseRef.current;
    }

    const url = chatWidgetService.buildSocketUrl(location.pathname, sessionIdRef.current || undefined);
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socketPromiseRef.current = new Promise((resolve, reject) => {
      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            type: "init",
            page: location.pathname,
            userProfile: {
              name: leadForm.name,
              phone: leadForm.phone,
              email: leadForm.email,
            },
          })
        );
        setConnected(true);
        resolve(socket);
      };

      socket.onerror = () => {
        setConnected(false);
        socketPromiseRef.current = null;
        reject(new Error("Không thể kết nối đến AI chat socket"));
      };
    });

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        if (payload.type === "SESSION_READY" || payload.type === "INIT_ACK") {
          if (payload.sessionId) {
            sessionIdRef.current = payload.sessionId;
            chatWidgetService.saveSessionId(payload.sessionId);
          }
          return;
        }

        if (payload.type === "TOPIC_SELECTED") {
          if (payload.topicId) {
            setSelectedTopicId(payload.topicId);
          }
          return;
        }

        if (payload.type === "ASSISTANT_TYPING") {
          setIsTyping(Boolean(payload.active));
          return;
        }

        if (payload.type === "ASSISTANT_MESSAGE") {
          setIsTyping(false);
          appendMessage("assistant", payload.message || "Hệ thống đang cập nhật nội dung.");
          return;
        }

        if (payload.type === "LEAD_SUBMITTING") {
          setLeadSubmitting(Boolean(payload.active));
          return;
        }

        if (payload.type === "LEAD_CAPTURED") {
          setLeadSubmitting(false);
          setLeadOpen(false);
          setLeadForm({ name: "", phone: "", email: "", note: "" });
          appendMessage(
            "assistant",
            payload.message || config?.leadSuccessMessage || "Đã ghi nhận thông tin của bạn."
          );
          return;
        }

        if (payload.type === "ERROR") {
          setIsTyping(false);
          setLeadSubmitting(false);
          setError(payload.message || "Đã có lỗi khi xử lý AI chat.");
        }
      } catch (err) {
        console.error("AI chat socket message parse error:", err);
      }
    };

    socket.onclose = () => {
      if (socketRef.current === socket) {
        socketRef.current = null;
      }
      socketPromiseRef.current = null;
      setConnected(false);
      setIsTyping(false);
      setLeadSubmitting(false);
    };

    return socketPromiseRef.current;
  };

  const selectedTopic = useMemo(
    () => config?.topics.find((topic) => topic.id === selectedTopicId) || null,
    [config?.topics, selectedTopicId]
  );

  const introMessage = useMemo(() => {
    if (messages[0]?.id === "welcome-message") {
      return messages[0];
    }
    return {
      id: "welcome-fallback",
      role: "assistant" as const,
      text: config?.welcomeMessage || "",
      timestamp: new Date().toISOString(),
    };
  }, [config?.welcomeMessage, messages]);

  const conversationMessages = useMemo(
    () => (messages[0]?.id === "welcome-message" ? messages.slice(1) : messages),
    [messages]
  );

  const hasStartedConversation = useMemo(
    () => conversationMessages.length > 0 || isTyping || leadOpen,
    [conversationMessages.length, isTyping, leadOpen]
  );

  const shouldShowMessages = hasStartedConversation || showMessagesPanel;

  const visibleMessages = useMemo(
    () => (shouldShowMessages ? [introMessage, ...conversationMessages] : []),
    [conversationMessages, introMessage, shouldShowMessages]
  );

  const resolveDefaultTopic = () => selectedTopicId || config?.topics?.[0]?.id || "";

  const adminQrImageUrl = useMemo(
    () => chatWidgetService.getPublicAssetUrl("/images/admin-zalo-ros-pham.jpg"),
    []
  );

  const renderMessageContent = (text: string) => {
    const parts = parseMessageParts(text);

    return parts.map((part, index) => (
      <React.Fragment key={`part-${index}`}>
        {part ? (
          <span className="ai-chat-widget__bubble-text">
            {renderTextWithLineBreaks(part)}
          </span>
        ) : null}
        {index < parts.length - 1 ? (
          <div className="ai-chat-widget__bubble-media">
            <img
              src={adminQrImageUrl}
              alt="QR Zalo admin Ros Pham"
              className="ai-chat-widget__bubble-image"
              loading="lazy"
            />
            <div className="ai-chat-widget__bubble-caption">QR Zalo admin Ros Pham</div>
          </div>
        ) : null}
      </React.Fragment>
    ));
  };

  const sendSocketPayload = async (payload: Record<string, any>) => {
    const socket = await connectSocket();
    socket.send(JSON.stringify(payload));
  };

  const handleTopicClick = async (topic: ChatWidgetTopic) => {
    setError("");
    setSelectedTopicId(topic.id);
    setOpen(true);
    setShowMessagesPanel(true);

    try {
      await sendSocketPayload({
        type: "select_topic",
        topicId: topic.id,
      });

      const question = (topic.starterQuestion || topic.label || "").trim();
      if (!question) return;

      appendMessage("user", question);
      setIsTyping(true);
      await sendSocketPayload({
        type: "user_message",
        topicId: topic.id,
        message: question,
      });
    } catch (err: any) {
      setIsTyping(false);
      setError(err.message || "Không thể gửi topic đến AI.");
    }
  };

  const handleSendMessage = async () => {
    const text = draft.trim();
    if (!text) return;

    const topicId = resolveDefaultTopic();
    if (!topicId) {
      setError("Vui lòng tạo ít nhất một topic cho widget.");
      return;
    }

    setError("");
    setDraft("");
    setSelectedTopicId(topicId);
    setShowMessagesPanel(true);
    appendMessage("user", text);
    setIsTyping(true);

    try {
      await sendSocketPayload({
        type: "user_message",
        topicId,
        message: text,
      });
    } catch (err: any) {
      setIsTyping(false);
      setError(err.message || "Không thể gửi tin nhắn lúc này.");
    }
  };

  const handleLeadOpen = () => {
    setLeadOpen((prev) => !prev);
    setShowMessagesPanel(true);
    if (!selectedTopicId && config?.topics?.[0]?.id) {
      setSelectedTopicId(config.topics[0].id);
    }
  };

  const handleLeadSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const topicId = resolveDefaultTopic();
    if (!topicId) {
      setError("Vui lòng chọn topic trước khi để lại thông tin.");
      return;
    }

    if (!leadForm.name.trim() || !leadForm.phone.trim()) {
      setError("Vui lòng nhập họ tên và số điện thoại.");
      return;
    }

    setError("");

    try {
      await sendSocketPayload({
        type: "submit_lead",
        topicId,
        lead: leadForm,
      });
    } catch (err: any) {
      setLeadSubmitting(false);
      setError(err.message || "Không thể lưu thông tin lúc này.");
    }
  };

  if (shouldHide || loading || !config?.enabled) {
    return null;
  }

  return (
    <div className={`ai-chat-widget ${expanded ? "ai-chat-widget--expanded" : ""}`}>
      {!open && (
        <button
          type="button"
          className="ai-chat-widget__launcher"
          onClick={() => {
            setOpen(true);
            setExpanded(false);
            setError("");
            connectSocket().catch((err) => setError(err.message || "Không thể kết nối chat."));
          }}
        >
          <span className="ai-chat-widget__launcher-badge">
            <WidgetIcon name="robot" className="ai-chat-widget__inline-icon" />
          </span>
          <span className="ai-chat-widget__launcher-copy">
            <strong>{config.assistantName}</strong>
            <span>{config.assistantSubtitle}</span>
          </span>
        </button>
      )}

      {open && (
        <div className="ai-chat-widget__panel">
          <div className="ai-chat-widget__header">
            <div className="ai-chat-widget__header-main">
              <div className="ai-chat-widget__avatar">
                <WidgetIcon name="robot" className="ai-chat-widget__inline-icon ai-chat-widget__inline-icon--large" />
              </div>
              <div className="ai-chat-widget__title-wrap">
                <h3 className="ai-chat-widget__title">{config.assistantName}</h3>
                <div className="ai-chat-widget__subtitle">
                  <span className="ai-chat-widget__status-pill ai-chat-widget__status-pill--online">
                    <span className="ai-chat-widget__dot" />
                    {connected ? "Trực tuyến" : "Đang chờ"}
                  </span>
                  <span className="ai-chat-widget__status-pill">Phản hồi tức thì</span>
                  <span className="ai-chat-widget__status-pill">
                    <WidgetIcon name="shield" className="ai-chat-widget__inline-icon ai-chat-widget__inline-icon--tiny" />
                    Bảo mật
                  </span>
                </div>
              </div>
            </div>

            <div className="ai-chat-widget__header-actions">
              <button
                type="button"
                className="ai-chat-widget__header-button"
                onClick={() => setExpanded((prev) => !prev)}
                aria-label={expanded ? "Thu nhỏ hộp chat" : "Phóng to hộp chat"}
                title={expanded ? "Thu nhỏ" : "Phóng to"}
              >
                <WidgetIcon
                  name={expanded ? "collapse" : "expand"}
                  className="ai-chat-widget__inline-icon ai-chat-widget__inline-icon--small"
                />
              </button>
              <button
                type="button"
                className="ai-chat-widget__header-button ai-chat-widget__close"
                onClick={() => {
                  setOpen(false);
                  setExpanded(false);
                }}
                aria-label="Đóng hộp chat"
              >
                <WidgetIcon name="close" className="ai-chat-widget__inline-icon ai-chat-widget__inline-icon--small" />
              </button>
            </div>
          </div>

          <div className="ai-chat-widget__body">
            {!shouldShowMessages && (
              <div className="ai-chat-widget__hero">
                <div className="ai-chat-widget__hero-card">
                  <div className="ai-chat-widget__hero-kicker">AI Assistant</div>
                  <div className="ai-chat-widget__hero-title">Xin chào, mình có thể hỗ trợ bạn ngay.</div>
                  <p>{introMessage.text}</p>
                </div>
              </div>
            )}

            {!hasStartedConversation && config.topics?.length > 0 && (
              <div className="ai-chat-widget__topics-section">
                <div className="ai-chat-widget__section-bar">
                  <div className="ai-chat-widget__section-heading">Quick Actions</div>
                  <button
                    type="button"
                    className="ai-chat-widget__view-messages"
                    onClick={() => setShowMessagesPanel((prev) => !prev)}
                  >
                    <WidgetIcon
                      name="chat"
                      className="ai-chat-widget__inline-icon ai-chat-widget__inline-icon--tiny"
                    />
                    <span>{shouldShowMessages ? "Ẩn tin nhắn" : "Xem tin nhắn"}</span>
                  </button>
                </div>
                <div className="ai-chat-widget__topics">
                  {config.topics.map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      className={`ai-chat-widget__topic ${
                        selectedTopicId === topic.id ? "ai-chat-widget__topic--active" : ""
                      }`}
                      onClick={() => handleTopicClick(topic)}
                    >
                      <span className="ai-chat-widget__topic-icon">
                        <WidgetIcon
                          name={getTopicIcon(topic)}
                          className="ai-chat-widget__inline-icon ai-chat-widget__inline-icon--small"
                        />
                      </span>
                      <span className="ai-chat-widget__topic-copy">
                        <strong>{topic.label}</strong>
                        {topic.description && <small>{topic.description}</small>}
                      </span>
                      <WidgetIcon
                        name="arrowRight"
                        className="ai-chat-widget__inline-icon ai-chat-widget__inline-icon--tiny ai-chat-widget__topic-arrow"
                      />
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`ai-chat-widget__topic ai-chat-widget__topic--cta ${
                      leadOpen ? "ai-chat-widget__topic--active" : ""
                    }`}
                    onClick={handleLeadOpen}
                  >
                    <span className="ai-chat-widget__topic-icon">
                      <WidgetIcon
                        name="signup"
                        className="ai-chat-widget__inline-icon ai-chat-widget__inline-icon--small"
                      />
                    </span>
                    <span className="ai-chat-widget__topic-copy">
                      <strong>Đăng ký nhanh</strong>
                      <small>{config.leadButtonLabel}</small>
                    </span>
                    <WidgetIcon
                      name="arrowRight"
                      className="ai-chat-widget__inline-icon ai-chat-widget__inline-icon--tiny ai-chat-widget__topic-arrow"
                    />
                  </button>
                </div>
              </div>
            )}

            {shouldShowMessages && (
              <div className="ai-chat-widget__messages-shell">
                <div className="ai-chat-widget__messages" ref={messagesRef}>
                  {visibleMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`ai-chat-widget__message-row ai-chat-widget__message-row--${message.role}`}
                    >
                      {message.role === "assistant" && (
                        <div className="ai-chat-widget__message-avatar">
                          <WidgetIcon
                            name="robot"
                            className="ai-chat-widget__inline-icon ai-chat-widget__inline-icon--small"
                          />
                        </div>
                      )}
                      <div
                        className={`ai-chat-widget__bubble ai-chat-widget__bubble--${message.role}`}
                      >
                        {renderMessageContent(message.text)}
                        <div className="ai-chat-widget__meta">
                          {new Date(message.timestamp).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  ))}

                  {!hasStartedConversation && (
                    <div className="ai-chat-widget__empty">
                      Chưa có tin nhắn mới. Hãy chọn một chủ đề nhanh hoặc nhập câu hỏi để bắt đầu.
                    </div>
                  )}

                  {isTyping && (
                    <div
                      className="ai-chat-widget__message-row ai-chat-widget__message-row--assistant"
                    >
                      <div className="ai-chat-widget__message-avatar">
                        <WidgetIcon
                          name="robot"
                          className="ai-chat-widget__inline-icon ai-chat-widget__inline-icon--small"
                        />
                      </div>
                      <div className="ai-chat-widget__bubble ai-chat-widget__bubble--assistant ai-chat-widget__bubble--typing">
                        <span className="ai-chat-widget__typing" aria-label="Assistant is typing">
                          <span />
                          <span />
                          <span />
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="ai-chat-widget__composer">
              {leadOpen && (
                <form className="ai-chat-widget__lead-panel" onSubmit={handleLeadSubmit}>
                  <div className="ai-chat-widget__lead-head">
                    <div>
                      <h4>{config.leadTitle}</h4>
                      <p>{config.leadDescription}</p>
                    </div>
                    <button
                      type="button"
                      className="ai-chat-widget__lead-close"
                      onClick={() => setLeadOpen(false)}
                      aria-label="Đóng form đăng ký"
                    >
                      <WidgetIcon
                        name="close"
                        className="ai-chat-widget__inline-icon ai-chat-widget__inline-icon--tiny"
                      />
                    </button>
                  </div>

                  <div className="ai-chat-widget__lead-grid">
                    <input
                      className="ai-chat-widget__input"
                      placeholder="Họ và tên"
                      lang="vi"
                      spellCheck={false}
                      value={leadForm.name}
                      onChange={(event) =>
                        setLeadForm((prev) => ({ ...prev, name: event.target.value }))
                      }
                    />
                    <input
                      className="ai-chat-widget__input"
                      placeholder="Số điện thoại"
                      lang="vi"
                      spellCheck={false}
                      value={leadForm.phone}
                      onChange={(event) =>
                        setLeadForm((prev) => ({ ...prev, phone: event.target.value }))
                      }
                    />
                    <input
                      className="ai-chat-widget__input"
                      placeholder="Email (không bắt buộc)"
                      lang="vi"
                      spellCheck={false}
                      value={leadForm.email}
                      onChange={(event) =>
                        setLeadForm((prev) => ({ ...prev, email: event.target.value }))
                      }
                    />
                    <textarea
                      className="ai-chat-widget__textarea"
                      placeholder={`Nhu cầu cần hỗ trợ${selectedTopic ? ` về "${selectedTopic.label}"` : ""}`}
                      lang="vi"
                      spellCheck={false}
                      value={leadForm.note}
                      onChange={(event) =>
                        setLeadForm((prev) => ({ ...prev, note: event.target.value }))
                      }
                    />
                  </div>

                  <div className="ai-chat-widget__lead-actions">
                    <button
                      type="button"
                      className="ai-chat-widget__ghost"
                      onClick={() => setLeadOpen(false)}
                      disabled={leadSubmitting}
                    >
                      Để sau
                    </button>
                    <button type="submit" className="ai-chat-widget__primary" disabled={leadSubmitting}>
                      {leadSubmitting ? "Đang gửi..." : "Gửi thông tin"}
                    </button>
                  </div>
                </form>
              )}

              <div className="ai-chat-widget__composer-shell">
                <div className="ai-chat-widget__composer-input-wrap">
                  <textarea
                    ref={composerRef}
                    className="ai-chat-widget__composer-input"
                    rows={1}
                    placeholder={
                      selectedTopic
                        ? `${config.inputPlaceholder} (${selectedTopic.label})`
                        : config.inputPlaceholder || "Nhập câu hỏi của bạn..."
                    }
                    lang="vi"
                    spellCheck={false}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="ai-chat-widget__send"
                    onClick={handleSendMessage}
                    aria-label={config.sendButtonLabel || "Gửi"}
                    title={config.sendButtonLabel || "Gửi"}
                  >
                    <WidgetIcon
                      name="send"
                      className="ai-chat-widget__inline-icon ai-chat-widget__inline-icon--small"
                    />
                  </button>
                </div>

                <div className="ai-chat-widget__composer-footer">
                  <div className="ai-chat-widget__composer-badges">
                    <span className="ai-chat-widget__mini-badge">
                      <span className="ai-chat-widget__dot ai-chat-widget__dot--small" />
                      {connected ? "Đã kết nối" : "Tự động kết nối"}
                    </span>
                    {selectedTopic && (
                      <span className="ai-chat-widget__mini-badge ai-chat-widget__mini-badge--topic">
                        {selectedTopic.label}
                      </span>
                    )}
                  </div>
                  <div className="ai-chat-widget__composer-actions">
                    {!hasStartedConversation && (
                      <button
                        type="button"
                        className="ai-chat-widget__view-messages ai-chat-widget__view-messages--compact"
                        onClick={() => setShowMessagesPanel((prev) => !prev)}
                      >
                        <WidgetIcon
                          name="chat"
                          className="ai-chat-widget__inline-icon ai-chat-widget__inline-icon--tiny"
                        />
                        <span>{shouldShowMessages ? "Ẩn tin nhắn" : "Xem tin nhắn"}</span>
                      </button>
                    )}
                    <button type="button" className="ai-chat-widget__lead-link" onClick={handleLeadOpen}>
                      {leadOpen ? "Ẩn đăng ký" : "Đăng ký / Giữ chỗ"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="ai-chat-widget__status">
                Hoặc nhập câu hỏi để nhận được câu trả lời phù hợp nhất.
              </div>
              {error && <div className="ai-chat-widget__error">{error}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatWidget;
