import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState('pending');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dummyUser = { username: 'Velan', password: '4546', role: 'user' };
  const dummyAdmin = { username: 'Varun', password: '4546', role: 'admin' };

  const handleLogin = () => {
    if (
      (username === dummyUser.username && password === dummyUser.password && role === 'user') ||
      (username === dummyAdmin.username && password === dummyAdmin.password && role === 'admin')
    ) {
      setIsLoggedIn(true);
      setShowLogin(false);
      setUsername('');
      setPassword('');
      setRole('user');
    } else {
      alert('Invalid credentials, please try again.');
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5005/api/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Failed to fetch tasks. Please try again.');
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    if (taskName.trim() === '' || assignedTo.trim() === '') {
      setError('Please fill in both the task name and the assigned person.');
      return;
    }

    const newTask = {
      title: taskName,
      description: taskName, 
      assignedTo: assignedTo,
      status: status,
    };

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5005/api/tasks', newTask);
      setTasks((prevTasks) => [...prevTasks, response.data]);
      setTaskName('');
      setAssignedTo('');
      setStatus('pending');
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }

    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    try {
      const response = await axios.patch(`http://localhost:5005/api/tasks/${id}`, { status: newStatus });
      const updatedTasks = tasks.map((task) =>
        task._id === id ? { ...task, status: response.data.status } : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task status:', error);
      setError('Failed to update task status. Please try again.');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5005/api/tasks/${id}`);
      const updatedTasks = tasks.filter((task) => task._id !== id);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task. Please try again.');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Task Manager</h2>

        {showLogin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-2xl font-semibold mb-4 text-center">User Login</h3>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button
                onClick={handleLogin}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
              >
                Login
              </button>
            </div>
          </div>
        )}

        {isLoggedIn && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <input
              type="text"
              placeholder="Enter task name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            />
            <input
              type="text"
              placeholder="Assigned to"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <button
              onClick={handleAddTask}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
              disabled={loading}
            >
              {loading ? 'Adding Task...' : 'Add Task'}
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border-b text-left">Task</th>
                <th className="px-4 py-2 border-b text-left">Assigned To</th>
                <th className="px-4 py-2 border-b text-left">Status</th>
                <th className="px-4 py-2 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-2 text-gray-500 text-center">
                    No tasks to show
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task._id} className={task.status === 'completed' ? 'bg-green-50' : ''}>
                    <td className="px-4 py-2 border-b">{task.title}</td>
                    <td className="px-4 py-2 border-b">{task.assignedTo}</td>
                    <td className="px-4 py-2 border-b">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        task.status === 'completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b">
                      <button
                        onClick={() => handleStatusChange(task._id, task.status)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        {task.status === 'pending' ? 'Complete' : 'Reopen'}
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;