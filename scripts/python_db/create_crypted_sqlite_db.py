# scripts/python_db/create_simple_encrypted.py
import sqlite3
import os
import base64
import hashlib
from cryptography.fernet import Fernet

def create_simple_encrypted_db(password: str="testpassword123"):
    """
    Creates a database that your detector will classify as encrypted/unknown
    Uses Fernet encryption to encrypt some data within the database
    """
    
    output_file = 'simple_encrypted.db'
    
    # Remove existing file
    if os.path.exists(output_file):
        os.remove(output_file)
    
    # Generate encryption key from password
    key = hashlib.sha256(password.encode()).digest()
    fernet_key = base64.urlsafe_b64encode(key)
    fernet = Fernet(fernet_key)
    
    # Create database
    conn = sqlite3.connect(output_file)
    cursor = conn.cursor()
    
    # Create encryption marker table (this will be encrypted binary)
    cursor.execute('CREATE TABLE encryption_marker (marker TEXT)')
    
    # Insert encrypted marker
    encrypted_marker = fernet.encrypt(b'ENCRYPTED_DATABASE_MARKER').decode()
    cursor.execute("INSERT INTO encryption_marker VALUES (?)", (encrypted_marker,))
    
    # Create metadata table
    cursor.execute('''
    CREATE TABLE metadata (
        key TEXT PRIMARY KEY,
        value TEXT
    )
    ''')
    
    # Store encryption info (plain text for now)
    cursor.execute("INSERT INTO metadata VALUES (?, ?)", 
                  ('encryption_method', 'Fernet'))
    cursor.execute("INSERT INTO metadata VALUES (?, ?)",
                  ('created_at', '2025-12-05'))
    
    # Create sample encrypted table
    cursor.execute('''
    CREATE TABLE encrypted_users (
        id INTEGER PRIMARY KEY,
        encrypted_name TEXT,
        encrypted_email TEXT
    )
    ''')
    
    # Encrypt sample data
    sample_users = [
        ('alice', 'alice@example.com'),
        ('bob', 'bob@example.com'),
        ('charlie', 'charlie@example.com')
    ]
    
    for name, email in sample_users:
        encrypted_name = fernet.encrypt(name.encode()).decode()
        encrypted_email = fernet.encrypt(email.encode()).decode()
        cursor.execute("INSERT INTO encrypted_users (encrypted_name, encrypted_email) VALUES (?, ?)",
                      (encrypted_name, encrypted_email))
    
    conn.commit()
    conn.close()
    
    print(f"✅ Successfully created simple encrypted database: {output_file}")
    print(f"🔒 Password used: {password}")
    print(f"📊 Database contains:")
    print("   - Encryption marker table")
    print("   - Metadata table")  
    print("   - Sample encrypted users data")
    print("\n💡 This database will be detected as 'unknown' or 'encrypted' by your app")
    print(f"🔑 To decrypt manually: Use password '{password}' with Fernet")

if __name__ == "__main__":
    create_simple_encrypted_db()
