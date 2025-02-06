const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Setup express
const app = express();
const port = 5005;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/organization_tasks', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Task model
const Task = mongoose.model('Task', new mongoose.Schema({
  title: String,
  description: String,
  assignedTo: String,
  status: String,
}));

// API Routes
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).send('Server Error');
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, assignedTo, status } = req.body;
    const newTask = new Task({
      title,
      description,
      assignedTo,
      status,
    });
    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).send('Server Error');
  }
});

app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).send('Server Error');
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).send('Server Error');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
