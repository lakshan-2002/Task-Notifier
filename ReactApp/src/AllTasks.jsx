import React, { useState } from 'react';
import { Search, Calendar, Flag, CheckCircle, Clock, Edit2, Trash2 } from 'lucide-react';
import Sidebar from './components/Sidebar';
import './AllTasks.css';

const AllTasks = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('all-tasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');

  // Sample tasks data
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
      dueDate: '2024-12-25'
    },
    {
      id: 4,
      title: 'Fix critical bug in authentication',
      description: 'Investigate and fix the bug causing users to be logged out unexpectedly.',
      status: 'pending',
      priority: 'high',
      dueDate: '2024-12-18'
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
      dueDate: '2024-12-22'
    }
  ]);

  const handleNavigate = (pageId) => {
    setActivePage(pageId);
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const handleEdit = (taskId) => {
    console.log('Editing task:', taskId);
    // Add your edit logic here - navigate to edit page or open modal
  };

  const handleDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
      console.log('Deleted task:', taskId);
      // Add your delete API call here
    }
  };

  // Filter tasks based on priority
  const filteredTasks = tasks.filter(task => {
    if (filterPriority === 'all') return true;
    return task.priority === filterPriority;
  });

  // Further filter by search query
  const searchedTasks = filteredTasks.filter(task => 
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
              <div className="avatar">JD</div>
            </div>
          </div>
        </header>

        {/* Filter Section */}
        <div className="filter-section">
          <div className="filter-label">Filter by Priority:</div>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filterPriority === 'all' ? 'filter-active' : ''}`}
              onClick={() => setFilterPriority('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filterPriority === 'high' ? 'filter-active' : ''}`}
              onClick={() => setFilterPriority('high')}
            >
              High
            </button>
            <button 
              className={`filter-btn ${filterPriority === 'medium' ? 'filter-active' : ''}`}
              onClick={() => setFilterPriority('medium')}
            >
              Medium
            </button>
            <button 
              className={`filter-btn ${filterPriority === 'low' ? 'filter-active' : ''}`}
              onClick={() => setFilterPriority('low')}
            >
              Low
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
                    
                    <span className="due-date">
                      <Calendar size={16} />
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons at Bottom */}
                <div className="task-actions-bottom">
                  <button 
                    className="action-btn-bottom edit-btn-bottom"
                    onClick={() => handleEdit(task.id)}
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
    </div>
  );
};

export default AllTasks;