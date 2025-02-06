import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [employeeCount, setEmployeeCount] = useState(0); // State for employee count
  const [taskCount, setTaskCount] = useState(0); // State for task count

  useEffect(() => {
    // Fetch employees count
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/employees'); // Update port if necessary
        console.log('Employees data:', response.data); // Debugging: log response
        setEmployeeCount(response.data.length);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    // Fetch tasks count
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5005/api/tasks'); // Update port if necessary
        console.log('Tasks data:', response.data); // Debugging: log response
        setTaskCount(response.data.length);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchEmployees();
    fetchTasks();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Dashboard</h1>
      <p className="text-gray-600">Welcome to the Organization and Administration Management System</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-blue-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-blue-800">Total Employees</h2>
          <p className="text-3xl font-bold text-blue-600">{employeeCount}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-green-800">Active Tasks</h2>
          <p className="text-3xl font-bold text-green-600">{taskCount}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-yellow-800">Departments</h2>
          <p className="text-3xl font-bold text-yellow-600">5</p>
        </div>
      </div>
    </div>
  );
}
