#!/bin/bash

# create_db.sh
echo "Setting up environment and creating sample SQLite database..."

# Navigate to python_db directory (go up one level from executor, then into python_db)
cd scripts/python_db

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed or not in PATH"
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
cd scripts/python_db
source venv/bin/activate

# Install requirements if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "Installing requirements..."
    pip install -r requirements.txt
fi

# Check if the Python script exists
if [ ! -f "create_sqlite_db.py" ]; then
    echo "create_sqlite_db.py not found in current directory"
    echo "Current directory: $(pwd)"
    deactivate
    exit 1
fi

# Run the Python script
echo "Running Python script..."
python create_sqlite_db.py

# Check if the script ran successfully
if [ $? -eq 0 ] && [ -f "sample.db" ]; then
    echo ""
    echo "Database created successfully!"
    echo "File: sample.db"
    
    # Show file info
    file_size=$(du -h sample.db | cut -f1)
    echo "Size: $file_size"
    
else
    echo "Failed to create database!"
    deactivate
    exit 1
fi

# Deactivate virtual environment
deactivate
echo ""
echo "Setup complete! Virtual environment is ready for future use."