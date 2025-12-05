#!/bin/bash

# create_db.sh - Create unencrypted SQLite database for testing
set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

log_info "Setting up environment and creating sample SQLite database..."

# Navigate to project root directory first
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PYTHON_DIR="$PROJECT_ROOT/scripts/python_db"

log_info "Project root: $PROJECT_ROOT"
log_info "Python scripts: $PYTHON_DIR"

# Navigate to python_db directory
cd "$PYTHON_DIR" || { log_error "Failed to navigate to $PYTHON_DIR"; exit 1; }

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    log_error "Python 3 is not installed or not in PATH"
    exit 1
fi

log_info "Python 3 found: $(python3 --version)"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    log_info "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
log_info "Activating virtual environment..."
source venv/bin/activate

# Install cryptography for database operations
log_info "Installing required dependencies..."
pip install cryptography > /dev/null 2>&1
log_success "Dependencies installed"

# Check if the Python script exists
PYTHON_SCRIPT="create_sqlite_db.py"
if [ ! -f "$PYTHON_SCRIPT" ]; then
    log_error "$PYTHON_SCRIPT not found in $(pwd)"
    log_info "Available files:"
    ls -la *.py 2>/dev/null || log_warning "No Python scripts found"
    deactivate
    exit 1
fi

# Run the Python script
log_info "Running database creation script..."
if python3 "$PYTHON_SCRIPT"; then
    log_success "Python script executed successfully"
else
    log_error "Python script failed with exit code $?"
    deactivate
    exit 1
fi

# Check if the database was created successfully
OUTPUT_FILE="sample.db"
if [ -f "$OUTPUT_FILE" ]; then
    FILE_SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
    FILE_PATH="$(pwd)/$OUTPUT_FILE"

    log_success "Database created successfully!"
    echo ""
    echo "  File: $OUTPUT_FILE"
    echo "  Path: $FILE_PATH"
    echo "  Size: $FILE_SIZE"
    echo ""
    echo "Ready for testing with Database Spyer!"

else
    log_error "Database file '$OUTPUT_FILE' was not created"
    log_info "Check the Python script output above for errors"
    deactivate
    exit 1
fi

# Deactivate virtual environment
deactivate
log_success "Setup complete! Virtual environment deactivated."
