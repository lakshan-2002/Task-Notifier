import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Sidebar from './components/Sidebar';
import OverviewCards from './components/OverviewCards';
import Charts from './components/Charts';
import './Dashboard.css';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen}
        activePage={activePage}
        onLogout={handleLogout}
      />

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
              <div className="avatar">LI</div>
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