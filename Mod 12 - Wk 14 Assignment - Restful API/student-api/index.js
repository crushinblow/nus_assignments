const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let students = [
  { id: 1, name: "Peter", email: "peter@example.com", program: "Computer Science" },
  { id: 2, name: "Jane", email: "jane@example.com", program: "Information Systems" }
];

// GET /students - Get all students
app.get('/students', (req, res) => {
  res.status(200).json(students);
});

// GET /students/:id - Get student by ID
app.get('/students/:id', (req, res) => {vs
  const id = parseInt(req.params.id);
  const student = students.find(s => s.id === id);
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }
  res.status(200).json(student);
});

// POST /students - Add new student
app.post('/students', (req, res) => {
  const { id, name, email, program } = req.body;
  if (!id || !name || !email || !program) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const existing = students.find(s => s.id === id);
  if (existing) {
    return res.status(400).json({ error: "Student ID already exists" });
  }

  const newStudent = { id, name, email, program };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

// PUT /students/:id - Update student by ID
app.put('/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, program } = req.body;

  const student = students.find(s => s.id === id);
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  if (name) student.name = name;
  if (email) student.email = email;
  if (program) student.program = program;

  res.status(200).json(student);
});

// DELETE /students/:id - Delete student by ID
app.delete('/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = students.findIndex(s => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Student not found" });
  }

  students.splice(index, 1);
  res.status(200).json({ message: "Student deleted" });
});

app.listen(port, () => {
  console.log(`Student API is running on http://localhost:${port}`);
});
