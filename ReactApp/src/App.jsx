import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import AddTask from "./AddTask";
import AllTasks from "./AllTasks";
import CompletedTasks from "./CompletedTasks";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default route - redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Login page */}
          <Route path="/login" element={<Login />} />
          
          {/* Signup page */}
          <Route path="/signup" element={<Signup />} />

          {/* Dashboard page */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Add Task page */}
          <Route path="/add-task" element={<AddTask />} />

          {/* All Tasks page */}
          <Route path="/all-tasks" element={<AllTasks />} />

          {/* Completed Tasks page */}
          <Route path="/completed-tasks" element={<CompletedTasks />} />

          {/* Profile page */}
          <Route path="/profile" element={<div>Under the construction</div>} />

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

         <ToastContainer 
            position="top-right" 
            autoClose={3000} 
            hideProgressBar={false} 
          />
      </div>
    </Router>
  );
}

export default App;