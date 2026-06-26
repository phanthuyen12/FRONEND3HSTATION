// src/pages/apps/AdminTools/FacebookAdmin/Pages.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface FbPage {
  id: string;
  pageId: string;
  pageName: string;
  status: string; // 'connected' | 'disconnected'
}

/**
 * Admin UI for managing Facebook Pages.
 * - Lists pages from the backend.
 * - Provides a Connect button for pages that are not yet connected.
 * - In a full implementation the Connect flow would redirect to Facebook OAuth.
 */
const FacebookPages: React.FC = () => {
  const [pages, setPages] = useState<FbPage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await axios.get('/api/admin/facebook/pages');
        setPages(res.data);
      } catch (err) {
        console.error('Failed to load pages', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  const handleConnect = async (pageId: string) => {
    try {
      const result = await axios.post('/api/admin/facebook/pages/connect', { pageId });
      alert(`Connect result: ${JSON.stringify(result.data)}`);
      // Refresh list after connection
      const refreshed = await axios.get('/api/admin/facebook/pages');
      setPages(refreshed.data);
    } catch (err) {
      console.error('Connect error', err);
      alert('Failed to connect page');
    }
  };

  const handleDisconnect = async (pageId: string) => {
    if (window.confirm('Bạn có chắc muốn hủy kết nối page này?')) {
      try {
        await axios.delete(`/api/admin/facebook/pages/${pageId}`);
        alert('Đã hủy kết nối thành công');
        // Refresh list after disconnection
        const refreshed = await axios.get('/api/admin/facebook/pages');
        setPages(refreshed.data);
      } catch (err) {
        console.error('Disconnect error', err);
        alert('Hủy kết nối thất bại');
      }
    }
  };

  if (loading) return <div>Loading Facebook pages…</div>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
      <h2 style={{ marginBottom: '1rem' }}>Facebook Pages</h2>
      {pages.length === 0 ? (
        <p>No pages found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'hsl(210, 20%, 95%)', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '0.5rem' }}>Name</th>
              <th style={{ padding: '0.5rem' }}>Status</th>
              <th style={{ padding: '0.5rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {pages.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{p.pageName}</td>
                <td style={{ padding: '0.5rem' }}>{p.status}</td>
                <td style={{ padding: '0.5rem' }}>
                  {p.status !== 'connected' && (
                    <button
                      onClick={() => handleConnect(p.id)}
                      style={{ padding: '0.4rem 0.8rem', background: '#1877f2', color: '#fff', border: 'none', borderRadius: '0.3rem', cursor: 'pointer' }}
                    >
                      Connect
                    </button>
                  )}
                  {p.status === 'connected' && (
                    <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ color: 'green' }}>Connected</span>
                      <button
                        onClick={() => handleDisconnect(p.pageId)}
                        style={{ padding: '0.4rem 0.8rem', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '0.3rem', cursor: 'pointer' }}
                      >
                        Disconnect
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div style={{ marginTop: '1.5rem' }}>
        <Link to="/admin/facebook" style={{ textDecoration: 'underline' }}>← Back to Facebook admin</Link>
      </div>
    </div>
  );
};

export default FacebookPages;
