import React, { useCallback, useState } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { Database, File, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import '../styles/DashboardStyle.css';
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

    return (
        <div className='container'>
            <header className='header'>
              <h1 className='title'>DB SPYER — DASHBOARD</h1>
              <p className='title-desc'>Visualize your database and run simple query on it!</p>
            </header>

            <main className="main-content">
                {!dbUploaded ? (
                    <div className="upload-section">
                        <div className="upload-card">
                            <Database size={48} className="upload-icon" />
                            <h2>Select Your Database</h2>
                            <p>Choose a SQLite database file (.db, .sqlite, .sqlite3) to explore and visualize</p>

                            <button
                                onClick={handleFileSelect}
                                disabled={isDetecting}
                                className="select-file-btn"
                            >
                                {isDetecting ? (
                                    <>
                                        <Loader2 size={20} className="spinner" />
                                        Analyzing database...
                                    </>
                                ) : (
                                    <>
                                        <File size={20} />
                                        Select Database File
                                    </>
                                )}
                            </button>

                            {error && (
                                <div className="error-message">
                                    <AlertCircle size={16} />
                                    <span>Error: {error}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="dashboard-content">
                        <div className="success-card">
                            <CheckCircle size={48} className="success-icon" />
                            <h2>Database Loaded Successfully!</h2>
                            <div className="database-info">
                                <p><strong>File:</strong> {currentDetection?.filePath}</p>
                                <p><strong>Status:</strong> {currentDetection?.status === 'unencrypted' ? 'Ready for visualization' : currentDetection?.status}</p>
                                <p><strong>Last checked:</strong> {currentDetection?.lastChecked && new Date(currentDetection.lastChecked).toLocaleString()}</p>
                            </div>

                            {/* TODO: visualized database component:: should be in an other tab */}
                            <div className="placeholder-content">
                                <p>Your database visualization will appear here.</p>
                                <button className="action-btn">Start Exploring</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
});

// Add display name for better debugging
Dashboard.displayName = 'Dashboard';

export default Dashboard;
