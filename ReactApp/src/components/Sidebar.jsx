import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Plus, ListTodo, CheckCircle, User, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, activePage, onLogout }) => {
  const navigate = useNavigate();

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'add-task', name: 'Add Task', icon: Plus, path: '/add-task' },
    { id: 'all-tasks', name: 'All Tasks', icon: ListTodo, path: '/all-tasks' },
    { id: 'completed', name: 'Completed Tasks', icon: CheckCircle, path: '/completed-tasks' },
    { id: 'profile', name: 'Profile', icon: User, path: '/profile' },
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
              onClick={() => navigate(item.path)}
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