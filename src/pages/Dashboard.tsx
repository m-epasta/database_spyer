import React, { useCallback, useState } from 'react';
import FileUploadDropzone from '../components/DropzoneComponent';
import '../styles/DashboardStyle.css';
import { invoke } from '@tauri-apps/api/core';

const Dashboard: React.FC = () => {
    const [dbUploaded, setDbUploaded] = useState<boolean>(false);

    const handleSelectedFiles = (files: File[]) => {
        console.log(`Files selected ${files}`);
        // handle file logic there; maybe just in an api/ file
        
        if (files.length > 0) {
            setDbUploaded(true);
        }
    };

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
                        <FileUploadDropzone
                            onFilesSelected={handleSelectedFiles}
                            acceptedFileTypes=".db,.sqlite,.csv,.json"
                            maxFiles={1}
                        />
                    </div>
                ) : (
                    <div className="dashboard-content">
                        <h2>Database Loaded Successfully!</h2>
                        <p>Your database visualization will appear here.</p>
                        {/* Add database visualization components here */}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
