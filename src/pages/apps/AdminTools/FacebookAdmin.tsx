import React from 'react';
import { Link, Outlet, NavLink } from 'react-router-dom';

// Simple admin layout for Facebook management
const FacebookAdmin: React.FC = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '1rem' }}>Facebook Administration</h1>
      <nav style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
        <NavLink
          to="pages"
          style={({ isActive }) => ({
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            backgroundColor: isActive ? 'hsl(210, 40%, 90%)' : 'transparent',
            textDecoration: 'none',
            color: '#333',
          })}
        >
          Pages
        </NavLink>
        <NavLink
          to="posts"
          style={({ isActive }) => ({
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            backgroundColor: isActive ? 'hsl(210, 40%, 90%)' : 'transparent',
            textDecoration: 'none',
            color: '#333',
          })}
        >
          Posts
        </NavLink>
        <NavLink
          to="comments"
          style={({ isActive }) => ({
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            backgroundColor: isActive ? 'hsl(210, 40%, 90%)' : 'transparent',
            textDecoration: 'none',
            color: '#333',
          })}
        >
          Comments
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
};

export default FacebookAdmin;
