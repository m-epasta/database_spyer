import { useConnectionTracker } from '../hooks/loginTracker';
import '../styles/ConnectionsStatsStyle.css';

const ConnectionsStats = () => {
    const { stats, getRecentConnections, resetStats } = useConnectionTracker();
    const recentConnections = getRecentConnections(5);

    return (
        <div className='connections-stats'>
            <h3>Connections Statistics</h3>

            <div className='stats-grid'>
                <div className='stats-card'>
                    <h4>Total</h4>
                    <span className='stat-number'>{stats.totalConnections}</span>
                </div>
                <div className='stat-card'>
                    <h4>Success</h4>
                    <span className='stat-number'>{stats.successfulConnections}</span>
                </div>
                <div className='stat-card'>
                    <h4>Failed</h4>
                    <span className='stat-number'>{stats.failedConnections}</span>
                </div>
                <div className='stat-card'>
                    <h4>Active</h4>
                    <span className='stat-number'>{stats.activeConnections}</span>
                </div>
            </div>

            <div className='recent-connections'>
                <h4>Recent Connections</h4>
                {recentConnections.map(connection => (
                    <div key={connection.id} className={`connection-event ${connection.type}`}>
                        <span>{connection.timestamp.toLocaleTimeString()}</span>
                        <span>{connection.databaseType}</span>
                        <span className={`status ${connection.type}`}>{connection.type}</span>
                    </div>
                ))}
            </div>

            <button onClick={resetStats} className='reset-button'>
                Reset Statistics
            </button>
        </div>
    );
};

export default ConnectionsStats;