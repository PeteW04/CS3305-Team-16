import mongoose from 'mongoose';


const taskSchema = new mongoose.Schema({
  title: {
    type: String, required: true
  },
  description: {
    type: String, default: ''
  },
  project: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true 
  },
  status: {
    type: String, enum: ['New', 'In Progress', 'Completed'], default: 'New'
  },
  deadline: {
    type: Date
  }, 
});
// TODO
// Add a new field about assignedTo
// Add a timestamp??
// Add a assignedBy?? to track which manager assigned the task??


export default mongoose.model('Task', taskSchema);
