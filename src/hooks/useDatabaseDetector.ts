import { useState, useCallback } from "react";
import { readFile } from "@tauri-apps/plugin-fs";
import { invoke } from "@tauri-apps/api/core";

export type DatabaseStatus = 'unencrypted' | 'encrypted' | 'unknown' | 'detecting' | 'error';

interface DetectionResult {
    status: DatabaseStatus;
    filePath: string;
    lastChecked: Date;
    error?: string;
}

interface UseDatabaseDetectorReturn {
    detect: (filePath: string) => Promise<DetectionResult | null>;
    currentDetection: DetectionResult | null;
    isDetecting: boolean;
    error: string | null;
    clearResult: () => void;
    retry: () => void;
}

export function UseDatabaseDetector(): UseDatabaseDetectorReturn {
    const [currentDetection, setCurrentDetection] = useState<DetectionResult | null>(null);
    const [isDetecting, setIsDetecting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const detectEncryption = useCallback(async (filePath: string): Promise<DatabaseStatus> => {
        try {   
            const bytes = await readFile(filePath);
            const header = bytes.slice(0, 16);

            const SQLITE_MAGIC = new Uint8Array([
                0x53, 0x51, 0x4C, 0x69, 0x74, 0x65, 0x20, 0x66, 0x6F, 0x72, 0x6D, 0x61, 0x74, 0x20, 0x33, 0x00
            ]);

            const isNormalSQLite = header.every((byte, i) => byte === SQLITE_MAGIC[i]);

            if (isNormalSQLite) {
                try {
                    const probeResult = await invoke<{ canOpen: boolean }>('test_database_connection', {
                        path: filePath
                    });
                    return probeResult.canOpen ? 'unencrypted' : 'encrypted';
                } catch {
                    return 'encrypted';
                }
            }

            if (header[0] === 0x17 && header[1] === 0x07 &&
                header[2] === 0x17 && header[3] === 0x07) {
                    return 'encrypted';
                }
            
            const saltArea = header.slice(4, 16);
            if (saltArea.some(byte => byte !== 0)) {
                return 'encrypted';
            }
            return 'unknown';
        } catch (error) {
            throw new Error(`Detection failed with error: ${error}`);
        }
    }, []);

    const detect = useCallback(async (filePath: string): Promise<DetectionResult | null> => {
        if (!filePath) return null;

        setIsDetecting(true);
        setError(null);

        try {
            const status = await detectEncryption(filePath);

            const result: DetectionResult = {
                status,
                filePath,
                lastChecked: new Date()
            };

            setCurrentDetection(result);
            return result;
        } catch (error: any) {
            const errorMessage = error.message || 'Unknown detection error';
            setError(errorMessage);

            const result: DetectionResult = {
                status: 'error',
                filePath,
                lastChecked: new Date(),
                error: errorMessage
            };
            setCurrentDetection(result);
            return result;
        } finally {
            setIsDetecting(false);
        }
    }, [detectEncryption]);

    const clearResult = useCallback(() => {
        setCurrentDetection(null);
        setError(null);
    }, []);

    const retry = useCallback(() => {
        if (currentDetection?.filePath) {
            detect(currentDetection.filePath);
        }
    }, [currentDetection?.filePath, detect]);

    return {
        detect,
        currentDetection,
        isDetecting,
        error,
        clearResult,
        retry
    };
}