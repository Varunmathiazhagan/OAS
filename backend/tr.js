const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

// Enable CORS
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/osa', { useNewUrlParser: true, useUnifiedTopology: true });

// Define Employee Schema
const employeeSchema = new mongoose.Schema({
  name: String,
  role: String,
  email: String,
  salary: Number,
});

const Employee = mongoose.model('Employee', employeeSchema);

// API to fetch employees with filters
app.get('/api/employees', async (req, res) => {
  try {
    const { name, role } = req.query;

    // Construct query based on filters
    const query = {};
    if (name) query.name = new RegExp(name, 'i'); // Case-insensitive regex
    if (role) query.role = role;

    const employees = await Employee.find(query);
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Error fetching employees' });
  }
});

// Start server
const PORT = 8009;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
