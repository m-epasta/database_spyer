# NOT NEEDED FOR NOW
# # create_postgres_db.py
# import psycopg2
# from psycopg2 import sql
# import os

# def create_postgres_database():
#     # Connection parameters - UPDATE THESE FOR YOUR SETUP
#     db_params = {
#         'host': 'localhost',
#         'database': 'postgres',  # Connect to default database first
#         'user': 'postgres',
#         'password': 'password',  # Change this!
#         'port': 5432
#     }
    
#     try:
#         # Connect to PostgreSQL server
#         conn = psycopg2.connect(**db_params)
#         conn.autocommit = True  # Required for creating databases
#         cursor = conn.cursor()
        
#         # Create database (if it doesn't exist)
#         db_name = 'test_db'
        
#         cursor.execute(sql.SQL("SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s"), [db_name])
#         exists = cursor.fetchone()
        
#         if not exists:
#             cursor.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(db_name)))
#             print(f"✅ Database '{db_name}' created")
        
#         cursor.close()
#         conn.close()
        
#         # Now connect to the new database
#         db_params['database'] = db_name
#         conn = psycopg2.connect(**db_params)
#         cursor = conn.cursor()
        
#         # Create tables
#         cursor.execute('''
#         CREATE TABLE IF NOT EXISTS users (
#             id SERIAL PRIMARY KEY,
#             username VARCHAR(50) UNIQUE NOT NULL,
#             email VARCHAR(100) UNIQUE NOT NULL,
#             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
#         )
#         ''')
        
#         cursor.execute('''
#         CREATE TABLE IF NOT EXISTS posts (
#             id SERIAL PRIMARY KEY,
#             user_id INTEGER REFERENCES users(id),
#             title VARCHAR(200) NOT NULL,
#             content TEXT,
#             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
#         )
#         ''')
        
#         # Insert sample data
#         users_data = [
#             ('alice', 'alice@example.com'),
#             ('bob', 'bob@example.com'),
#             ('charlie', 'charlie@example.com')
#         ]
        
#         cursor.executemany('INSERT INTO users (username, email) VALUES (%s, %s) ON CONFLICT DO NOTHING', users_data)
        
#         posts_data = [
#             (1, 'My First Post', 'This is the content of my first post!'),
#             (1, 'Another Post', 'More content here...'),
#             (2, 'Bob\'s Thoughts', 'Just sharing some thoughts'),
#             (3, 'Hello World', 'Classic first post')
#         ]
        
#         cursor.executemany('INSERT INTO posts (user_id, title, content) VALUES (%s, %s, %s)', posts_data)
        
#         # Commit and close
#         conn.commit()
#         cursor.close()
#         conn.close()
        
#         print(f"✅ PostgreSQL database '{db_name}' created and populated successfully!")
#         print("📊 Contains: users (3 records), posts (4 records)")
        
#     except Exception as e:
#         print(f"❌ Error: {e}")
#         print("💡 Make sure PostgreSQL is running and connection parameters are correct!")

# if __name__ == "__main__":
#     create_postgres_database()