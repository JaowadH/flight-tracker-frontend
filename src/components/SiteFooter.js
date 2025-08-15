import {NavLink} from 'react-router-dom';

export default function SiteFooter(){
    return(
        <footer className="site-footer">
            <div className="footer-inner">
                <section className="footer-card">
                    <h3 className="footer-title">About</h3>
                    <p className="footer-text">
                        CCJ Flight Tracker is a simple dashboard for browsing airports, aircraft, and passengers.
                    </p>
                </section>

                <section className="footer-card">
                    <h3 className="footer-title">Quick links</h3>
                    <div className="footer-actions">
                        <NavLink to="/airports" className="btn btn-outline-primary">Airports</NavLink>
                        <NavLink to="/aircraft" className="btn btn-outline-primary">Aircraft</NavLink>
                        <NavLink to="/passengers" className="btn btn-outline-primary">Passengers</NavLink>
                    </div>
                </section>

                <section className="footer-card">
                    <h3 className="footer-title">The Coding Crew</h3>
                    <p className="footer-text">Cody Collins, Colin Yetman, Jaowad Hossain</p>

                </section>
            </div>
        </footer>
    );
}
