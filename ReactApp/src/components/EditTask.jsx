import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './EditTask.css';

const EditTask = ({ task, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // API Base URL
  const API_URL = 'http://localhost:8080/tasks';

  // Update form data when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status?.toLowerCase() || 'pending',
        priority: task.priority?.toLowerCase() || 'medium',
        dueDate: task.dueDate
      });
    }
  }, [task]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const user = JSON.parse(localStorage.getItem('user'));

      const response = await axios.put(`${API_URL}`, {
        id: formData.id,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate,
        user: user
      });

      toast.success('Task updated successfully!');
      onSave(response.data); // Pass updated data to parent
      onClose();
    } catch (err) {
      console.error('Error updating task:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update task';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">Edit Task</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <form className="modal-form" onSubmit={handleSubmit}>
          {/* Title Field */}
          <div className="modal-form-group">
            <label htmlFor="edit-title" className="modal-form-label">
              Task Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="edit-title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="modal-form-input"
              placeholder="Enter task title"
              required
            />
          </div>

          {/* Description Field */}
          <div className="modal-form-group">
            <label htmlFor="edit-description" className="modal-form-label">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="edit-description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="modal-form-textarea"
              placeholder="Enter task description"
              rows="4"
              required
            />
          </div>

          {/* Status and Priority Row */}
          <div className="modal-form-row">
            {/* Status Field */}
            <div className="modal-form-group">
              <label htmlFor="edit-status" className="modal-form-label">
                Status <span className="required">*</span>
              </label>
              <select
                id="edit-status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="modal-form-select"
                required
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Priority Field */}
            <div className="modal-form-group">
              <label htmlFor="edit-priority" className="modal-form-label">
                Priority <span className="required">*</span>
              </label>
              <select
                id="edit-priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="modal-form-select"
                required
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Due Date Field */}
          <div className="modal-form-group">
            <label htmlFor="edit-dueDate" className="modal-form-label">
              Due Date <span className="required">*</span>
            </label>
            <input
              type="date"
              id="edit-dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="modal-form-input"
              required
            />
          </div>

          {/* Modal Footer with Buttons */}
          <div className="modal-footer">
            {error && (
              <div className="modal-error">
                {error}
              </div>
            )}
            <div>
              <button 
                type="button" 
                onClick={handleClose} 
                className="modal-btn modal-btn-close"
                disabled={isLoading}
              >
                Close
              </button>
              <button 
                type="submit" 
                className="modal-btn modal-btn-save"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;