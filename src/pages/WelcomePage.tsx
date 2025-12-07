import '../styles/WelcomePageStyle.scss';
import { useNavigate } from 'react-router-dom';
import { Database, Table, Search, BarChart3, Shield, ArrowRight } from 'lucide-react';

function App() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/workspace');
  };

  const features = [
    {
      icon: <Table size={24} />,
      title: 'Table Explorer',
      description: 'Browse and explore your database tables with structured data visualization',
      color: '#61dafb'
    },
    {
      icon: <Search size={24} />,
      title: 'SQL Query Builder',
      description: 'Build and execute SQL queries with interactive result display',
      color: '#10b981'
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Performance Analytics',
      description: 'Monitor database performance and view connection statistics',
      color: '#f59e0b'
    },
    {
      icon: <Shield size={24} />,
      title: 'Security First',
      description: 'Secure database connections with encrypted data handling',
      color: '#8b5cf6'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Connect Database',
      description: 'Select your database file to begin exploration'
    },
    {
      number: '2',
      title: 'Explore Tables',
      description: 'Browse table structures and relationships'
    },
    {
      number: '3',
      title: 'Run Queries',
      description: 'Execute SQL queries and analyze results'
    },
    {
      number: '4',
      title: 'Analyze Data',
      description: 'Use built-in tools for data analysis'
    }
  ];

  return (
    <div className="database-welcome">
      <div className="welcome-content">
        {/* Header */}
        <header className="welcome-header">
          <div className="header-content">
            <div className="logo-section">
              <Database size={32} className="app-logo" />
              <div>
                <h1 className="app-title">DB Visualizer</h1>
                <p className="app-subtitle">Database Explorer & SQL Query Tool</p>
              </div>
            </div>

            <div className="header-actions">
              <span className="version-badge">v1.0.0</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          {/* Hero Section */}
          <div className="hero-section">
            <div className="hero-content">
              <h2 className="hero-title">Explore Your Databases with Powerful Visualization</h2>
              <p className="hero-description">
                Connect to SQLite databases, explore table structures, run SQL queries,
                and analyze data with an intuitive, user-friendly interface designed for developers and analysts.
              </p>

              <div className="hero-actions">
                <button className="primary-cta" onClick={handleContinue}>
                  <Database size={18} />
                  Get Started
                  <ArrowRight size={18} />
                </button>
                <button className="secondary-cta">
                  <Search size={18} />
                  View Features
                </button>
              </div>
            </div>

            <div className="hero-visual">
              <div className="feature-card demo-card">
                <div className="card-header">
                  <Table size={20} />
                  <span>Tables</span>
                </div>
                <div className="card-content">
                  <div className="table-rows">
                    <div className="table-row">
                      <span className="row-label">users</span>
                      <span className="row-count">2,340 records</span>
                    </div>
                    <div className="table-row">
                      <span className="row-label">orders</span>
                      <span className="row-count">1,567 records</span>
                    </div>
                    <div className="table-row highlighted">
                      <span className="row-label">products</span>
                      <span className="row-count">892 records</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="features-section">
            <h3>Powerful Database Tools</h3>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div
                    className="feature-icon"
                    style={{ background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)` }}
                  >
                    {feature.icon}
                  </div>
                  <h4 className="feature-title">{feature.title}</h4>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Getting Started Steps */}
          <div className="steps-section">
            <h3>Getting Started</h3>
            <div className="steps-container">
              {steps.map((step, index) => (
                <div key={index} className="step-item">
                  <div className="step-number">{step.number}</div>
                  <div className="step-content">
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                  </div>
                  {index < steps.length - 1 && <div className="step-connector"></div>}
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="welcome-footer">
          <div className="footer-content">
            <div className="footer-info">
              <p>Built with modern web technologies for fast, secure database exploration.</p>
            </div>
            <div className="footer-links">
              <a href="#docs" className="footer-link">Documentation</a>
              <span className="link-separator">•</span>
              <a href="#support" className="footer-link">Support</a>
              <span className="link-separator">•</span>
              <a href="#github" className="footer-link">GitHub</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
