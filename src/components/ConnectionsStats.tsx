import { useConnectionTracker } from '../hooks/loginTracker';
import '../styles/ConnectionsStatsStyle.css';

const ConnectionsStats = () => {
    const { stats, getRecentConnections, resetStats } = useConnectionTracker();
    const recentConnections = getRecentConnections(5);

    
}