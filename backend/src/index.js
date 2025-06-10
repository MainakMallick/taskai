require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Goal = require('./models/Goal');

const app = express();
const port = 3001;

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/habitual')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Configure CORS to be more permissive
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Helper function to generate daily goals
async function generateDailyGoals(currentCondition, goal, timeframe) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `Create a detailed plan to help someone achieve their goal. 
    Current condition: ${currentCondition}
    Goal: ${goal}
    Timeframe: ${timeframe} days

    Please provide:
    1. A list of daily goals, starting from the current condition and gradually increasing in difficulty
    2. Each goal should be specific, measurable, and achievable
    3. The progression should be natural and sustainable
    4. Include a brief explanation for each goal

    Format the response as a JSON array of objects with the following structure:
    {
      "day": number,
      "goal": string,
      "explanation": string,
      "difficulty": "easy" | "medium" | "hard"
    }`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response text by removing markdown code block formatting
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    
    // Parse the JSON response
    const plan = JSON.parse(cleanedText);
    return plan;
  } catch (error) {
    console.error('Error generating plan:', error);
    throw error;
  }
}

// API endpoint to generate and save a plan
app.post('/api/generate-plan', async (req, res) => {
  try {
    console.log('\n=== Creating New Goal ===');
    console.log('Received request with body:', req.body);
    const { currentCondition, goal, timeframe, category, difficulty, userId } = req.body;

    if (!currentCondition || !goal || !timeframe || !category || !difficulty || !userId) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Generating plan with:', { currentCondition, goal, timeframe });
    const dailyTasks = await generateDailyGoals(currentCondition, goal, timeframe);
    console.log('Generated plan:', dailyTasks);

    // Create new goal in database
    const newGoal = new Goal({
      userId,
      category,
      currentCondition,
      desiredAchievement: goal,
      timeframe,
      difficulty,
      dailyTasks,
      startDate: new Date(), // Explicitly set start date
      status: 'active' // Explicitly set status
    });

    console.log('Attempting to save new goal:', JSON.stringify(newGoal, null, 2));
    const savedGoal = await newGoal.save();
    console.log('Successfully saved goal:', JSON.stringify(savedGoal, null, 2));

    // Verify the goal was saved
    const verifiedGoal = await Goal.findById(savedGoal._id);
    console.log('Verified saved goal:', JSON.stringify(verifiedGoal, null, 2));

    res.json({ goal: savedGoal });
  } catch (error) {
    console.error('Error in /api/generate-plan:', error);
    res.status(500).json({ error: 'Failed to generate plan' });
  }
});

// Get today's tasks for a user
app.get('/api/today-tasks/:userId', async (req, res) => {
  try {
    console.log('\n=== Today Tasks Endpoint ===');
    const { userId } = req.params;
    console.log('User ID:', userId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString().split('T')[0];
    console.log('Today\'s date (normalized):', todayISO);

    // Get all active goals for the user
    const activeGoals = await Goal.find({
      userId,
      status: 'active'
    });

    // Separate AI and manual goals
    const aiGoals = activeGoals.filter(goal => goal.type !== 'manual');
    const manualGoals = activeGoals.filter(goal => goal.type === 'manual');

    // AI goals: same as before
    const aiTodayTasks = aiGoals.map(goal => {
      const startDate = new Date(goal.startDate);
      startDate.setHours(0, 0, 0, 0);
      const daysSinceStart = Math.max(0, Math.floor((today - startDate) / (1000 * 60 * 60 * 24)));
      const task = goal.dailyTasks.find(t => t.day === daysSinceStart + 1);
      return {
        goalId: goal._id,
        category: goal.category,
        task: task || null
      };
    }).filter(item => item.task !== null);

    // Manual goals: include if date string matches today string
    console.log('Manual goals found:', manualGoals.length);
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const manualTodayTasks = manualGoals.map(goal => {
      if (!goal.date) {
        console.log(`Manual goal ${goal._id} has no date, skipping.`);
        return null;
      }
      const isSameDay = goal.date === todayString;
      console.log(`Manual goal ${goal._id}: goal.date=${goal.date}, todayString=${todayString}, isSameDay=${isSameDay}`);
      if (isSameDay && goal.dailyTasks.length > 0) {
        console.log(`Manual goal ${goal._id} is included for today.`);
        return {
          goalId: goal._id,
          category: goal.category,
          task: goal.dailyTasks[0]
        };
      } else {
        console.log(`Manual goal ${goal._id} is NOT included for today.`);
      }
      return null;
    }).filter(item => item !== null);

    const todayTasks = [...aiTodayTasks, ...manualTodayTasks];
    res.json({ tasks: todayTasks });
  } catch (error) {
    console.error('Error in today-tasks endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to fetch today\'s tasks',
      details: error.message 
    });
  }
});

