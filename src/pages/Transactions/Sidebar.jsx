import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      label: 'Transactions',
      icon: 'fas fa-list-alt',
      path: '/transactions'
    },
    {
      label: 'Dispute Order',
      icon: 'fas fa-exclamation-circle',
      path: '/dispute-order'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <aside className="sidebar">
      <nav>
        <ul className="sidebar-nav">
          {navItems.map((item, index) => (
            <li key={index} className="nav-item">
              <button
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path)}
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