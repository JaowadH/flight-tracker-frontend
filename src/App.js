import {BrowserRouter as Router,Routes,Route,NavLink} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AirportsPage from './pages/AirportsPage';
import AircraftPage from './pages/AircraftPage';
import PassengersPage from './pages/PassengersPage';
import FlightsPage from './pages/FlightsPage';
import AdminPage from './pages/AdminPage';
import airplaneIcon from './assets/airplane-icon.png';
import SiteFooter from './components/SiteFooter';
import './App.css';
import './styles/Table.css';

export default function App(){
    return(
        <Router>
            <div className="app-shell">
                <nav className="navbar">
                    <div className="nav-left">
                        <img src={airplaneIcon} alt="Flight Tracker" className="brand-logo"/>
                        <span className="brand">CCJ Flight Tracker</span>
                    </div>

                    <ul className="nav-center">
                        <li><NavLink to="/" end className="nav-link">Home</NavLink></li>
                        <li><NavLink to="/airports" className="nav-link">Airports</NavLink></li>
                        <li><NavLink to="/aircraft" className="nav-link">Aircraft</NavLink></li>
                        <li><NavLink to="/passengers" className="nav-link">Passengers</NavLink></li>
                        <li><NavLink to="/flights" className="nav-link">Flights</NavLink></li>
                    </ul>

                    <div className="nav-right">
                        <NavLink to="/admin" className="nav-link">Admin</NavLink>
                    </div>
                </nav>

                <Routes>
                    <Route path="/" element={<LandingPage/>}/>
                    <Route path="/airports" element={<AirportsPage/>}/>
                    <Route path="/aircraft" element={<AircraftPage/>}/>
                    <Route path="/passengers" element={<PassengersPage/>}/>
                    <Route path="/flights" element={<FlightsPage/>}/>
                    <Route path="/admin" element={<AdminPage/>}/>
                </Routes>

                <SiteFooter/>
            </div>
        </Router>
    );
}
