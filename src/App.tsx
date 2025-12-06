import { Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import Dashboard from './pages/Dashboard';
import ConnectionsStats from './pages/ConnectionsStats';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
    return (
        <ErrorBoundary>
            <div>
                <ScrollToTop />
                <ErrorBoundary>
                    <Routes>
                        <Route path='/' element={<WelcomePage/>}/>
                        <Route path='/dashboard' element={<Dashboard />}/>
                        <Route path='/ConnectionsStats' element={<ConnectionsStats />}/>
                    </Routes>
                </ErrorBoundary>
            </div>
        </ErrorBoundary>
    );
};

export default App;
