import '../styles/WelcomePageStyle.css';

function App() {

  const handleContinue = () => {
    
  }

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">DB Spyer</h1>
        <p className="titleDesc">Your complete database visualizer interface</p>
      </header>
      
      <main className="main-content">
        <div className="boxes-grid">
          <div className="feature-box">
            <div className="box-header">
              <div className="box-icon">⚡</div>
              <h3>Real-time Monitoring</h3>
            </div>
            <div className="box-content">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.</p>
            </div>
          </div>

          <div className="feature-box">
            <div className="box-header">
              <div className="box-icon">🔍</div>
              <h3>Query Analysis</h3>
            </div>
            <div className="box-content">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
          </div>

          <div className="feature-box">
            <div className="box-header">
              <div className="box-icon">📊</div>
              <h3>Performance Metrics</h3>
            </div>
            <div className="box-content">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="/help" className="footer-link">Help Center</a>
            <a href="/docs" className="footer-link">Documentation</a>
            <a href="/support" className="footer-link">Support</a>
            <a href="/contact" className="footer-link">Contact Us</a>
          </div>
          <button className="continue-button" onClick={handleContinue}>
            Continue
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;