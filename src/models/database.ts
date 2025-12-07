// Frontend database type definitions
export interface ColumnInfo {
  name: string;
  data_type: string;
  nullable: boolean;
  primary_key: boolean;
  default_value?: string;
}

export interface TableInfo {
  name: string;
  columns: ColumnInfo[];
  row_count?: number;
}

// Database connection status
export interface DatabaseConnection {
  path: string;
  isConnected: boolean;
  lastChecked?: Date;
  tables?: string[];
}

// Query result types
export interface QueryResult {
  columns: string[];
  rows: (string | number | boolean | null)[][];
  executionTime: number;
}

export interface QueryError {
  message: string;
  code?: string;
  position?: number;
}

// Connection statistics
export interface ConnectionStats {
  totalConnections: number;
  successfulConnections: number;
  failedConnections: number;
  activeConnections: number;
  connectionHistory: ConnectionEvent[];
}

export interface ConnectionEvent {
  id: string;
  timestamp: Date;
  type: 'success' | 'failure' | 'active' | 'disconnected';
  databaseType?: string;
  connectionName?: string;
}
