import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  organization: {type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true},
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: {type: String, enum: ['New', 'In Progress', 'Completed'], default: 'New'},
  completion: {type: Number, min: 0, max: 100, default: 0}, 
  deadline: {type: Date}
});

export default mongoose.model('Project', projectSchema);
