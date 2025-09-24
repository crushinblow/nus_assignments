// -------- Load environment variables --------
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const mongoose = require('mongoose');

// -------- Import Mongo Routes --------  Require routes immediately after express etc.
const schoolRoutes = require('./routes/schoolRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// -------- Middleware --------
app.use(cors());
app.use(express.json());

// -------- MySQL Connection (use pool instead of single connection) --------
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'lms_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
  } else {
    console.log('✅ Connected to MySQL database');
    connection.release();
  }
});

// MySQL health check
app.get('/api/db-ping/mysql', (req, res) => {
  pool.query('SELECT NOW() AS now', (error, results) => {
    if (error) return res.status(500).json({ db: 'mysql', error: error.message });
    res.json({ db: 'mysql', now: results[0].now });
  });
});

// -------- MongoDB Connection --------
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms_mongodb';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

app.get('/api/db-ping/mongo', (req, res) => {
  res.json({ db: 'mongo', readyState: mongoose.connection.readyState }); // 1 = connected
});


//mount the routes
app.use('/api/schools', schoolRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/users', userRoutes);

// -------- MySQL-backed Endpoints --------

// Home
app.get('/', (req, res) => {
  res.send('Welcome to the LMS backend API (MySQL + MongoDB)');
});

// GET all courses
app.get('/api/courses', (req, res) => {
  pool.query('SELECT * FROM courses', (error, results) => {
    if (error) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// Recommendations
app.get('/api/recommend', (req, res) => {
  const interest = req.query.interest?.toLowerCase();
  if (!interest) return res.status(400).json({ error: 'Interest parameter is required' });

  let query = 'SELECT * FROM courses WHERE ';
  if (interest.includes('web') || interest.includes('react')) {
    query += "course_name LIKE '%HTML%' OR course_name LIKE '%CSS%' OR course_name LIKE '%Web%'";
  } else if (interest.includes('data')) {
    query += "course_name LIKE '%Data%' OR course_name LIKE '%SQL%'";
  } else if (interest.includes('ai') || interest.includes('machine')) {
    query += "course_name LIKE '%AI%' OR course_name LIKE '%Machine%' OR course_name LIKE '%ML%'";
  } else {
    query = 'SELECT * FROM courses LIMIT 3';
  }

  pool.query(query, (error, results) => {
    if (error) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// Register user
app.post('/api/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }

  pool.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
    if (error) return res.status(500).json({ error: 'Database error' });
    if (results.length > 0) return res.status(400).json({ error: 'User already exists' });

    pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password],
      (error, insertResult) => {
        if (error) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ message: 'User created successfully', userId: insertResult.insertId });
      }
    );
  });
});

// Login user
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  pool.query(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (error, results) => {
      if (error) return res.status(500).json({ error: 'Database error' });
      if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

      const user = results[0];
      res.json({ message: 'Login successful', userId: user.user_id });
    }
  );
});

// Enroll user in course
app.post('/enroll', (req, res) => {
  const { userId, courseId } = req.body;
  if (!userId || !courseId) return res.status(400).json({ error: 'Missing userId or courseId in request.' });

  pool.query(
    'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
    [userId, courseId],
    (error, results) => {
      if (error) return res.status(500).json({ error: 'Database error' });
      if (results.length > 0) return res.status(400).json({ error: 'Already enrolled in this course' });

      pool.query(
        'INSERT INTO enrollments (user_id, course_id, enrollment_date) VALUES (?, ?, CURDATE())',
        [userId, courseId],
        (error) => {
          if (error) return res.status(500).json({ error: 'Database error' });
          res.json({ message: `User ${userId} successfully enrolled in course ${courseId}.` });
        }
      );
    }
  );
});

// User's enrolled courses
app.get('/api/user/:userId/courses', (req, res) => {
  const userId = req.params.userId;
  pool.query(
    `SELECT u.name, u.email, c.course_name, c.description, e.enrollment_date
     FROM enrollments e
     JOIN users u   ON e.user_id = u.user_id
     JOIN courses c ON e.course_id = c.course_id
     WHERE e.user_id = ?`,
    [userId],
    (error, results) => {
      if (error) return res.status(500).json({ error: 'Database error' });
      res.json(results);
    }
  );
});

// Track progress (placeholder)
app.post('/api/track-progress', (req, res) => {
  const { userId, courseId, progressValue } = req.body;
  if (!userId || !courseId || progressValue === undefined) {
    return res.status(400).json({ error: 'User ID, Course ID, and progress value are required' });
  }
  res.json({ message: 'Progress tracking would be implemented with a progress table' });
});

// -------- Start server --------
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});