// Leave Request Schema
const leaveRequestSchema = new mongoose.Schema({
    employeeName: String,
    reason: String,
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  });
  
  // Leave Request Model
  const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);
  
  // Route to submit a leave request
  app.post('/api/leave-requests', async (req, res) => {
    const { employeeName, reason } = req.body;
    try {
      const newRequest = new LeaveRequest({ employeeName, reason });
      await newRequest.save();
      res.status(201).json(newRequest);
    } catch (err) {
      res.status(500).send('Error submitting leave request');
    }
  });
  
  // Route to get all leave requests
  app.get('/api/leave-requests', async (req, res) => {
    try {
      const leaveRequests = await LeaveRequest.find();
      res.json(leaveRequests);
    } catch (err) {
      res.status(500).send('Error fetching leave requests');
    }
  });
  
  // Route to update leave request status
  app.put('/api/leave-requests/:id', async (req, res) => {
    const { status } = req.body;
    try {
      const leaveRequest = await LeaveRequest.findById(req.params.id);
      leaveRequest.status = status;
      await leaveRequest.save();
      res.json(leaveRequest);
    } catch (err) {
      res.status(500).send('Error updating leave request status');
    }
  });
  