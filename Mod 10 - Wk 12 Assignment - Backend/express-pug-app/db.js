// ==========================================
// PART 1c: SQLITE DATABASE SETUP
// ==========================================
// db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./books.db'); // or path.join(__dirname, 'books.db')

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL
  )`);
});

module.exports = db;
