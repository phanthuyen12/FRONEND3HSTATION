import React from "react";
import ChatWidgetSettings from "../ConfigAdmin/ChatWidgetSettings";
import ChatWidgetHistory from "./ChatWidgetHistory";

const AIChatAdmin: React.FC = () => {
  return (
    <>
      <div className="page-title-box">
        <div className="page-title-right">
          <ol className="breadcrumb m-0">
            <li className="breadcrumb-item">
              <a href="/admin/dashboard">Admin</a>
            </li>
            <li className="breadcrumb-item">Hỗ trợ</li>
            <li className="breadcrumb-item active">Quản lý chat AI</li>
          </ol>
        </div>
        <h4 className="page-title">
          <i className="mdi mdi-robot-outline me-2 text-primary" />
          Quản lý chat AI & Dify
        </h4>
      </div>

      <div className="alert alert-info">
        Khu vực này dùng để cấu hình Dify theo từng topic, quản lý nội dung widget ngoài client và theo dõi toàn bộ lịch sử chat.
      </div>

      <div className="row g-3 mb-2">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div className="avatar-sm bg-warning-subtle text-warning rounded-circle d-flex align-items-center justify-content-center">
                  <i className="mdi mdi-cog-outline fs-4" />
                </div>
                <div>
                  <h5 className="mb-1">Cấu hình widget & Dify</h5>
                  <div className="text-muted">
                    Quản lý tên trợ lý, giao diện ngoài client, topic hỏi nhanh và API Dify cho từng luồng.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div className="avatar-sm bg-info-subtle text-info rounded-circle d-flex align-items-center justify-content-center">
                  <i className="mdi mdi-message-text-clock-outline fs-4" />
                </div>
                <div>
                  <h5 className="mb-1">Lịch sử hội thoại</h5>
                  <div className="text-muted">
                    Xem tin nhắn khách gửi, phản hồi AI, lead để lại thông tin và lọc lại theo phiên chat.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChatWidgetSettings />
      <ChatWidgetHistory />
    </>
  );
};

export default AIChatAdmin;
