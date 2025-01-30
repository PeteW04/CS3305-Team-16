import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Signup from './pages/Signup';
import UserSignup from './pages/UserSignup';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Header from './components/header'; 
import TestPage from './pages/Component-Test';

function App() {
  // Render only the Login component
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/usersignup" element={<UserSignup />} />
        <Route path="/test" element ={<TestPage />} />
      </Routes>
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



