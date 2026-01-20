import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Flag, CheckCircle, Clock, Edit2, Trash2, Filter } from 'lucide-react';
import Sidebar from './components/Sidebar';
import EditTask from './components/EditTask';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AllTasks.css';

const AllTasks = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('all-tasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  
  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

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
      console.log('Sample task - status:', response.data[0]?.status, 'priority:', response.data[0]?.priority);
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      const errorMessage = err.response?.data?.message || 'Failed to fetch tasks';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (pageId) => {
    setActivePage(pageId);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedTask) => {
    // Update local state with the updated task from the API response
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`${API_URL}/${taskId}`);
        
        // Update local state
        setTasks(tasks.filter(task => task.id !== taskId));
        
        toast.success('Task deleted successfully!');
      } catch (err) {
        console.error('Error deleting task:', err);
        const errorMessage = err.response?.data?.message || 'Failed to delete task';
        setError(errorMessage);
        toast.error("Error deleting task");
      }
    }
  };

  // Date filtering logic
  const filterTasksByDate = (task) => {
    if (filterDate === 'all') return true;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    
    const diffTime = taskDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    switch (filterDate) {
      case 'overdue':
        return diffDays < 0 && task.status !== 'completed';
      case 'today':
        return diffDays === 0;
      case 'upcoming':
        return diffDays > 0;
      default:
        return true;
    }
  };

  // Count tasks by date category
  const getDateCounts = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let overdue = 0;
    let todayCount = 0;
    let upcoming = 0;
    
    tasks.forEach(task => {
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      
      const diffTime = taskDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0 && task.status !== 'completed') {
        overdue++;
      } else if (diffDays === 0) {
        todayCount++;
      } else if (diffDays > 0) {
        upcoming++;
      }
    });
    
    return { overdue, today: todayCount, upcoming };
  };

  const dateCounts = getDateCounts();

  // Filter tasks based on priority
  const filteredTasks = tasks.filter(task => {
    if (filterPriority === 'all') return true;
    return task.priority === filterPriority;
  });

  // Filter by date
  const dateFilteredTasks = filteredTasks.filter(filterTasksByDate);

  // Further filter by search query
  const searchedTasks = dateFilteredTasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriorityColor = (priority) => {
    const priorityLower = priority?.toLowerCase();
    switch (priorityLower) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    return statusLower === 'completed' ? 'status-completed' : 'status-pending';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const isOverdue = (dueDate, status) => {
    if (status === 'completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate < today;
  };

  return (
    <div className="dashboard-container">
      <Sidebar 
        isOpen={isSidebarOpen}
        activePage={activePage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <main className={`main ${!isSidebarOpen ? 'main-expanded' : ''}`}>
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
            <h1 className="page-title">All Tasks</h1>
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

        {/* Date Filter Section */}
        <div className="date-filter-section">
          <div className="date-filter-label">
            <Filter size={18} />
            Filter by Date:
          </div>
          <div className="date-filter-buttons">
            <button 
              className={`date-filter-btn ${filterDate === 'all' ? 'date-filter-active' : ''}`}
              onClick={() => setFilterDate('all')}
            >
              All
            </button>
            <button 
              className={`date-filter-btn date-filter-overdue ${filterDate === 'overdue' ? 'date-filter-active' : ''}`}
              onClick={() => setFilterDate('overdue')}
            >
              Overdue {dateCounts.overdue > 0 && <span className="count-badge">{dateCounts.overdue}</span>}
            </button>
            <button 
              className={`date-filter-btn date-filter-today ${filterDate === 'today' ? 'date-filter-active' : ''}`}
              onClick={() => setFilterDate('today')}
            >
              Today {dateCounts.today > 0 && <span className="count-badge">{dateCounts.today}</span>}
            </button>
            <button 
              className={`date-filter-btn date-filter-upcoming ${filterDate === 'upcoming' ? 'date-filter-active' : ''}`}
              onClick={() => setFilterDate('upcoming')}
            >
              Upcoming {dateCounts.upcoming > 0 && <span className="count-badge">{dateCounts.upcoming}</span>}
            </button>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="tasks-grid">
          {isLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading tasks...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p className="error-message">{error}</p>
              <button className="retry-btn" onClick={fetchTasks}>Retry</button>
            </div>
          ) : searchedTasks.length === 0 ? (
            <div className="no-tasks">
              <p>No tasks found</p>
            </div>
          ) : (
            searchedTasks.map(task => (
              <div key={task.id} className="task-card">
                <div className="task-card-header">
                  <h3 className="task-title">{task.title}</h3>
                </div>

                <div className="priority-badge-container">
                  <span className={`priority-badge ${getPriorityColor(task.priority || 'medium')}`}>
                    <Flag size={14} />
                    <span style={{ textTransform: 'capitalize' }}>{task.priority?.toLowerCase() || 'medium'}</span>
                  </span>
                </div>
                
                <p className="task-description">{task.description}</p>
                
                <div className="task-footer">
                  <div className="task-meta">
                    <span className={`status-badge ${getStatusColor(task.status)}`}>
                      {task.status?.toLowerCase() === 'completed' ? (
                        <CheckCircle size={16} />
                      ) : (
                        <Clock size={16} />
                      )}
                      <span style={{ textTransform: 'capitalize' }}>{task.status?.toLowerCase()}</span>
                    </span>
                    
                    <span className={`due-date ${isOverdue(task.dueDate, task.status) ? 'overdue-date' : ''}`}>
                      <Calendar size={16} />
                      {formatDate(task.dueDate)}
                      {isOverdue(task.dueDate, task.status) && <span className="overdue-label">Overdue</span>}
                    </span>
                  </div>
                </div>

                <div className="task-actions-bottom">
                  <button 
                    className="action-btn-bottom edit-btn-bottom"
                    onClick={() => handleEdit(task)}
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button 
                    className="action-btn-bottom delete-btn-bottom"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <EditTask 
        task={selectedTask}
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default AllTasks;