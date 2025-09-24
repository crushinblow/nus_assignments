import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Courses from './pages/Courses';
import Chatbot from './pages/Chatbot';
import CourseRecommender from './pages/CourseRecommender';
import PasswordStrength from './pages/PasswordStrength';
import CourseToggle from './pages/CourseToggle';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/recommender" element={<CourseRecommender />} />
          <Route path="/password-checker" element={<PasswordStrength />} />
          <Route path="/course-toggle" element={<CourseToggle />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;