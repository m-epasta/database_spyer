import React, { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { Database, Table, FolderOpen, AlertCircle, Loader2, RefreshCw, Eye, Settings } from 'lucide-react';
import { useDatabase } from '../../../hooks/databaseContext';
import './TableExplorer.scss';

const TableExplorer: React.FC = () => {
  const { setCurrentDatabasePath } = useDatabase();
  const [currentDbPath, setCurrentDbPath] = useState<string | null>(null);
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load tables when database changes
  const loadTables = useCallback(async (dbPath: string) => {
    setLoading(true);
    setError(null);
    try {
      const tableList: string[] = await invoke('get_table_list', { path: dbPath });
      setTables(tableList);
      setSelectedTable(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tables';
      setError(errorMessage);
      setTables([]);
    } finally {
      setLoading(false);
    }
  }, []);


  // Handle database file selection
  const handleFileSelect = async () => {
    try {
      const selected = await open({
        title: 'Select Database File',
        filters: [{
          name: 'Database files',
          extensions: ['db', 'sqlite', 'sqlite3'],
        }],
        multiple: false,
        defaultPath: undefined,
      });

      if (selected && typeof selected === 'string') {
        setCurrentDbPath(selected);
        setCurrentDatabasePath(selected);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to open file dialog';
      setError(errorMessage);
    }
  };

  // Handle table selection - just for visual feedback
  const handleTableSelect = (tableName: string) => {
    setSelectedTable(selectedTable === tableName ? null : tableName); // Toggle selection
  };

  // Load tables when database changes
  useEffect(() => {
    if (currentDbPath) {
      loadTables(currentDbPath);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDbPath]); // Don't include loadTables to prevent loops

  return (
    <div className="table-explorer">
      {/* Connection Header */}
      {currentDbPath && (
        <div className="connection-header">
          <div className="connection-badge connected">
            <div className="status-dot" style={{ backgroundColor: '#10b981' }} />
            Connected
          </div>
          <span className="db-path">{currentDbPath.split('/').pop()}</span>
        </div>
      )}

      <div className="explorer-content">
        {/* Database Selection */}
        {!currentDbPath ? (
          <div className="no-database">
            <div className="no-db-message">
              <Database size={48} className="no-db-icon" />
              <h2>No Database Selected</h2>
              <p>Select a SQLite database file to start exploring tables and data</p>
              <button
                onClick={handleFileSelect}
                className="select-db-btn"
              >
                <FolderOpen size={16} />
                Select Database
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Tables Section */}
            <div className="tables-section">
              <div className="tables-header">
                <h2>
                  <Table size={18} />
                  Tables
                </h2>
                <div className="header-actions">
                  <button className="refresh-btn" onClick={() => loadTables(currentDbPath)}>
                    <RefreshCw size={14} />
                    Refresh
                  </button>
                  <button className="refresh-btn" onClick={handleFileSelect}>
                    <FolderOpen size={14} />
                    Change DB
                  </button>
                </div>
              </div>

              {loading && tables.length === 0 ? (
                <div className="loading-state">
                  <Loader2 className="spinner" />
                  <span>Loading tables...</span>
                </div>
              ) : error ? (
                <div className="error-message">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              ) : tables.length === 0 ? (
                <div className="empty-tables">
                  <Table size={32} />
                  <p>No tables found</p>
                  <p>This database appears to be empty</p>
                </div>
              ) : (
                <>
                  {/* List Header */}
                  <div className="list-header">
                    <div className="list-header-grid">
                      <span></span>
                      <span></span>
                      <span className="header-label">Name</span>
                      <span className="header-label">Type</span>
                      <span className="header-label">Actions</span>
                    </div>
                  </div>

                  {/* Tables List */}
                  <div className="tables-list">
                    {tables.map(tableName => (
                      <div
                        key={tableName}
                        className={`table-item ${selectedTable === tableName ? 'selected' : ''}`}
                        onClick={() => handleTableSelect(tableName)}
                      >
                        <div className="table-status">
                          <div className="status-indicator" />
                        </div>
                        <div className="table-icon-area">
                          <Table className="table-icon" />
                        </div>
                        <div className="table-info">
                          <div className="table-name">{tableName}</div>
                          <div className="table-meta">
                            <span>Table</span>
                            <span>Ready</span>
                          </div>
                        </div>
                        <div className="table-actions">
                          <button className="action-btn-small" title="View">
                            <Eye size={12} />
                          </button>
                          <button className="action-btn-small" title="Settings">
                            <Settings size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Stats Bar */}
            {tables.length > 0 && (
              <div className="stats-bar">
                <div className="stat-item">
                  <span>Tables:</span>
                  <span className="stat-value">{tables.length}</span>
                </div>
                <div className="stat-item">
                  <span>Selected:</span>
                  <span className="stat-value">{selectedTable ? 1 : 0}</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(TableExplorer);
