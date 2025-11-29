import { Routes, Route, Link } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import Dashboard from './pages/Dashboard';
import ConnectionsStats from './pages/ConnectionsStats';
import ScrollToTop from './components/ScrollToTop';

const App = () => {
    return (
        <div>
            {/* <nav>
                <Link to="/">Landing</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/connectionsStats">Stats</Link>
            </nav> */}

            <ScrollToTop />
            <Routes>
                <Route path='/' element={<WelcomePage/>}/>
                <Route path='/dashboard' element={<Dashboard />}/>
                <Route path='/ConnectionsStats' element={<ConnectionsStats />}/>
            </Routes>
        </div>
    );
}

export default App;
