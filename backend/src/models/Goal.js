const mongoose = require('mongoose');

const dailyTaskSchema = new mongoose.Schema({
  day: Number,
  goal: String,
  explanation: String,
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard']
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  date: String // For manual goals, store as YYYY-MM-DD string
});

const goalSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  currentCondition: String, // Optional for manual
  desiredAchievement: String, // Optional for manual
  timeframe: Number, // Optional for manual
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  dailyTasks: [dailyTaskSchema],
  startDate: Date,
  completedDays: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active'
  },
  type: {
    type: String,
    enum: ['ai', 'manual'],
    default: 'ai'
  },
  title: String, // For manual
  description: String, // For manual
  date: String // For manual, store as YYYY-MM-DD string
}, {
  timestamps: true
});

module.exports = mongoose.model('Goal', goalSchema); 