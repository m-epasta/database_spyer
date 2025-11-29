# create_sqlite_db.py
import sqlite3
import os

def create_sqlite_database():
    # Remove existing file if it exists
    if os.path.exists('sample.db'):
        os.remove('sample.db')
    
    # Create and connect to database
    conn = sqlite3.connect('sample.db')
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute('''
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT NOT NULL,
        content TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    ''')
    
    # Insert sample data
    users_data = [
        ('alice', 'alice@example.com'),
        ('bob', 'bob@example.com'),
        ('charlie', 'charlie@example.com')
    ]
    
    cursor.executemany('INSERT INTO users (username, email) VALUES (?, ?)', users_data)
    
    posts_data = [
        (1, 'My First Post', 'This is the content of my first post!'),
        (1, 'Another Post', 'More content here...'),
        (2, 'Bob\'s Thoughts', 'Just sharing some thoughts'),
        (3, 'Hello World', 'Classic first post')
    ]
    
    cursor.executemany('INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)', posts_data)
    
    # Commit and close
    conn.commit()
    conn.close()
    
    print("SQLite database created successfully: sample.db")
    print("Contains: users (3 records), posts (4 records)")

if __name__ == "__main__":
    create_sqlite_database()
