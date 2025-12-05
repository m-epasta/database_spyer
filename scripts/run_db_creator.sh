#!/bin/bash

# run_db_creator.sh - Unified database creation launcher for Database Spyer
set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging functions
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_header() { echo -e "${PURPLE}🚀 $1${NC}"; }
log_step() { echo -e "${CYAN}🔸 $1${NC}"; }

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PYTHON_DIR="$PROJECT_ROOT/scripts/python_db"
EXECUTOR_DIR="$SCRIPT_DIR/executor"

# Database creation menu
show_menu() {
    echo ""
    log_header "Database Creation Tool for Database Spyer"
    echo "=========================================="
    echo ""
    echo "Choose database type to create:"
    echo "1)  Regular SQLite database (unencrypted)"
    echo "2)  Simple encrypted database (test encryption)"
    echo "3)  PostgreSQL database (if configured)"
    echo "4)  Show available databases"
    echo "5)  Exit"
    echo ""
}

# Display current project info
log_info "Project root: $PROJECT_ROOT"
log_info "Scripts directory: $SCRIPT_DIR"
log_info "Database creators: $PYTHON_DIR"

# Check if we're in the right directory
if [ ! -d "$PYTHON_DIR" ]; then
    log_error "Python scripts directory not found: $PYTHON_DIR"
    log_info "Make sure you're running this from the project root"
    exit 1
fi

# Keep showing menu until user exits
while true; do
    show_menu
    read -p "Enter your choice (1-5): " CHOICE

    case $CHOICE in
        1)
            log_step "Creating Regular SQLite Database..."
            bash "$EXECUTOR_DIR/create_db.sh"
            log_success "Regular database creation completed!"
            ;;
        2)
            log_step "Creating Simple Encrypted Database..."
            bash "$EXECUTOR_DIR/create_crypted_db.sh"
            log_success "Encrypted database creation completed!"
            ;;
        3)
            log_warning "PostgreSQL support not implemented yet"
            log_info "Check create_postgres_db.py for PostgreSQL database creation"
            ;;
        4)
            log_step "Available databases in project:"
            echo ""
            echo " Regular databases (created by scripts):"
            if [ -f "$PYTHON_DIR/sample.db" ]; then
                echo "    sample.db ($(du -h "$PYTHON_DIR/sample.db" | cut -f1))"
            else
                echo "    sample.db (not found - run option 1)"
            fi

            echo ""
            echo " Completely Encrypted databases (created by scripts):"
            if [ -f "$PYTHON_DIR/completely_encrypted.db" ]; then
                echo "    completely_encrypted.db ($(du -h "$PYTHON_DIR/completely_encrypted.db" | cut -f1))"
            else
                echo "    completely_encrypted.db (not found - run option 2)"
            fi

            echo ""
            echo " Use these databases with Database Spyer app!"
            ;;
        5)
            log_info "process exited"
            exit 0
            ;;
        *)
            log_error "Invalid choice. Please enter a number between 1-5."
            sleep 1
            ;;
    esac

    echo ""
    read -p "Press Enter to continue..."
    clear
done
