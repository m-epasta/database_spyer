import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Play, RotateCcw, Terminal, PlayCircle } from 'lucide-react';
import { QueryResult } from '../../../models/database';
import { useDatabase } from '../../../hooks/databaseContext';
import './QueryEditor.scss';

const QueryEditor: React.FC = () => {
  const { currentDatabasePath } = useDatabase();
  const [query, setQuery] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunQuery = async () => {
    if (!query.trim()) return;
    if (!currentDatabasePath) {
      setError('No database selected. Please select a database first.');
      return;
    }

    setIsRunning(true);
    setResults(null);
    setError(null);

    try {
      const result: QueryResult = await invoke('execute_query', {
        path: currentDatabasePath,
        query: query.trim()
      });

      setResults(result);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute query';
      setError(errorMessage);
    } finally {
      setIsRunning(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults(null);
  };

  const sampleQueries = [
    'SELECT * FROM your_table LIMIT 10;',
    'SELECT COUNT(*) FROM your_table;',
    'SELECT * FROM your_table WHERE id > 100;',
  ];

  return (
    <div className="query-editor">
      {/* Terminal Header */}
      <div className="terminal-header">
        <div className="terminal-info">
          <Terminal size={18} />
          <span>SQL Terminal</span>
        </div>
        <div className="terminal-status">
          <div className="status-light" />
          <span>Ready</span>
        </div>
      </div>

      <div className="terminal-content">
        {/* Query Input */}
        <div className="query-input-section">
          <div className="query-prompt">
            <span className="prompt-symbol">$</span>
            <span className="prompt-text">db-spyer</span>
          </div>

          <textarea
            className="query-textarea"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your SQL query here..."
            spellCheck={false}
            autoComplete="off"
            rows={6}
          />
        </div>

        {/* Query Actions */}
        <div className="query-actions">
          <button
            className="action-btn execute"
            onClick={handleRunQuery}
            disabled={!query.trim() || isRunning}
          >
            {isRunning ? (
              <>
                <div className="btn-spinner" />
                Executing...
              </>
            ) : (
              <>
                <Play size={14} />
                Run Query
              </>
            )}
          </button>

          <button
            className="action-btn"
            onClick={handleClear}
          >
            <RotateCcw size={14} />
            Clear
          </button>
        </div>

        {/* Sample Queries */}
        <div className="sample-queries">
          <h4>Quick Start</h4>
          <div className="sample-grid">
            {sampleQueries.map((sampleQuery, index) => (
              <button
                key={index}
                className="sample-query-btn"
                onClick={() => setQuery(sampleQuery)}
              >
                <PlayCircle size={12} />
                {sampleQuery}
              </button>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-section">
            <div className="error-message">
              <Terminal size={20} />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Results Section */}
        {(results || isRunning) && (
          <div className="results-section">
            <div className="results-header">
              <h4>Query Results</h4>
              {results && (
                <span className="results-count">
                  {results.rowCount} row{results.rowCount !== 1 ? 's' : ''} ({(results.executionTimeMs / 1000).toFixed(2)}s)
                </span>
              )}
            </div>

            {isRunning ? (
              <div className="loading-results">
                <div className="terminal-spinner" />
                <span>Executing query...</span>
              </div>
            ) : results && results.rowCount > 0 ? (
              <div className="results-table">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        {results.columns.map(col => (
                          <th key={col}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.rows.map((row, index) => (
                        <tr key={index}>
                          {row.map((value, cellIndex) => (
                            <td key={cellIndex}>{value || 'NULL'}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : results && results.rowCount === 0 ? (
              <div className="no-results">
                <Terminal size={24} />
                <p>Query executed successfully</p>
                <span className="execution-time">Execution time: {(results.executionTimeMs / 1000).toFixed(2)}s</span>
              </div>
            ) : (
              <div className="no-results">
                <Terminal size={24} />
                <p>No results to display</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryEditor;
