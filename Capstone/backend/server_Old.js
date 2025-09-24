const express = require('express');
const cors = require('cors');
const path = require('path');

// Create an Express application
const app = express();
const PORT = 5001;

// Middleware
app.use(cors()); // Enable CORS for React frontend
app.use(express.json()); // Parse JSON request bodies

// Sample data
let users = [
  { id: 1, email: 'test@example.com', password: 'password123', enrolledCourses: [] }
];

let courses = [
  { id: 1, name: 'React for Beginners', description: 'Learn React fundamentals', category: 'Web Development' },
  { id: 2, name: 'Intro to Data Science', description: 'Data science basics', category: 'Data Science' },
  { id: 3, name: 'AI Fundamentals', description: 'Artificial intelligence introduction', category: 'AI' },
  { id: 4, name: 'Node.js Backend', description: 'Server-side JavaScript', category: 'Web Development' },
  { id: 5, name: 'Python for ML', description: 'Machine learning with Python', category: 'AI' }
];

let enrollments = [];
let progress = [];

// 1. Basic GET route for homepage
app.get('/', (req, res) => {
  res.send('Welcome to the LMS backend API!');
});

// 2. GET all courses
app.get('/api/courses', (req, res) => {
  res.json(courses);
});

// 3. GET course recommendations based on interest
app.get('/api/recommend', (req, res) => {
  const interest = req.query.interest?.toLowerCase();
  
  if (!interest) {
    return res.status(400).json({ error: 'Interest parameter is required' });
  }

  let recommendedCourses = [];
  
  if (interest.includes('web') || interest.includes('react')) {
    recommendedCourses = courses.filter(course => 
      course.category === 'Web Development'
    );
  } else if (interest.includes('data')) {
    recommendedCourses = courses.filter(course => 
      course.category === 'Data Science'
    );
  } else if (interest.includes('ai') || interest.includes('machine')) {
    recommendedCourses = courses.filter(course => 
      course.category === 'AI'
    );
  } else {
    recommendedCourses = courses.slice(0, 3);
  }

  res.json(recommendedCourses);
});

// 4. POST user registration
app.post('/api/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = {
    id: users.length + 1,
    email,
    password,
    enrolledCourses: []
  };

  users.push(newUser);
  res.status(201).json({ message: 'User created successfully', userId: newUser.id });
});

// 5. POST user login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ message: 'Login successful', userId: user.id });
});

// 6. POST enroll in a course - UPDATED TO MATCH REQUIREMENTS
app.post('/enroll', (req, res) => {
  const { userId, courseId } = req.body;

  // Input validation - UPDATED TO MATCH EXACT REQUIREMENT
  if (!userId || !courseId) {
    return res.status(400).json({ error: 'Missing userId or courseId in request.' });
  }

  const user = users.find(u => u.id === parseInt(userId));
  const course = courses.find(c => c.id === parseInt(courseId));

  // Resource validation
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (!course) return res.status(404).json({ error: 'Course not found' });

  // Check for existing enrollment
  const existingEnrollment = enrollments.find(
    e => e.userId === parseInt(userId) && e.courseId === parseInt(courseId)
  );

  if (existingEnrollment) {
    return res.status(400).json({ error: 'Already enrolled in this course' });
  }

  // Create enrollment
  const enrollment = {
    id: enrollments.length + 1,
    userId: parseInt(userId),
    courseId: parseInt(courseId),
    enrolledAt: new Date()
  };

  enrollments.push(enrollment);
  user.enrolledCourses.push(courseId);

  // RETURN THE EXACT REQUIRED RESPONSE FORMAT
  res.json({ message: `User ${userId} successfully enrolled in course ${courseId}.` });
});


// 7. GET user's enrolled courses
app.get('/api/user/:userId/courses', (req, res) => {
  const userId = parseInt(req.params.userId);
  
  const userEnrollments = enrollments.filter(e => e.userId === userId);
  const userCourses = userEnrollments.map(enrollment => {
    const course = courses.find(c => c.id === enrollment.courseId);
    const courseProgress = progress.find(p => 
      p.userId === userId && p.courseId === enrollment.courseId
    ) || { progress: 0 };
    
    return {
      ...course,
      enrolledAt: enrollment.enrolledAt,
      progress: courseProgress.progress
    };
  });

  res.json(userCourses);
});

// 8. POST track progress
app.post('/api/track-progress', (req, res) => {
  const { userId, courseId, progressValue } = req.body;

  if (!userId || !courseId || progressValue === undefined) {
    return res.status(400).json({ error: 'User ID, Course ID, and progress value are required' });
  }

  const existingProgress = progress.findIndex(
    p => p.userId === parseInt(userId) && p.courseId === parseInt(courseId)
  );

  if (existingProgress !== -1) {
    progress[existingProgress].progress = progressValue;
    progress[existingProgress].updatedAt = new Date();
  } else {
    progress.push({
      id: progress.length + 1,
      userId: parseInt(userId),
      courseId: parseInt(courseId),
      progress: progressValue,
      updatedAt: new Date()
    });
  }

  res.json({ message: 'Progress updated successfully' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});