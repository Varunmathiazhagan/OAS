const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect('mongodb://localhost:27017/osa', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Employee Schema and Model
const employeeSchema = new mongoose.Schema({
  name: String,
  role: String,
  email: String,
  salary: Number,
});

const Employee = mongoose.model('Employee', employeeSchema);

// Track Schema and Model (to log changes)
const trackSchema = new mongoose.Schema({
  action: String,
  employeeId: mongoose.Schema.Types.ObjectId,
  timestamp: { type: Date, default: Date.now },
  details: mongoose.Schema.Types.Mixed,
});

const Track = mongoose.model('Track', trackSchema);

// Add Employee
app.post('/api/employees', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add employee' });
  }
});

// Get All Employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Update Employee
app.put('/api/employees/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (updatedEmployee) {
      // Log update action
      const trackLog = new Track({
        action: 'update',
        employeeId: updatedEmployee._id,
        details: req.body,
      });
      await trackLog.save();
    }
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// Delete Employee
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (deletedEmployee) {
      // Log delete action
      const trackLog = new Track({
        action: 'delete',
        employeeId: deletedEmployee._id,
        details: deletedEmployee,
      });
      await trackLog.save();
    }
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});


// Server
app.listen(8000, () => {
  console.log('Server running on http://localhost:8000');
});
