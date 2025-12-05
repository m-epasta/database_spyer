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
        const droppedFiles = Array.from(e.dataTransfer.files);

        // For single-file mode (maxFiles === 1), take only first file
        // For multi-file mode, slice to maxFiles
        const selectedFiles = maxFiles === 1 ? (droppedFiles[0] ? [droppedFiles[0]] : [])
                                      : droppedFiles.slice(0, maxFiles);

        if (selectedFiles.length > 0) {
            setFiles(selectedFiles);
            onFilesSelected(selectedFiles);
        }
    }, [maxFiles, onFilesSelected]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);

        // For single-file mode, take only first file
        const finalFiles = maxFiles === 1 ? (selectedFiles[0] ? [selectedFiles[0]] : [])
                                   : selectedFiles.slice(0, maxFiles);

        if (finalFiles.length > 0) {
            setFiles(finalFiles);
            onFilesSelected(finalFiles);
        }
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
          multiple={maxFiles > 1}  // Only allow multiple when actually needed
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
              {maxFiles > 1 && (  // Only show remove button when multiple files are allowed
                <button onClick={() => removeFile(index)} className="remove-btn">
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadDropzone;
