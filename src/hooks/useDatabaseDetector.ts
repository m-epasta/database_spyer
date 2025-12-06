import { useState, useCallback, useMemo } from 'react';
import { readFile } from '@tauri-apps/plugin-fs';
import { invoke } from '@tauri-apps/api/core';

export type DatabaseStatus = 'unencrypted' | 'encrypted' | 'unknown' | 'detecting' | 'error';

// Cache for detection results to avoid redundant checks
const detectionCache = new Map<string, { status: DatabaseStatus; timestamp: number }>();
const CACHE_TTL = 30000; // 30 seconds TTL

interface DetectionResult {
    status: DatabaseStatus;
    filePath: string;
    lastChecked: Date;
    error?: string;
}

interface UseDatabaseDetectorReturn {
    // eslint-disable-next-line no-unused-vars
    detect: (path: string) => Promise<DetectionResult | null>;
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

    // Clear expired cache entries periodically
    useMemo(() => {
        const cleanupInterval = setInterval(() => {
            const now = Date.now();
            for (const [key, value] of detectionCache.entries()) {
                if (now - value.timestamp > CACHE_TTL) {
                    detectionCache.delete(key);
                }
            }
        }, CACHE_TTL);

        return () => clearInterval(cleanupInterval);
    }, []);
    
    // Memoized header patterns for better performance
    const SQLITE_MAGIC = useMemo(() => new Uint8Array([
        0x53, 0x51, 0x4C, 0x69, 0x74, 0x65, 0x20, 0x66, 0x6F, 0x72, 0x6D, 0x61, 0x74, 0x20, 0x33, 0x00,
    ]), []);

    const detectEncryption = useCallback(async (filePath: string, signal?: AbortSignal): Promise<DatabaseStatus> => {
        // Check cache first
        const cached = detectionCache.get(filePath);
        if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
            return cached.status;
        }

        try {
            // Use AbortController for cancellable operations
            if (signal?.aborted) {
                throw new Error('Detection cancelled');
            }

            // Read only first 64 bytes for efficiency (header + some data)
            const bytes = await readFile(filePath);

            // Check for aborted operation
            if (signal?.aborted) {
                throw new Error('Detection cancelled');
            }

            const header = bytes.slice(0, 16);

            // Compare with memoized pattern
            const isNormalSQLite = header.every((byte, i) => byte === SQLITE_MAGIC[i]);

            if (isNormalSQLite) {
                try {
                    if (signal?.aborted) {
                        throw new Error('Detection cancelled');
                    }

                    const probeResult = await invoke<{ canOpen: boolean }>('test_database_connection', {
                        path: filePath,
                    });

                    const status = probeResult.canOpen ? 'unencrypted' : 'encrypted';

                    // Cache result
                    detectionCache.set(filePath, { status, timestamp: Date.now() });
                    return status;

                } catch {
                    // If connection test fails, assume encrypted
                    const status: DatabaseStatus = 'encrypted';
                    detectionCache.set(filePath, { status, timestamp: Date.now() });
                    return status;
                }
            }

            // Check for SQLCipher signature
            if (header[0] === 0x17 && header[1] === 0x07 &&
                header[2] === 0x17 && header[3] === 0x07) {
                    const status: DatabaseStatus = 'encrypted';
                    detectionCache.set(filePath, { status, timestamp: Date.now() });
                    return status;
                }

            // Check salt area (SQLCipher stores salt info)
            const saltArea = header.slice(4, 16);
            if (saltArea.some(byte => byte !== 0)) {
                const status: DatabaseStatus = 'encrypted';
                detectionCache.set(filePath, { status, timestamp: Date.now() });
                return status;
            }

            // Check for encrypted-looking binary data (entropy analysis)
            if (bytes.length > 32) {
                const entropyArea = bytes.slice(16, 48);
                const highEntropyCount = entropyArea.reduce((count, byte) => {
                    // Count bytes with high entropy (random-like distribution)
                    return count + ((byte > 0x80 || byte < 0x20) ? 1 : 0);
                }, 0);

                if (highEntropyCount > 20) {
                    const status: DatabaseStatus = 'encrypted';
                    detectionCache.set(filePath, { status, timestamp: Date.now() });
                    return status;
                }
            }

            const status: DatabaseStatus = 'unknown';
            detectionCache.set(filePath, { status, timestamp: Date.now() });
            return status;

        } catch (error) {
            if (signal?.aborted) {
                throw new Error('Detection cancelled');
            }

            // Don't cache errors as they might be temporary
            throw new Error(`Detection failed: ${error}`);
        }
    }, [SQLITE_MAGIC]);

    const detect = useCallback(async (filePath: string): Promise<DetectionResult | null> => {
        if (!filePath) {return null;}

        setIsDetecting(true);
        setError(null);

        try {
            const status = await detectEncryption(filePath);

            const result: DetectionResult = {
                status,
                filePath,
                lastChecked: new Date(),
            };

            setCurrentDetection(result);
            return result;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown detection error';
            setError(errorMessage);

            const result: DetectionResult = {
                status: 'error',
                filePath,
                lastChecked: new Date(),
                error: errorMessage,
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
        retry,
    };
}
