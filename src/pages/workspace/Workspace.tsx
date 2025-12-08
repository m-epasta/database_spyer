import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FileSearch, Table, BarChart3, Database, Plus, Settings } from 'lucide-react';
import './Workspace.scss';

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

const Workspace: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('explorer');

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

  // Database state is managed through context in child components

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
        {/* Sidebar - Collapsed state for future use */}
          <div className="sidebar-content">
            <div className="sidebar-section">
              <span className="placeholder-text">DB Explorer</span>
            </div>
          </div>

        {/* Main Content */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default React.memo(Workspace);
