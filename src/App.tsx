import { Routes, Route, Link } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';

const App = () => {
    return (
        <div>
            <nav>
                <Link to="/">Landing</Link>
                <Link to="/dashboard">Dashboard</Link>
            </nav>

            <Routes>
                <Route path='/' element={<WelcomePage/>}/>
            </Routes>
        </div>
    );
}

export default App;