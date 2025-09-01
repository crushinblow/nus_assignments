from flask import Flask, render_template, request, session
import sqlite3  # Q4a: Required for SQLite integration

app = Flask(__name__)

# ==========================================
# Q3d: Enable session support in Flask
# ==========================================
app.secret_key = 'flaskSecret123'  # Required for session management

# ==========================================
# Q4a: SQLite database connection helper
# ==========================================
def get_db_connection():
    conn = sqlite3.connect('books.db')  # Make sure books.db exists
    conn.row_factory = sqlite3.Row     # Access columns by name
    return conn

# ==========================================
# ✅ DEBUG: Simple route to confirm Flask server is running
# ==========================================
@app.route('/test')
def test():
    return '✅ Flask is working!'

# ==========================================
# Q4a: One-time route to create "books" table
# ==========================================
@app.route('/init-db')
def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()
    return '✅ Table "books" created (if not already).'

# ==========================================
# Home route (Q3c: includes static CSS + image in template)
# ==========================================
@app.route('/')
def home():
    return render_template('index.html')

# ==========================================
# Dynamic route example
# ==========================================
@app.route('/hello/<name>')
def hello(name):
    return render_template('hello.html', username=name)

# ==========================================
# 1c) Route to demonstrate handling GET and POST
# ==========================================
@app.route('/submit', methods=['GET', 'POST'])
def submit():
    if request.method == 'POST':
        name = request.form.get('name')
        return f'Hello, {name}! You submitted a POST request.'
    else:
        return '''
            <form method="POST">
                Name: <input type="text" name="name" placeholder="Enter your name">
                <input type="submit" value="Submit">
            </form>
        '''

# ==========================================
# Q3d: Flask session test routes
# ==========================================
@app.route('/set-session')
def set_session():
    session['username'] = 'flaskUser123'
    return '✅ Flask session set!'

@app.route('/get-session')
def get_session():
    user = session.get('username', '❌ No session value set.')
    return f'🧠 Flask session username: {user}'

# ==========================================
# Q4a: Flask CRUD routes using SQLite
# ==========================================

# ✅ Create: Add a new book (used with Postman or form POST)
@app.route('/flask/books/add', methods=['POST'])
def flask_add_book():
    title = request.form['title']
    author = request.form['author']
    conn = get_db_connection()
    conn.execute('INSERT INTO books (title, author) VALUES (?, ?)', (title, author))
    conn.commit()
    conn.close()
    return '✅ Book added!'

# ✅ Optional: Prevent "URL not found" if GET is used accidentally
@app.route('/flask/books/add', methods=['GET'])
def flask_add_book_debug():
    return '👋 This route expects a POST request (e.g. from Postman or HTML form).'

# ✅ Read: Show all books
@app.route('/flask/books')
def flask_get_books():
    conn = get_db_connection()
    books = conn.execute('SELECT * FROM books').fetchall()
    conn.close()
    return render_template('books.html', books=books)

# ✅ Update: Modify a book
@app.route('/flask/books/update/<int:id>', methods=['POST'])
def flask_update_book(id):
    title = request.form['title']
    author = request.form['author']
    conn = get_db_connection()
    conn.execute('UPDATE books SET title = ?, author = ? WHERE id = ?', (title, author, id))
    conn.commit()
    conn.close()
    return f'✅ Book {id} updated!'

# ✅ Delete: Remove a book
@app.route('/flask/books/delete/<int:id>', methods=['POST'])
def flask_delete_book(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM books WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return f'🗑️ Book {id} deleted!'

# ==========================================
# Start the server
# ==========================================
if __name__ == '__main__':
    app.run(debug=True, port=3002)
