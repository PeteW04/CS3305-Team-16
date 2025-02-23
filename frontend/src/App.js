import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '../src/CSS-files/App.css';
import Signup from './pages/Signup';
import UserSignup from './pages/UserSignup';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Header from './components/header';
import TestPage from './pages/Component-Test';
import Task from './pages/Task';
import MessageUI from './pages/MessageUI';
import { AuthProvider } from './context/AuthContext';
import ProjectSummary from './components/ProjectSummary';
import ProtectedRoute from './components/ProtectedRoute';
import Settings from './pages/Settings';
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
          <Route path="/settings" element={<Settings />} />
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/test" element={<TestPage />} />
           {/* unprotected for testing purposes 
           <Route path="/tasks" element={<Task />} /> 
            <Route path="/settings" element={<Settings />} />*/}
            <Route path="/projects" element={<ProjectSummary />} />
            <Route path="/message" element={<MessageUI />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

// <div className="App">
//   <header className="App-header">
//     <img src={logo} className="App-logo" alt="logo" />
//     <p>
//       Edit <code>src/App.js</code> and save to reload.
//     </p>
//     <a
//       className="App-link"
//       href="https://reactjs.org"
//       target="_blank"
//       rel="noopener noreferrer"
//     >
//       Learn React
//     </a>
//   </header>
// </div>