import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import Sidebar from './components/Sidebar';
import OverviewCards from './components/OverviewCards';
import Charts from './components/Charts';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Tasks data and loading state
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Base URL
  const API_URL = 'http://localhost:8080/tasks';

  // Fetch all tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/${user.id}`);
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      const errorMessage = err.response?.data?.message || 'Failed to fetch tasks';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate task statistics
  const calculateStats = () => {
    const allTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status?.toLowerCase() === 'completed').length;
    const pendingTasks = tasks.filter(task => task.status?.toLowerCase() === 'pending').length;
    
    return {
      allTasks,
      completedTasks,
      pendingTasks
    };
  };

  const stats = calculateStats();

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
    navigate('/login');
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
        <OverviewCards 
          allTasks={stats.allTasks}
          pendingTasks={stats.pendingTasks}
          completedTasks={stats.completedTasks}
          isLoading={isLoading}
        />

        {/* Charts */}
        <Charts 
          tasks={tasks}
          allTasks={stats.allTasks}
          pendingTasks={stats.pendingTasks}
          completedTasks={stats.completedTasks}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};

export default Dashboard;