// Mark a task as completed or not completed (toggle)
app.post('/api/complete-task/:goalId/:day', async (req, res) => {
  try {
    const { goalId, day } = req.params;
    const { completed } = req.body;
    const goal = await Goal.findById(goalId);

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const task = goal.dailyTasks.find(t => t.day === parseInt(day));
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Toggle completion
    task.completed = completed;
    task.completedAt = completed ? new Date() : null;
    // Update completedDays count
    goal.completedDays = goal.dailyTasks.filter(t => t.completed).length;

    // Check if all tasks are completed
    if (goal.completedDays === goal.timeframe) {
      goal.status = 'completed';
    } else {
      goal.status = 'active';
    }

    await goal.save();
    res.json({ goal });
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ error: 'Failed to complete task' });
  }
});

// Test endpoint to check database and today's tasks
app.get('/api/debug/today-tasks', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log('=== Debug Today Tasks ===');
    console.log('Current time:', new Date());
    console.log('Today\'s date (normalized):', today);

    // Get all goals
    const allGoals = await Goal.find({});
    console.log('All goals in database:', allGoals.length);
    console.log('Goals:', JSON.stringify(allGoals, null, 2));

    // Get active goals
    const activeGoals = await Goal.find({
      status: 'active',
      startDate: { $lte: today }
    });

    console.log('Active goals:', activeGoals.length);
    activeGoals.forEach(goal => {
      const daysSinceStart = Math.floor((today - goal.startDate) / (1000 * 60 * 60 * 24));
      console.log(`\nGoal ID: ${goal._id}`);
      console.log('Start date:', goal.startDate);
      console.log('Days since start:', daysSinceStart);
      console.log('Today\'s task should be day:', daysSinceStart + 1);
      console.log('Available tasks:', goal.dailyTasks.map(t => t.day));
    });

    res.json({
      currentTime: new Date(),
      todayDate: today,
      totalGoals: allGoals.length,
      activeGoals: activeGoals.length,
      goals: allGoals
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint to check database contents
app.get('/api/debug/goals', async (req, res) => {
  try {
    console.log('\n=== Checking Database Contents ===');
    
    // Get all goals
    const allGoals = await Goal.find({});
    console.log('Total goals in database:', allGoals.length);
    
    if (allGoals.length > 0) {
      console.log('Sample goal:', JSON.stringify(allGoals[0], null, 2));
    }

    // Get goals by status
    const activeGoals = await Goal.find({ status: 'active' });
    const completedGoals = await Goal.find({ status: 'completed' });
    const abandonedGoals = await Goal.find({ status: 'abandoned' });

    console.log('Goals by status:');
    console.log('- Active:', activeGoals.length);
    console.log('- Completed:', completedGoals.length);
    console.log('- Abandoned:', abandonedGoals.length);

    res.json({
      totalGoals: allGoals.length,
      byStatus: {
        active: activeGoals.length,
        completed: completedGoals.length,
        abandoned: abandonedGoals.length
      },
      goals: allGoals
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint to verify data
app.get('/api/debug/verify', async (req, res) => {
  try {
    console.log('\n=== Data Verification ===');
    
    // Check database connection
    const dbState = mongoose.connection.readyState;
    console.log('Database connection state:', dbState);
    
    // Get all goals
    const allGoals = await Goal.find({});
    console.log('Total goals in database:', allGoals.length);
    
    // Get goals for test user
    const userGoals = await Goal.find({ userId: 'user123' });
    console.log('Goals for user123:', userGoals.length);
    
    if (userGoals.length > 0) {
      const goal = userGoals[0];
      console.log('\nSample goal details:');
      console.log('- ID:', goal._id);
      console.log('- Status:', goal.status);
      console.log('- Start date:', goal.startDate);
      console.log('- Daily tasks:', goal.dailyTasks.length);
      console.log('- First task:', goal.dailyTasks[0]);
    }

    res.json({
      databaseConnected: dbState === 1,
      totalGoals: allGoals.length,
      userGoals: userGoals.length,
      sampleGoal: userGoals.length > 0 ? {
        id: userGoals[0]._id,
        status: userGoals[0].status,
        startDate: userGoals[0].startDate,
        tasksCount: userGoals[0].dailyTasks.length,
        firstTask: userGoals[0].dailyTasks[0]
      } : null
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a manual goal
app.post('/api/manual-goal', async (req, res) => {
  try {
    console.log('\n=== /api/manual-goal called ===');
    console.log('Request body:', req.body);
    const { title, description, date, category, difficulty, userId } = req.body;
    if (!title || !description || !date || !category || !difficulty || !userId) {
      console.log('Missing required fields:', { title, description, date, category, difficulty, userId });
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // date is already a YYYY-MM-DD string from the frontend
    const manualGoal = new Goal({
      userId,
      category,
      difficulty,
      type: 'manual',
      title,
      description,
      date, // store as string
      dailyTasks: [{
        day: 1,
        goal: title,
        explanation: description,
        difficulty,
        completed: false,
        date // store as string
      }],
      startDate: new Date(date),
      completedDays: 0,
      status: 'active'
    });
    console.log('Manual goal to save:', manualGoal);
    await manualGoal.save();
    console.log('Manual goal saved successfully:', manualGoal._id);
    res.json({ goal: manualGoal });
  } catch (error) {
    console.error('Error in /api/manual-goal:', error);
    res.status(500).json({ error: 'Failed to create manual goal', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 