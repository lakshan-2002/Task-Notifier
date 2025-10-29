import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from "./Login";
import Signup from "./Signup";

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