import {NavLink} from 'react-router-dom';
import airplaneIcon from '../assets/airplane-icon.png';
import '../styles/Landing.css';

export default function LandingPage(){
    return(
        <main className="landing">
            {/* HERO (full height) */}
            <section className="hero">
                <div className="hero-inner">
                    <div className="hero-badge">
                        <img src={airplaneIcon} alt="CCJ Flight Tracker" className="hero-logo"/>
                        <span>CCJ Flight Tracker</span>
                    </div>

                    <h1 className="hero-title">Track, Browse, Manage</h1>
                    <p className="hero-sub">
                        Explore airports, aircraft, and passengers.
                        Admins can add or remove data in seconds.
                    </p>

                    <div className="cta-row">
                        <NavLink to="/airports" className="btn btn-primary">Browse Airports</NavLink>
                        <NavLink to="/admin" className="btn btn-outline-primary">Open Admin</NavLink>
                    </div>

                    {/* KPIs (visual only, can be wired later) */}
                    <div className="kpis">
                        <div className="kpi">
                            <div className="kpi-num">20</div>
                            <div className="kpi-label">Airports</div>
                        </div>
                        <div className="kpi">
                            <div className="kpi-num">10</div>
                            <div className="kpi-label">Aircraft</div>
                        </div>
                        <div className="kpi">
                            <div className="kpi-num">20</div>
                            <div className="kpi-label">Passengers</div>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}
