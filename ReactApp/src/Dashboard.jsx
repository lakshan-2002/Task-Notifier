import React, { useState } from 'react';
import { LayoutDashboard, Plus, ListTodo, CheckCircle, User, LogOut, Menu, X, Search } from 'lucide-react';
import OverviewCards from './components/OverviewCards';
import Charts from './components/Charts';
import './Dashboard.css';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'add-task', name: 'Add Task', icon: Plus },
    { id: 'all-tasks', name: 'All Tasks', icon: ListTodo },
    { id: 'completed', name: 'Completed Tasks', icon: CheckCircle },
    { id: 'profile', name: 'Profile', icon: User },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
        <div className="sidebar-header">
          <h2 className="logo">TaskNotifier</h2>
        </div>
        
        <nav className="nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`nav-item ${activePage === item.id ? 'nav-item-active' : ''}`}
              >
                <Icon size={20} />
                <span className="nav-text">{item.name}</span>
              </button>
            );
          })}
        </nav>

        <button className="logout-btn">
          <LogOut size={20} />
          <span className="nav-text">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className={`main ${!isSidebarOpen ? 'main-expanded' : ''}`}>
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="menu-btn"
            >
                <div className="hamburger-icon">  
                  <span></span>
                  <span></span>
                  <span></span>
                </div>  
            </button>
            <h1 className="page-title">Dashboard</h1>
          </div>
          
          <div className="header-right">
            <div className="search-bar">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="user-info">
              <div className="avatar">JD</div>
            </div>
          </div>
        </header>

        {/* Overview Cards */}
        <OverviewCards />

        {/* Charts */}
        <Charts />
      </main>
    </div>
  );
};

export default Dashboard;