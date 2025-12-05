# 🗄️ Database Scripts for Database Spyer

This directory contains scripts for creating sample databases to test Database Spyer application.

## 📁 Directory Structure

```
scripts/
├── run_db_creator.sh          # 🚀 Main launcher script (recommended)
├── executor/
│   ├── create_db.sh          # 🔓 Unencrypted database creator
│   └── create_crypted_db.sh  # 🔐 Encrypted database creator
├── python_db/
│   ├── create_sqlite_db.py        # Python script for unencrypted SQLite
│   ├── create_crypted_sqlite_db.py # Python script for encrypted SQLite
│   ├── create_postgres_db.py      # PostgreSQL creator (placeholder)
│   ├── requirements.txt           # Python dependencies
│   ├── sample.db                  # Generated unencrypted database
│   └── completely_encrypted.db    # Generated completely encrypted database
└── README.md                      # This file
```

## 🎯 Quick Start (Recommended)

Use the unified launcher:

```bash
# Make executable (if needed)
chmod +x scripts/run_db_creator.sh

# Run the interactive menu
bash scripts/run_db_creator.sh
```

## 📋 Available Databases

### 1. Regular SQLite Database (Unencrypted)
- **Creator**: `create_sqlite_db.py`
- **Output**: `sample.db`
- **Tables**: `users`, `posts`, `sqlite_sequence`
- **Data**: 3 users, 4 posts
- **Detection**: ✅ `unencrypted`

### 2. Completely Encrypted Database
- **Creator**: `create_crypted_sqlite_db.py`
- **Output**: `completely_encrypted.db`
- **Encryption**: Fernet complete file encryption (entire database encrypted)
- **Detection**: ⚠️ `unknown` or `encrypted` (by your app)
- **Password**: `securepassword123`
- **Security**: **Nothing human-readable in raw binary format**

### 3. PostgreSQL Database (Future)
- **Creator**: `create_postgres_db.py`
- **Status**: Placeholder, not implemented

## 🔧 Manual Usage

### Creating Unencrypted Database
```bash
bash scripts/executor/create_db.sh
```

### Creating Encrypted Database
```bash
bash scripts/executor/create_crypted_db.sh
```

### Python Direct Usage
```bash
cd scripts/python_db

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install cryptography

# Create databases
python3 create_sqlite_db.py          # Creates sample.db
python3 create_crypted_sqlite_db.py  # Creates completely_encrypted.db
```

## 🧪 Testing with Database Spyer

After creating databases, use them with your Database Spyer application:

```bash
npm run tauri dev
# Then load: scripts/python_db/sample.db
# Or load: scripts/python_db/simple_encrypted.db
```

### Expected Results:
- ✅ **sample.db**: Detected as `unencrypted` → loads successfully
- ⚠️ **simple_encrypted.db**: May be detected as `encrypted` or `unknown` depending on entropy analysis

## 🔐 Encryption Notes

### True SQLCipher Encryption (Advanced)
To create truly encrypted SQLite databases:

```bash
# Install SQLCipher (system-wide, complex)
# This requires compilation and system libraries
pip install pysqlcipher3
```

### Current Simple Encryption
The `create_crypted_sqlite_db.py` uses Fernet encryption:
- **Pros**: Easy to implement, decent security for testing
- **Cons**: Not true database-level encryption (data is encrypted, but structure visible)
- **Detection**: Your app may classify as `unknown` since SQLite headers remain intact

## 📊 Database Schemas

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Posts Table
```sql
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT NOT NULL,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## 🚨 Troubleshooting

### Virtual Environment Issues
```bash
# Recreate venv if corrupted
cd scripts/python_db
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install cryptography
```

### File Permission Issues
```bash
# Make scripts executable
chmod +x scripts/run_db_creator.sh
chmod +x scripts/executor/*.sh
```

### Python Installation Issues
The scripts require Python 3.6+. Check with:
```bash
python3 --version
```

### Database Already Exists
Scripts will automatically overwrite existing files.

## 🎯 Development Notes

- **Virtual Environment**: All Python scripts use isolated venv in `scripts/python_db/venv/`
- **Caching**: Created databases remain until manually deleted or overwritten
- **Logging**: Bash scripts provide colored output with success/error indicators
- **Dependencies**: Only `cryptography` needed for encryption features

## 🔄 Updates

- **Unencrypted databases**: Working and tested
- **Encrypted databases**: Simple Fernet encryption (not SQLCipher)
- **PostgreSQL**: Placeholder for future implementation

## 📞 Support

For issues with:
- **Database creation**: Check script output for specific errors
- **App integration**: Test with both database types in Database Spyer
- **Encryption**: Current implementation is for testing only
