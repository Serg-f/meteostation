// src/App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from "./components/Dashboard";
import Sea from "./components/Sea";
import About from "./components/About";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sea" element={<Sea />} />
            <Route path="/about" element={<About />} />
        </Routes>
      </Router>
  );
}

export default App;
