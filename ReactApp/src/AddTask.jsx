import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import './AddTask.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddTask = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('add-task');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleNavigate = (pageId) => {
    setActivePage(pageId);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) setError(null);
    if (successMessage) setSuccessMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const API_URL = 'http://localhost:8080/tasks';

      const user = JSON.parse(localStorage.getItem('user'));

      const response = await axios.post(API_URL, {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate,
        user: user
      });

      setSuccessMessage('Task added successfully!');
      toast.success('Task added successfully!');
      
      handleReset();

      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

    } catch (err) {
      console.error('Error adding task:', err);
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred while adding the task';
      setError(errorMessage);
      toast.error("Error adding task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: ''
    });
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen}
        activePage={activePage}
        onNavigate={handleNavigate}
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
            <h1 className="page-title">Add New Task</h1>
          </div>
          
          <div className="header-right">
            <div className="user-info">
              <div className="avatar">LI</div>
            </div>
          </div>
        </header>

        {/* Form Container */}
        <div className="addtask-form-container">
          {/* Error Message */}
          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="alert alert-success">
              <span className="alert-icon">✓</span>
              <span>{successMessage}</span>
            </div>
          )}

          <form className="task-form" onSubmit={handleSubmit}>
            {/* Title Field */}
            <div className="addtask-form-group">
              <label htmlFor="title" className="addtask-form-label">
                Task Title <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="addtask-form-input"
                placeholder="Enter task title"
                required
              />
            </div>

            {/* Description Field */}
            <div className="addtask-form-group">
              <label htmlFor="description" className="addtask-form-label">
                Description <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="addtask-form-textarea"
                placeholder="Enter task description"
                rows="1"
                required
              />
            </div>

            {/* Status and Priority Row */}
            <div className="addtask-form-row">
              {/* Status Field */}
              <div className="addtask-form-group">
                <label htmlFor="status" className="addtask-form-label">
                  Status <span className="required">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="addtask-form-select"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Priority Field */}
              <div className="addtask-form-group">
                <label htmlFor="priority" className="addtask-form-label">
                  Priority <span className="required">*</span>
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="addtask-form-select"
                  required
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            {/* Due Date Field */}
            <div className="addtask-form-group">
              <label htmlFor="dueDate" className="addtask-form-label">
                Due Date <span className="required">*</span>
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="addtask-form-input"
                required
              />
            </div>

            {/* Form Actions */}
            <div className="addtask-form-actions">
              <button 
                type="submit" 
                className="btn-submit"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddTask;