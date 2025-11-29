import { Routes, Route, Link } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';

const App = () => {
    return (
        <div>
            {/* <nav>
                <Link to="/">Landing</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/connectionsStats">Stats</Link>
            </nav> */}

            <Routes>
                <Route path='/' element={<WelcomePage/>}/>
            </Routes>
        </div>
    );
}

export default App;