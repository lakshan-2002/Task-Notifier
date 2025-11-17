import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
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

  // Update form data when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
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
            <button 
              type="button" 
              onClick={handleClose} 
              className="modal-btn modal-btn-close"
            >
              Close
            </button>
            <button 
              type="submit" 
              className="modal-btn modal-btn-save"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;