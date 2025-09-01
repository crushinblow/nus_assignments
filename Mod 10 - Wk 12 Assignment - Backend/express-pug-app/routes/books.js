// ==========================================
// PART 1c: BOOK ROUTES
// ==========================================
const express = require('express');
const router = express.Router();
const db = require('../db');

// Display all books
router.get('/books', (req, res) => {
  db.all("SELECT * FROM books", (err, rows) => {
    if (err) {
      return res.status(500).send("Database error");
    }
    res.render('books', { title: 'Book List', books: rows });
  });
});

// Show add book form
router.get('/add-book', (req, res) => {
  res.render('add-book', { title: 'Add a New Book' });
});

// Handle form submission
router.post('/add-book', (req, res) => {
  const { title, author } = req.body;
  db.run("INSERT INTO books (title, author) VALUES (?, ?)", [title, author], function (err) {
    if (err) {
      return res.status(500).send("Failed to add book");
    }
    res.redirect('/books');
  });
});

module.exports = router;
