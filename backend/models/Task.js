import mongoose from 'mongoose';


const taskSchema = new mongoose.Schema({
  title: {
    type: String, required: true
  },
  description: {
    type: String, default: ''
  },
  project: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null
  },
  status: {
    type: String, enum: ['todo', 'progress', 'done'], default: 'todo'
  },
  priority: {
    type: String, enum: ['Low', 'High'], default: 'Low'
  }, 
});
// TODO
// Add deadline 
// Add a new field about assignedTo
// Add a timestamp??
// Add a assignedBy?? to track which manager assigned the task??


export default mongoose.model('Task', taskSchema);
