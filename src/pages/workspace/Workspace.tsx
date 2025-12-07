import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FileSearch, Table, BarChart3, Database, ChevronRight, Plus, Settings, FolderOpen } from 'lucide-react';
import './Workspace.css';

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const tabs: TabItem[] = [
  {
    id: 'explorer',
    label: 'Tables',
    icon: <Table className="tab-icon" />,
    path: '/workspace',
  },
  {
    id: 'query',
    label: 'Query',
    icon: <FileSearch className="tab-icon" />,
    path: '/workspace/query',
  },
  {
    id: 'stats',
    label: 'Stats',
    icon: <BarChart3 className="tab-icon" />,
    path: '/workspace/stats',
  },
];

interface DatabaseConnection {
  id: string;
  name: string;
  type: 'sqlite' | 'postgres' | 'mysql';
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
}

const Workspace: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('explorer');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [databases, setDatabases] = useState<DatabaseConnection[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null);

  // Determine active tab from current route
  useEffect(() => {
    const currentPath = location.pathname;
    const active = tabs.find(tab => tab.path === currentPath);
    if (active) {
      setActiveTab(active.id);
    }
  }, [location.pathname]);

  const handleTabChange = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      navigate(tab.path);
    }
  };

  const handleDatabaseSelect = (dbId: string) => {
    setSelectedDatabase(dbId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return '#10b981';
      case 'connecting': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="workspace">
      {/* Header */}
      <header className="workspace-header">
        <div className="workspace-info">
          <Database size={24} className="header-icon" />
          <div>
            <h1 className="title">Database Explorer</h1>
            <p className="title-desc">Professional Database GUI</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="header-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <button className="action-btn" title="Settings">
            <Settings size={18} />
          </button>
          <button className="action-btn primary" title="Add Database">
            <Plus size={18} />
          </button>
        </div>
      </header>

      <div className="workspace-main">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-content">
            {/* Databases Section */}
            <div className="sidebar-section">
              <div className="section-header">
                <button
                  className="collapse-btn"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                >
                  <ChevronRight size={16} className={sidebarCollapsed ? '' : 'rotated'} />
                </button>
                {!sidebarCollapsed && <h3>Databases</h3>}
              </div>

              {!sidebarCollapsed && (
                <div className="databases-list">
                  {databases.length === 0 ? (
                    <div className="empty-state">
                      <FolderOpen size={32} />
                      <p>No databases connected</p>
                      <button className="add-db-btn">
                        <Plus size={14} />
                        Add Database
                      </button>
                    </div>
                  ) : (
                    databases.map(db => (
                      <div
                        key={db.id}
                        className={`db-item ${selectedDatabase === db.id ? 'active' : ''}`}
                        onClick={() => handleDatabaseSelect(db.id)}
                      >
                        <div className="db-icon">
                          <Database size={16} />
                        </div>
                        <div className="db-info">
                          <div className="db-name">{db.name}</div>
                          <div className="db-status">
                            <span
                              className="status-dot"
                              style={{ backgroundColor: getStatusColor(db.status) }}
                            />
                            {db.status}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default React.memo(Workspace);
