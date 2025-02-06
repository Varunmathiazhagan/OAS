import React, { useState, useEffect } from "react";
import axios from "axios";

export default function LeaveRequest() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [reason, setReason] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLogin, setAdminLogin] = useState({ username: "", password: "" });

  // Fetch leave requests
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await axios.get("http://localhost:8007/api/leave-requests");
        setLeaveRequests(response.data);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      }
    };

    fetchLeaveRequests();
  }, []);

  // Employee: Submit leave request
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newRequest = { employeeName, reason };
      const response = await axios.post("http://localhost:8007/api/leave-requests", newRequest);
      setLeaveRequests([...leaveRequests, response.data]);
      setEmployeeName("");
      setReason("");
    } catch (error) {
      console.error("Error submitting leave request:", error);
    }
  };

  // Admin: Approve/Reject leave request
  const handleStatusChange = async (id, status) => {
    try {
      const response = await axios.put(`http://localhost:8007/api/leave-requests/${id}`, { status });
      setLeaveRequests(
        leaveRequests.map((request) => (request._id === id ? response.data : request))
      );
    } catch (error) {
      console.error("Error updating leave request status:", error);
    }
  };

  // Dummy admin login
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminLogin.username === "admin" && adminLogin.password === "password") {
      setIsAdmin(true);
      setAdminLogin({ username: "", password: "" });
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div className="bg-white p-8 shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Leave Requests</h1>

      {/* Admin Login */}
      {!isAdmin && (
        <form onSubmit={handleAdminLogin} className="mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Admin Username</label>
            <input
              type="text"
              value={adminLogin.username}
              onChange={(e) => setAdminLogin({ ...adminLogin, username: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter username"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              value={adminLogin.password}
              onChange={(e) => setAdminLogin({ ...adminLogin, password: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter password"
              required
            />
          </div>
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Login as Admin
          </button>
        </form>
      )}

      {/* Employee Leave Request Form */}
      {!isAdmin && (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Employee Name</label>
            <input
              type="text"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter the reason for leave"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Submit Request
          </button>
        </form>
      )}

      {/* Leave Requests Table */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Submitted Requests</h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">Employee Name</th>
            <th className="px-4 py-2 text-left">Reason</th>
            <th className="px-4 py-2 text-left">Status</th>
            {isAdmin && <th className="px-4 py-2 text-left">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((request) => (
            <tr key={request._id} className="border-b">
              <td className="px-4 py-2">{request.employeeName}</td>
              <td className="px-4 py-2">{request.reason}</td>
              <td className="px-4 py-2">{request.status}</td>
              {isAdmin && (
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleStatusChange(request._id, "Approved")}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg mr-2 hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(request._id, "Rejected")}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Reject
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
