import React, { useCallback, useState } from 'react';
import FileUploadDropzone from '../components/DropzoneComponent';
import '../styles/DashboardStyle.css';
import { UseDatabaseDetector } from '../hooks/useDatabaseDetector';
import { invoke } from '@tauri-apps/api/core';

const Dashboard: React.FC = () => {
    const [dbUploaded, setDbUploaded] = useState<boolean>(false);
    const { detect, currentDetection, isDetecting, error } = UseDatabaseDetector();

    const handleSelectedFiles = useCallback(async (files: File[]) => {
        if (files.length === 0) return;

        console.log(`Files selected ${files}`);

        const file = files[0] as any;
        const result = await detect(file.path);

        if (result?.status === 'unencrypted') {
            setDbUploaded(true);
            console.log(`Unencrypted Database loaded successfully.`);
        } else if (result?.status === 'encrypted') {
            console.log('Encrypted database detected — need password');
            alert('This database appears to be encrypted. Please enter key secret to let the program be able to visualize the database');
        } else if (result?.status === 'error') {
            alert(`Error detecting database: ${result.error}`);
        } else {
            alert('Unable to load the file as database.Make sure providing a database file');
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
                        <h2>Upload Your Database</h2>
                        {isDetecting && (
                            <div className="loading-container">
                                <div className="loading-spinner"></div>
                                <span>Analyzing database...</span>
                            </div>
                        )}
                        {error && <p className="error">Error: {error}</p>}

                        <FileUploadDropzone
                            onFilesSelected={handleSelectedFiles}
                            acceptedFileTypes=".db,.sqlite,.csv,.json"
                            maxFiles={1}
                        />
                    </div>
                ) : (
                    <div className="dashboard-content">
                        <h2>Database Loaded Successfully!</h2>
                        {/* TODO: add a toggle to see std output of results */}
                        <p>Status: {currentDetection?.status}</p>
                        <p>File: {currentDetection?.filePath}</p>

                        {/* TODO: visualized database component */}
                        <p>Your database visualization will appear here.</p>
                        {/* Add database visualization components here */}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
