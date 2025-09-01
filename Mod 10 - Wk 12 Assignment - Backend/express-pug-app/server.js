const express = require('express');
const app = express();
const port = 3001;
const path = require('path');

// ==========================================
// PART 1c: DATABASE INTEGRATION 
// ==========================================
const db = require('./db');
const bookRoutes = require('./routes/books');

// ==========================================
// EXPRESS SESSION SETUP (Q3b)
// ==========================================
const session = require('express-session');

app.use(session({
    secret: 'mySecretKey12345',     // use any secret string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }       // must be false for localhost
}));

// ==========================================
// VIEW ENGINE SETUP
// ==========================================
app.set('view engine', 'pug');
app.set('views', './views');

// ==========================================
// ROUTES
// ==========================================

// Basic route
app.get('/', (req, res) => {
    console.log("Someone accessed the home page!");
    res.send('Hello World!');
});

// Dynamic content route
app.get('/greet/:name', (req, res) => {
    const userName = req.params.name;
    res.render('greet', { 
        title: 'Greeting Page',
        name: userName,
        currentDate: new Date().toLocaleDateString()
    });
});

// BOOK ROUTES (PART 1c)
app.use(express.urlencoded({ extended: true }));
app.use('/', bookRoutes);

// ==========================================
// STATIC FILES (Q3a)
// ==========================================
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// SESSION TEST ROUTES (Q3b)
// ==========================================

// Set session value
app.get('/set-session', (req, res) => {
    req.session.username = "expressUser123";
    res.send("✅ Session value 'username' has been set.");
});

// Get session value
app.get('/get-session', (req, res) => {
    const user = req.session.username || "❌ No session value set.";
    res.send(`🧠 Current session username: ${user}`);
});

// ==========================================
// START SERVER
// ==========================================
app.listen(port, () => {
    console.log(`Server REALLY running at http://localhost:${port}`);
});
