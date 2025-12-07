import React, { useState } from 'react';
import { Play, Square, RotateCcw, Terminal, PlayCircle } from 'lucide-react';
import './QueryEditor.css';

const QueryEditor: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const handleRunQuery = async () => {
    if (!query.trim()) return;

    setIsRunning(true);
    setResults(null);

    // Simulate query execution - replace with actual API call
    setTimeout(() => {
      // Mock results
      setResults([
        { id: 1, name: 'Mock Record 1', value: 'Data A' },
        { id: 2, name: 'Mock Record 2', value: 'Data B' },
        { id: 3, name: 'Mock Record 3', value: 'Data C' },
      ]);
      setIsRunning(false);
    }, 1000);
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

        {/* Results Section */}
        {(results || isRunning) && (
          <div className="results-section">
            <div className="results-header">
              <h4>Query Results</h4>
              {results && (
                <span className="results-count">
                  {results.length} row{results.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {isRunning ? (
              <div className="loading-results">
                <div className="terminal-spinner" />
                <span>Executing query...</span>
              </div>
            ) : results && results.length > 0 ? (
              <div className="results-table">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        {Object.keys(results[0]).map(key => (
                          <th key={key}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value, cellIndex) => (
                            <td key={cellIndex}>{String(value)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
