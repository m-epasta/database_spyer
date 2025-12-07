import { Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import Workspace from './pages/workspace/Workspace';
import TableExplorer from './pages/workspace/components/TableExplorer';
import QueryEditor from './pages/workspace/components/QueryEditor';
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
                        <Route path='/workspace' element={<Workspace />}>
                            <Route index element={<TableExplorer />} />
                            <Route path='query' element={<QueryEditor />} />
                            <Route path='stats' element={<ConnectionsStats />} />
                        </Route>
                    </Routes>
                </ErrorBoundary>
            </div>
        </ErrorBoundary>
    );
};

export default App;
