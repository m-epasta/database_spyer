#!/usr/bin/env python3
"""
create_crypted_sqlite_db.py - Creates truly encrypted SQLite databases

This script creates databases where NOTHING is readable in raw binary format.
The entire file is encrypted, showing only gibberish in hex editors.
"""

import sqlite3
import os
import base64
import hashlib
from cryptography.fernet import Fernet

def create_completely_encrypted_db(password: str = "securepassword123", output_file: str = "completely_encrypted.db"):
    """
    Creates a truly encrypted database where the ENTIRE file is encrypted.
    Nothing is readable - not table schemas, column names, or any SQLite structure.
    """

    # Remove existing file
    if os.path.exists(output_file):
        os.remove(output_file)

    print(f"🔐 Creating completely encrypted database: {output_file}")

    # Step 1: Create temporary clear SQLite database
    temp_db = 'temp_clear_for_encryption.db'

    print("📝 Creating temporary clear database...")

    conn = sqlite3.connect(temp_db)
    cursor = conn.cursor()

    # Create all tables with realistic schema
    cursor.execute('''
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT DEFAULT 'user',
        password_hash TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    cursor.execute('''
    CREATE TABLE posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT,
        tags TEXT,
        is_published BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    ''')

    cursor.execute('''
    CREATE TABLE comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        user_id INTEGER,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    ''')

    cursor.execute('CREATE TABLE metadata (key TEXT PRIMARY KEY, value TEXT)')

    # Insert sample data with sensitive information
    print("📊 Inserting sample data...")
    users_data = [
        ('alice_admin', 'alice@company.com', 'admin', 'hashed_password_123'),
        ('bob_user', 'bob@customer.com', 'user', 'hashed_password_456'),
        ('charlie_moderator', 'charlie@support.com', 'moderator', 'hashed_password_789'),
        ('diana_analyst', 'diana@analytics.com', 'analyst', 'hashed_password_ABC')
    ]

    cursor.executemany('INSERT INTO users (username, email, role, password_hash) VALUES (?, ?, ?, ?)', users_data)

    posts_data = [
        (1, 'System Security Update', 'Database encryption implemented successfully', 'security,encryption,update'),
        (1, 'User Management Guide', 'Best practices for user administration', 'admin,users,guide'),
        (2, 'Feature Request: Dark Mode', 'Would love to see dark mode implemented', 'feature,dark-mode,ui'),
        (3, 'Content Moderation Policy', 'Guidelines for moderating user-generated content', 'moderation,policy,content'),
        (4, 'Analytics Dashboard Update', 'New metrics and visualizations available', 'analytics,dashboard,metrics'),
        (1, 'Database Performance Report', 'Recent query performance improvements', 'performance,database,optimization')
    ]

    cursor.executemany('INSERT INTO posts (user_id, title, content, tags, is_published) VALUES (?, ?, ?, ?, 1)', posts_data)

    comments_data = [
        (1, 1, 'Great work on the encryption implementation!'),
        (1, 2, 'This guide is very helpful for new administrators.'),
        (2, 1, 'Will this affect existing user sessions?'),
        (1, 3, 'Dark mode would definitely improve user experience.'),
        (3, 3, 'Could include automatic switching based on system theme.'),
        (3, 4, 'These guidelines will help maintain quality standards.'),
        (4, 6, 'The query performance improvements are noticeable!')
    ]

    cursor.executemany('INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)', comments_data)

    # Add metadata
    cursor.execute("INSERT INTO metadata VALUES (?, ?)", ('database_version', '1.0'))
    cursor.execute("INSERT INTO metadata VALUES (?, ?)", ('encryption_method', 'CompleteFileEncryption'))
    cursor.execute("INSERT INTO metadata VALUES (?, ?)", ('created_at', '2025-12-05UTC'))
    cursor.execute("INSERT INTO metadata VALUES (?, ?)", ('data_sensitivity', 'high'))
    cursor.execute("INSERT INTO metadata VALUES (?, ?)", ('backup_required', 'true'))

    conn.commit()
    conn.close()

    # Step 2: Convert entire database to binary data
    print("🔄 Converting database to binary for full encryption...")
    with open(temp_db, 'rb') as f:
        clear_data = f.read()

    print(f"💾 Unencrypted database size: {len(clear_data)} bytes")

    # Step 3: Generate encryption key from password
    salt = "database_encryption_salt_v2"  # Unique salt for this database format
    key_material = hashlib.sha256((password + salt).encode()).digest()
    fernet_key = base64.urlsafe_b64encode(key_material)
    fernet = Fernet(fernet_key)

    # Step 4: Encrypt the entire database content
    print("🔒 Encrypting entire database file...")
    encrypted_data = fernet.encrypt(clear_data)

    # Add custom header to identify our encrypted database format
    custom_header = b'COMPLETELY_ENCRYPTED_DB_V2\x00'  # Magic identifier
    version_bytes = b'\x02\x00'  # Version 2.0

    # Combine: Header + Version + Encrypted Data
    final_data = custom_header + version_bytes + encrypted_data

    # Step 5: Write completely encrypted file
    with open(output_file, 'wb') as f:
        f.write(final_data)

    # Clean up temporary file
    os.remove(temp_db)

    final_size = len(final_data)

    print("✅ COMPLETELY ENCRYPTED database created successfully!")
    print(f"📁 File: {output_file}")
    print(f"📊 Final size: {final_size} bytes")
    print(f"🔑 Password: {password}")
    print("")
    print("🔍 In hex editor, you'll see:")
    print("   - Custom header: 'COMPLETELY_ENCRYPTED_DB_V2'")
    print("   - Version: 2.0")
    print("   - Rest: Pure encrypted gibberish")
    print("")
    print("🚫 Nothing human-readable - table/schema/data all encrypted!")
    print("💡 To decrypt, use the same password with Fernet decryption")

    return output_file

def verify_encryption(file_path: str, password: str = "securepassword123") -> bool:
    """
    Verify that a database file is properly encrypted
    """
    if not os.path.exists(file_path):
        print(f"❌ File {file_path} does not exist")
        return False

    print(f"🔍 Verifying encryption of: {file_path}")

    with open(file_path, 'rb') as f:
        header = f.read(28)  # Our custom header + version length

    expected_header = b'COMPLETELY_ENCRYPTED_DB_V2\x00\x02\x00'
    if header != expected_header:
        print("❌ File is not a completely encrypted database")
        return False

    print("✅ File has proper encrypted database header")

    with open(file_path, 'rb') as f:
        file_data = f.read()

    # Try to decrypt
    try:
        # Skip header and version (28 bytes total)
        encrypted_payload = file_data[28:]

        salt = "database_encryption_salt_v2"
        key_material = hashlib.sha256((password + salt).encode()).digest()
        fernet_key = base64.urlsafe_b64encode(key_material)
        fernet = Fernet(fernet_key)

        decrypted_data = fernet.decrypt(encrypted_payload)
        print("✅ Successfully decrypted file")
        print(f"📊 Decrypted size: {len(decrypted_data)} bytes")
        return True

    except Exception as e:
        print(f"❌ Decryption failed: {e}")
        return False

if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "verify":
        # Verify existing file
        file_to_verify = sys.argv[2] if len(sys.argv) > 2 else "completely_encrypted.db"
        password = sys.argv[3] if len(sys.argv) > 3 else "securepassword123"
        verify_encryption(file_to_verify, password)
    else:
        # Create new encrypted database
        password = sys.argv[1] if len(sys.argv) > 1 else "securepassword123"
        create_completely_encrypted_db(password)
