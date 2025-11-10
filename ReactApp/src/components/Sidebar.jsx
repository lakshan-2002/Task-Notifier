import React from 'react';
import { LayoutDashboard, Plus, ListTodo, CheckCircle, User, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, activePage, onNavigate, onLogout }) => {
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'add-task', name: 'Add Task', icon: Plus },
    { id: 'all-tasks', name: 'All Tasks', icon: ListTodo },
    { id: 'completed', name: 'Completed Tasks', icon: CheckCircle },
    { id: 'profile', name: 'Profile', icon: User },
  ];

  return (
    <aside className={`sidebar ${!isOpen ? 'sidebar-closed' : ''}`}>
      <div className="sidebar-header">
        <h2 className="logo">TaskNotifier</h2>
      </div>
      
      <nav className="nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`nav-item ${activePage === item.id ? 'nav-item-active' : ''}`}
            >
              <Icon size={20} />
              <span className="nav-text">{item.name}</span>
            </button>
          );
        })}
      </nav>

      <button className="logout-btn" onClick={onLogout}>
        <LogOut size={20} />
        <span className="nav-text">Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;