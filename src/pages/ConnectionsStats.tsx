import { useConnectionTracker } from '../hooks/loginTracker';
import '../styles/ConnectionsStatsStyle.scss';
import { Activity, Database, AlertTriangle, CheckCircle, Clock, TrendingUp, User, Zap } from 'lucide-react';

const ConnectionsStats = () => {
    const { stats, getRecentConnections, resetStats } = useConnectionTracker();
    const recentConnections = getRecentConnections(5);

    const statusCards = [
        {
            title: 'Total Connections',
            value: stats.totalConnections,
            icon: <Database size={20} />,
            color: '#61dafb',
            bgColor: 'rgba(97, 218, 251, 0.1)',
            borderColor: 'rgba(97, 218, 251, 0.3)'
        },
        {
            title: 'Successful',
            value: stats.successfulConnections,
            icon: <CheckCircle size={20} />,
            color: '#10b981',
            bgColor: 'rgba(16, 185, 129, 0.1)',
            borderColor: 'rgba(16, 185, 129, 0.3)'
        },
        {
            title: 'Failed',
            value: stats.failedConnections,
            icon: <AlertTriangle size={20} />,
            color: '#ef4444',
            bgColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.3)'
        },
        {
            title: 'Active',
            value: stats.activeConnections,
            icon: <Zap size={20} />,
            color: '#f59e0b',
            bgColor: 'rgba(245, 158, 11, 0.1)',
            borderColor: 'rgba(245, 158, 11, 0.3)'
        }
    ];

    const getStatusColor = (type: string) => {
        switch (type) {
            case 'success': return '#10b981';
            case 'error': return '#ef4444';
            case 'warning': return '#f59e0b';
            default: return '#6b7280';
        }
    };

    const getStatusIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle size={16} />;
            case 'error': return <AlertTriangle size={16} />;
            case 'warning': return <Clock size={16} />;
            default: return <Activity size={16} />;
        }
    };

    return (
        <div className="terminal-monitoring">
            {/* Terminal Header */}
            <div className="terminal-header">
                <div className="terminal-window-controls">
                    <span className="window-control close"></span>
                    <span className="window-control minimize"></span>
                    <span className="window-control maximize"></span>
                </div>
                <div className="terminal-title">db-spyer ~ Connection Monitoring</div>
                <div className="terminal-status">
                    <div className="status-light"></div>
                    <span>Live</span>
                </div>
            </div>

            <div className="terminal-content">
                {/* Overview Header */}
                <div className="monitoring-header">
                    <div className="header-info">
                        <Activity size={24} className="header-icon" />
                        <div>
                            <h1>Connection Monitoring</h1>
                            <p>Real-time database connection statistics and health metrics</p>
                        </div>
                    </div>

                    <div className="connection-health">
                        <div className="health-indicator">
                            <div className="health-dot connected"></div>
                            <span>Service Healthy</span>
                        </div>
                        <span className="last-updated">Updated: {new Date().toLocaleTimeString()}</span>
                    </div>
                </div>

                {/* Terminal Prompt */}
                <div className="terminal-prompt">
                    <span className="prompt-symbol">$</span>
                    <span className="prompt-text">kubectl get connections --watch</span>
                    <div className="cursor">█</div>
                </div>

                {/* Stats Grid - Kubernetes Resource Cards */}
                <div className="stats-grid">
                    {statusCards.map((card, index) => (
                        <div key={index} className="metric-card">
                            <div className="metric-header">
                                <div className="metric-icon" style={{ color: card.color }}>
                                    {card.icon}
                                </div>
                                <div className="metric-title">{card.title}</div>
                            </div>

                            <div className="metric-value" style={{ color: card.color }}>
                                {card.value}
                            </div>

                            <div className="metric-footer">
                                <div className="status-bar">
                                    <div
                                        className="status-fill"
                                        style={{
                                            width: `${Math.min((card.value / Math.max(stats.totalConnections, 1)) * 100, 100)}%`,
                                            backgroundColor: card.color,
                                            opacity: 0.6
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Connections Timeline */}
                <div className="timeline-section">
                    <div className="timeline-header">
                        <h3>Connection Timeline</h3>
                        <div className="timeline-legend">
                            <div className="legend-item">
                                <div className="legend-dot success"></div>
                                <span>Success</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-dot error"></div>
                                <span>Failed</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-dot warning"></div>
                                <span>Pending</span>
                            </div>
                        </div>
                    </div>

                    <div className="timeline-container">
                        {/* Timeline visualization */}
                        <div className="timeline">
                            {recentConnections.length === 0 ? (
                                <div className="empty-timeline">
                                    <Database size={48} />
                                    <p>No recent connections to display</p>
                                    <span className="empty-hint">Connections will appear here when database operations occur</span>
                                </div>
                            ) : (
                                recentConnections.map((connection, index) => (
                                    <div key={connection.id} className="timeline-event">
                                        <div className="timeline-marker">
                                            <div
                                                className={`timeline-dot ${connection.type}`}
                                                style={{ backgroundColor: getStatusColor(connection.type) }}
                                            ></div>
                                            {index < recentConnections.length - 1 && <div className="timeline-line"></div>}
                                        </div>

                                        <div className="timeline-content">
                                            <div className="event-header">
                                                <div className="event-icon" style={{ color: getStatusColor(connection.type) }}>
                                                    {getStatusIcon(connection.type)}
                                                </div>
                                                <div className="event-meta">
                                                    <span className="event-time">{connection.timestamp.toLocaleString()}</span>
                                                    <span className={`event-type ${connection.type}`}>
                                                        {connection.type.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="event-details">
                                                <div className="event-info">
                                                    <span className="event-label">Database:</span>
                                                    <code className="event-value">{connection.databaseType}</code>
                                                </div>
                                                <div className="event-info">
                                                    <span className="event-label">Operation:</span>
                                                    <span className="event-value">Connection {connection.type}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions Panel */}
                <div className="actions-section">
                    <button className="action-btn primary" onClick={resetStats}>
                        <TrendingUp size={14} />
                        Reset Statistics
                    </button>
                    <button className="action-btn secondary">
                        <User size={14} />
                        Connection Logs
                    </button>
                    <button className="action-btn">
                        <Activity size={14} />
                        Performance Metrics
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConnectionsStats;
