import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import EmployeeList from './components/EmployeeList';
import TaskManager from './components/TaskManager';
import Track from './components/Track';
import Attendance from './components/Attendance';  // Import Attendance component
import './index.css';  // Ensure the path is correct for your CSS

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route exact path="/" element={<Dashboard />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/tasks" element={<TaskManager />} />
            <Route path="/track" element={<Track />} />
            <Route path="/attendance" element={<Attendance />} />  {/* Add Attendance route */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}
