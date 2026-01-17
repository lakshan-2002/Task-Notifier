import React, { useState } from 'react';
import { Search, Calendar, Flag, CheckCircle, Clock, Edit2, Trash2, Filter } from 'lucide-react';
import Sidebar from './components/Sidebar';
import EditTask from './components/EditTask';
import './AllTasks.css';

const AllTasks = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('all-tasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterDate, setFilterDate] = useState('all'); // New date filter state
  
  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Sample tasks data with various dates
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Complete project documentation',
      description: 'Write comprehensive documentation for the new feature implementation including API endpoints and user guides.',
      status: 'pending',
      priority: 'high',
      dueDate: '2024-12-20'
    },
    {
      id: 2,
      title: 'Review pull requests',
      description: 'Review and provide feedback on pending pull requests from team members.',
      status: 'completed',
      priority: 'medium',
      dueDate: '2024-12-15'
    },
    {
      id: 3,
      title: 'Update dependencies',
      description: 'Update all npm packages to their latest stable versions and test for compatibility.',
      status: 'pending',
      priority: 'low',
      dueDate: '2025-01-15'
    },
    {
      id: 4,
      title: 'Fix critical bug in authentication',
      description: 'Investigate and fix the bug causing users to be logged out unexpectedly.',
      status: 'pending',
      priority: 'high',
      dueDate: new Date().toISOString().split('T')[0] // Today
    },
    {
      id: 5,
      title: 'Design new landing page',
      description: 'Create mockups and designs for the new marketing landing page.',
      status: 'completed',
      priority: 'medium',
      dueDate: '2024-12-10'
    },
    {
      id: 6,
      title: 'Setup CI/CD pipeline',
      description: 'Configure automated testing and deployment pipeline for the project.',
      status: 'pending',
      priority: 'high',
      dueDate: '2024-12-15'
    },
    {
      id: 7,
      title: 'Write unit tests',
      description: 'Add comprehensive unit tests for the new features.',
      status: 'pending',
      priority: 'medium',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 2 days from now
    }
  ]);

  const handleNavigate = (pageId) => {
    setActivePage(pageId);
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    console.log('Task updated:', updatedTask);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };

  const handleDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
      console.log('Deleted task:', taskId);
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
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };

  const getStatusColor = (status) => {
    return status === 'completed' ? 'status-completed' : 'status-pending';
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
          {searchedTasks.length === 0 ? (
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
                  <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                    <Flag size={14} />
                    {task.priority}
                  </span>
                </div>
                
                <p className="task-description">{task.description}</p>
                
                <div className="task-footer">
                  <div className="task-meta">
                    <span className={`status-badge ${getStatusColor(task.status)}`}>
                      {task.status === 'completed' ? (
                        <CheckCircle size={16} />
                      ) : (
                        <Clock size={16} />
                      )}
                      {task.status}
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