import React, { useCallback, useState } from 'react';
import { Upload, File, X } from 'lucide-react';

interface FileUploadDropzoneProps {
    onFilesSelected: (files: File[]) => void;
    acceptedFileTypes?: string;
    maxFiles?: number;
}

const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
    onFilesSelected,
    acceptedFileTypes = '*',
    maxFiles = 5,
}) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [files, setFiles] = useState<File[]>([]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const newFiles = Array.from(e.dataTransfer.files).slice(0, maxFiles);
        setFiles(newFiles);
        onFilesSelected(newFiles);
    }, [maxFiles, onFilesSelected]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []).slice(0, maxFiles);
        setFiles(newFiles);
        onFilesSelected(newFiles);
    }, [maxFiles, onFilesSelected]);

    const removeFile = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
        onFilesSelected(newFiles);
    };

    return (
    <div className="file-upload">
      <div
        className={`dropzone ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept={acceptedFileTypes}
          onChange={handleFileInput}
          style={{ display: 'none' }}
          id="file-input"
        />
        <label htmlFor="file-input" className="dropzone-label">
          <Upload size={32} />
          <span>Drop files here or click to browse</span>
        </label>
      </div>

      {files.length > 0 && (
        <div className="files-list">
          {files.map((file, index) => (
            <div key={index} className="file-item">
              <File size={16} />
              <span className="file-name">{file.name}</span>
              <button onClick={() => removeFile(index)} className="remove-btn">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadDropzone;