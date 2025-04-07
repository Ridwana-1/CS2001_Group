import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [   // Sidebar Links for accessiblity 
    {
      label: 'Transactions',
      icon: 'fas fa-list-alt',
      path: '/transactions',
    },
    {
      label: 'Dispute Order',
      icon: 'fas fa-exclamation-circle',
      path: '/dispute-order',
    },
    {
      label: 'ChatRoom',
      icon: 'fas fa-comments',
      path: '/chatroom', 
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <nav>
        <ul className="sidebar-nav">
          {navItems.map((item, index) => (
            <li key={index} className="nav-item">
              <button
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <i className={item.icon}></i>
                <span className="nav-text">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
