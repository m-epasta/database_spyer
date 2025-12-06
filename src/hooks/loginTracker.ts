import { useState, useEffect, useCallback } from 'react';

interface ConnectionStats {
    totalConnections: number;
    successfulConnections: number;
    failedConnections: number;
    activeConnections: number;
    connectionHistory: ConnectionEvent[];
}

interface ConnectionEvent {
    id: string;
    timestamp: Date;
    type: 'success' | 'failure' | 'active' | 'disconnected';
    databaseType?: string;
    connectionName?: string;
}

export function useConnectionTracker() {
    const [stats, setStats] = useState<ConnectionStats>({
        totalConnections: 0,
        successfulConnections: 0,
        failedConnections: 0,
        activeConnections: 0,
        connectionHistory: [],
    });

    useEffect(() => {
        const savedStats = localStorage.getItem('connectionStats');
        if (savedStats) {
            try {
                const parsed = JSON.parse(savedStats);
                // convert timestamp back to Date Object
                const historyWithDate = (parsed.connectionHistory as Array<Omit<ConnectionEvent, 'timestamp'> & { timestamp: string }>).map((event) => ({
                    ...event,
                    timestamp: new Date(event.timestamp),
                }));
                // update state
                setStats({ ...parsed, connectionHistory: historyWithDate });
            } catch (error: unknown) {
                console.error('Failed to load connection stats:', error);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('connectionStats', JSON.stringify(stats));
    }, [stats]);

    // register success
    const registerSuccess = useCallback((databaseType?: string, connectionName?: string) => {
        setStats(prev => {
        const newEvent: ConnectionEvent = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
            type: 'success',
            databaseType,
            connectionName,
        };

        return {
            totalConnections: prev.totalConnections + 1,
            successfulConnections: prev.successfulConnections + 1,
            failedConnections: prev.failedConnections,
            activeConnections: prev.activeConnections + 1,
            connectionHistory: [newEvent, ...prev.connectionHistory].slice(0, 100), // Keep last 100 events
        };
        });
    }, []);

    // register failure 
    const registerFailure = useCallback((databaseType?: string, connectionName?: string) => {
        setStats(prev => {
        const newEvent: ConnectionEvent = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
            type: 'failure',
            databaseType,
            connectionName,
        };

        return {
            totalConnections: prev.totalConnections + 1,
            successfulConnections: prev.successfulConnections,
            failedConnections: prev.failedConnections + 1,
            activeConnections: prev.activeConnections,
            connectionHistory: [newEvent, ...prev.connectionHistory].slice(0, 100),
        };
        });
    }, []);

    // register logout
    const registerDisconnection = useCallback((databaseType?: string, connectionName?: string) => {
        setStats(prev => {
        const newEvent: ConnectionEvent = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
            type: 'disconnected',
            databaseType,
            connectionName,
        };

        return {
            ...prev,
            activeConnections: Math.max(0, prev.activeConnections - 1),
            connectionHistory: [newEvent, ...prev.connectionHistory].slice(0, 100),
        };
        });
    }, []);

    // reset (should not be called in prod)
    const resetStats = useCallback(() => {
        setStats({
        totalConnections: 0,
        successfulConnections: 0,
        failedConnections: 0,
        activeConnections: 0,
        connectionHistory: [],
        });
    }, []);

    // filter stats by db type
    const getStatsByDatabaseType = useCallback((databaseType: string) => {
        const filteredHistory = stats.connectionHistory.filter(
            event => event.databaseType === databaseType,
        );

        return {
            total: filteredHistory.length,
            successful: filteredHistory.filter(event => event.type === 'success').length,
            failed: filteredHistory.filter(event => event.type === 'failure').length,
            active: filteredHistory.filter(event => event.type === 'success').length - 
                    filteredHistory.filter(event => event.type === 'disconnected').length,
            };
    }, [stats.connectionHistory]);

    // get recent connections (last N)
    const getRecentConnections = useCallback((limit: number = 10) => {
        return stats.connectionHistory.slice(0, limit);        
    }, [stats.connectionHistory]);

    return {
        stats,
        registerSuccess,
        registerFailure,
        registerDisconnection,
        resetStats,
        getStatsByDatabaseType,
        getRecentConnections,
    };
}
