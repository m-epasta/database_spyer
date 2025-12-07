import React, { useCallback, useState } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { Database, File, AlertCircle, Loader2, CheckCircle, FolderOpen, FileText, Settings, ArrowRight, Clock, BarChart3 } from 'lucide-react';
import '../styles/DashboardStyle.scss';
import { UseDatabaseDetector } from '../hooks/useDatabaseDetector';

const Dashboard: React.FC = React.memo(() => {
    const [dbUploaded, setDbUploaded] = useState<boolean>(false);
    const { detect, currentDetection, isDetecting, error } = UseDatabaseDetector();

    const handleFileSelect = useCallback(async () => {
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

            if (!selected || typeof selected !== 'string') {
                return; // User cancelled
            }

            const result = await detect(selected);

            // Handle case where detect returned null (invalid filePath)
            if (!result) {
                alert('Unable to process the selected file. Please ensure it\'s a valid database file with proper permissions.');
                return;
            }

            if (result.status === 'unencrypted') {
                setDbUploaded(true);
            } else if (result.status === 'encrypted') {
                alert('This database appears to be encrypted. Please contact support for encrypted database support.');
            } else if (result.status === 'error') {
                alert(`Error detecting database: ${result.error}`);
            } else {
                alert('Unable to load the file as database. Make sure you\'re providing a valid database file.');
            }
        } catch (error: unknown) {
            console.error('File selection failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(`Failed to open file dialog: ${errorMessage}`);
        }
    }, [detect]);

    const recentDatabases = [
        { name: 'sample.db', path: '/path/to/sample.db', lastUsed: '2 hours ago' },
        { name: 'ecommerce.db', path: '/path/to/ecommerce.db', lastUsed: '1 day ago' },
        { name: 'analytics.db', path: '/path/to/analytics.db', lastUsed: '3 days ago' },
        { name: 'inventory.db', path: '/path/to/inventory.db', lastUsed: '1 week ago' },
    ];

    const goToWorkspace = () => {
        // Navigate to workspace - in a real app this would use routing
        window.location.href = '#/workspace';
    };

    return (
        <div className="database-dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="brand">
                        <Database size={28} className="brand-icon" />
                        <div>
                            <h1>Database Dashboard</h1>
                            <p>Database connection and management</p>
                        </div>
                    </div>
                    <div className="header-stats">
                        <div className="stat-item">
                            <BarChart3 size={16} />
                            <span>{recentDatabases.length} databases tracked</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="dashboard-content">
                {!dbUploaded ? (
                    <>
                        {/* Database Selection */}
                        <div className="selection-section">
                            <div className="selection-card">
                                <div className="card-icon">
                                    <Database size={48} />
                                </div>
                                <h2>Get Started with Database Visualization</h2>
                                <p>Select a SQLite database file to begin exploring tables, running queries, and analyzing data.</p>

                                <div className="file-selection">
                                    <button
                                        onClick={handleFileSelect}
                                        disabled={isDetecting}
                                        className="primary-action"
                                    >
                                        {isDetecting ? (
                                            <>
                                                <Loader2 size={20} className="spinner" />
                                                Analyzing Database...
                                            </>
                                        ) : (
                                            <>
                                                <FolderOpen size={20} />
                                                Select Database File
                                            </>
                                        )}
                                    </button>

                                    <div className="supported-formats">
                                        <span>Supported formats: .db, .sqlite, .sqlite3</span>
                                    </div>
                                </div>

                                {error && (
                                    <div className="error-banner">
                                        <AlertCircle size={16} />
                                        <span>{error}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Databases */}
                        <div className="recent-databases">
                            <div className="section-header">
                                <Clock size={20} />
                                <h3>Recent Databases</h3>
                            </div>

                            <div className="database-list">
                                {recentDatabases.map((db, index) => (
                                    <div key={index} className="database-item">
                                        <div className="db-preview">
                                            <FileText size={16} className="file-icon" />
                                            <div className="db-details">
                                                <div className="db-name">{db.name}</div>
                                                <div className="db-last-used">{db.lastUsed}</div>
                                            </div>
                                        </div>
                                        <button
                                            className="quick-load"
                                            onClick={() => alert(`Loading ${db.name} would require the actual file path`)}
                                            disabled={isDetecting}
                                        >
                                            Load
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Help Section */}
                        <div className="help-section">
                            <h3>Need Help Getting Started?</h3>
                            <div className="help-grid">
                                <div className="help-item">
                                    <div className="help-icon">📁</div>
                                    <h4>Database Files</h4>
                                    <p>Locate your .db or .sqlite files in your file system</p>
                                </div>
                                <div className="help-item">
                                    <div className="help-icon">🔒</div>
                                    <h4>Permissions</h4>
                                    <p>Ensure your database files have read permissions</p>
                                </div>
                                <div className="help-item">
                                    <div className="help-icon">⚡</div>
                                    <h4>Performance</h4>
                                    <p>Best with databases under 100MB for optimal performance</p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Database Connected State */}
                        <div className="connected-state">
                            <div className="success-banner">
                                <CheckCircle size={24} className="success-icon" />
                                <div>
                                    <h2>Database Successfully Connected</h2>
                                    <p>Your database is loaded and ready for exploration</p>
                                </div>
                            </div>

                            <div className="connection-info">
                                <div className="info-panel">
                                    <h3>Database Details</h3>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <label>Database File</label>
                                            <div className="file-name">
                                                <FileText size={14} />
                                                <span>{currentDetection?.filePath?.split('/').pop() || 'Unknown'}</span>
                                            </div>
                                        </div>
                                        <div className="info-item">
                                            <label>Connection Status</label>
                                            <div className="status-indicator connected">
                                                <div className="status-dot"></div>
                                                <span>Connected & Secure</span>
                                            </div>
                                        </div>
                                        <div className="info-item">
                                            <label>Type</label>
                                            <span>SQLite Database</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Last Verified</label>
                                            <span>{currentDetection?.lastChecked && new Date(currentDetection.lastChecked).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="quick-actions">
                                    <h3>Start Exploring</h3>
                                    <p>Choose how you'd like to begin working with your database:</p>

                                    <div className="action-buttons">
                                        <button className="primary-button" onClick={goToWorkspace}>
                                            <Database size={18} />
                                            Explore Tables
                                            <ArrowRight size={18} />
                                        </button>
                                        <button className="secondary-button" onClick={goToWorkspace}>
                                            <File size={18} />
                                            Run Queries
                                        </button>
                                        <button className="tertiary-button" onClick={goToWorkspace}>
                                            <BarChart3 size={18} />
                                            View Analytics
                                        </button>
                                    </div>

                                    <div className="manage-options">
                                        <button className="link-button" onClick={() => setDbUploaded(false)}>
                                            <Settings size={14} />
                                            Change Database
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
});

// Add display name for better debugging
Dashboard.displayName = 'Dashboard';
