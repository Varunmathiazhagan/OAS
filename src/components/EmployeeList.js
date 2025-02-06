import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminEmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    role: 'Employee',
    email: '',
    salary: '',
  });
  const [admin, setAdmin] = useState({ username: '', password: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleAdminChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (admin.username === 'Varun' && admin.password === '4546') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid login credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdmin({ username: '', password: '' });
  };

  const handleInputChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await axios.put(
          `http://localhost:8000/api/employees/${editingEmployee._id}`,
          newEmployee
        );
        setEditingEmployee(null);
      } else {
        await axios.post('http://localhost:8000/api/employees', newEmployee);
      }
      setNewEmployee({ name: '', role: 'Employee', email: '', salary: '' });
      fetchEmployees();
    } catch (error) {
      console.error('Error submitting employee:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleUpdate = (employee) => {
    setEditingEmployee(employee);
    setNewEmployee(employee);
  };

  return (
    <div className="bg-gray-100 p-6 max-w-4xl mx-auto rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Employee Management</h1>

      {!isAuthenticated && (
        <form onSubmit={handleLogin} className="mb-4">
          <input
            type="text"
            name="username"
            value={admin.username}
            onChange={handleAdminChange}
            placeholder="Admin Username"
            className="border px-4 py-2 rounded w-full mb-2"
          />
          <input
            type="password"
            name="password"
            value={admin.password}
            onChange={handleAdminChange}
            placeholder="Admin Password"
            className="border px-4 py-2 rounded w-full mb-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            Login
          </button>
        </form>
      )}

      {isAuthenticated && (
        <div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded mb-4"
          >
            Logout
          </button>
          <form onSubmit={handleSubmit} className="mb-4">
            <input
              type="text"
              name="name"
              value={newEmployee.name}
              onChange={handleInputChange}
              placeholder="Employee Name"
              className="border px-4 py-2 rounded w-full mb-2"
            />
            <select
              name="role"
              value={newEmployee.role}
              onChange={handleInputChange}
              className="border px-4 py-2 rounded w-full mb-2"
            >
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
            </select>
            <input
              type="email"
              name="email"
              value={newEmployee.email}
              onChange={handleInputChange}
              placeholder="Employee Email"
              className="border px-4 py-2 rounded w-full mb-2"
            />
            <input
              type="number"
              name="salary"
              value={newEmployee.salary}
              onChange={handleInputChange}
              placeholder="Employee Salary"
              className="border px-4 py-2 rounded w-full mb-2"
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded w-full"
            >
              {editingEmployee ? 'Update Employee' : 'Add Employee'}
            </button>
          </form>
        </div>
      )}

      <table className="table-auto w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Salary</th>
            {isAuthenticated && <th className="px-4 py-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id} className="border-t">
              <td className="px-4 py-2">{employee.name}</td>
              <td className="px-4 py-2">{employee.role}</td>
              <td className="px-4 py-2">{employee.email}</td>
              <td className="px-4 py-2">{employee.salary}</td>
              {isAuthenticated && (
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleUpdate(employee)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(employee._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
