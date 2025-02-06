import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TrackEmployee() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch employees based on filters
  const fetchTrackedEmployees = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:8009/api/employees', {
        params: { name, role }, // Pass filters to the backend
      });
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching tracked employees:', err);
      setError(err.response?.data?.message || 'Error fetching employees');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all employees on initial load or when filters change
  useEffect(() => {
    fetchTrackedEmployees();
  }, [name, role]);

  // Clear filters
  const handleClearFilters = () => {
    setName('');
    setRole('');
    fetchTrackedEmployees(); // Reload all employees
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="">All Roles</option>
          <option value="Employee">Employee</option>
          <option value="HR">HR</option>
        </select>
        <button
          onClick={fetchTrackedEmployees}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Search
        </button>
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 bg-gray-300 rounded-md"
        >
          Clear Filters
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full table-auto mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Salary</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <tr key={employee._id} className="border-t">
                  <td className="px-4 py-2">{employee.name}</td>
                  <td className="px-4 py-2">{employee.role}</td>
                  <td className="px-4 py-2">{employee.email}</td>
                  <td className="px-4 py-2">{employee.salary}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-2 text-center">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
