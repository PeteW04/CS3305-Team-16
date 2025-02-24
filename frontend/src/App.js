import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '../src/CSS-files/App.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/header';
// Pages
import Signup from './pages/Signup';
import UserSignup from './pages/UserSignup';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import TestPage from './pages/Component-Test';
import Task from './pages/Task';
import MessageUI from './pages/MessageUI';
import ProjectSummary from './components/ProjectSummary';

function App() {

  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/usersignup" element={<UserSignup />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/tasks" element={<Task />} />
          {/* Protected Routes */}
          {/* <Route element={<ProtectedRoute />}> */}
          <Route path="/test" element={<TestPage />} />
          {/* unprotected for testing purposes 
            <Route path="/settings" element={<Settings />} />*/}
          <Route path="/tasks" element={<Task />} />
          <Route path="/tasks/:projectId" element={<Task />} />
          <Route path="/projects" element={<ProjectSummary />} />
          <Route path="/message" element={<MessageUI />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          {/* </Route> */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;