-- Create and use database
CREATE DATABASE IF NOT EXISTS lms_db;
USE lms_db;

-- Create tables
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);

CREATE TABLE courses (
  course_id INT AUTO_INCREMENT PRIMARY KEY,
  course_name VARCHAR(100),
  description TEXT
);

CREATE TABLE enrollments (
  enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  course_id INT,
  enrollment_date DATE,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

CREATE TABLE assessments (
  assessment_id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT,
  title VARCHAR(100),
  max_score INT,
  FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

CREATE TABLE instructors (
  instructor_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE
);

-- Insert sample data
INSERT INTO users (name, email, password) VALUES 
('Alice Johnson', 'alice@example.com', 'alice123'),
('Bob Smith', 'bob@example.com', 'bob123'),
('Charlie Lee', 'charlie@example.com', 'charlie123');

INSERT INTO courses (course_name, description) VALUES 
('HTML Basics', 'Introduction to HTML and web structure.'),
('CSS Design', 'Learn how to style websites using CSS.'),
('MySQL for Beginners', 'Basic concepts of relational databases.');

INSERT INTO enrollments (user_id, course_id, enrollment_date) VALUES 
(1, 1, '2024-01-10'),
(1, 3, '2024-02-05'),
(2, 2, '2024-02-15'),
(3, 1, '2024-03-01');

INSERT INTO assessments (course_id, title, max_score) VALUES 
(1, 'HTML Quiz 1', 100),
(2, 'CSS Midterm', 80),
(3, 'MySQL Final Test', 90);

INSERT INTO instructors (name, email) VALUES 
('Professor Smith', 'smith@lms.com'),
('Dr. Johnson', 'johnson@lms.com'),
('Ms. Davis', 'davis@lms.com');

-- Complete the tasks
INSERT INTO users (name, email, password) VALUES 
('Daniel Rose', 'daniel@lms.com', 'daniel123');

INSERT INTO enrollments (user_id, course_id, enrollment_date)
SELECT u.user_id, c.course_id, CURDATE()
FROM users u, courses c
WHERE u.email = 'daniel@lms.com' AND c.course_name = 'CSS Design';

-- Show results
SELECT 'All users:' AS '';
SELECT * FROM users;

SELECT 'All courses:' AS '';
SELECT * FROM courses;

SELECT 'Users enrolled in CSS Design:' AS '';
SELECT u.user_id, u.name, u.email, e.enrollment_date
FROM users u
JOIN enrollments e ON u.user_id = e.user_id
JOIN courses c ON e.course_id = c.course_id
WHERE c.course_name = 'CSS Design';