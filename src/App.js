import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import icon from './airplane-icon.png';
import Table from './components/Table.js';
import ApiClient from './api/ApiClient';

class App extends Component {
  state = {
    cities: [],
    loading: true,
    error: null
  };

  async componentDidMount() {
    await this.loadAllAirports();
  }

  loadAllAirports = async () => {
    this.setState({loading: true, error: null});
    try {
      const airports = await ApiClient.getAllAirports();

      const cities = (Array.isArray(airports) ? airports : []).map((a, i) => ({
        id: a.id ?? a.airportId ?? a.code ?? i,
        name: a.name ?? 'Unknown'
      }));

      this.setState({cities});
    } catch (err) {
      console.error(err);
      this.setState({
        error: err.message || 'Failed to load airports',
      });
    } finally {
      this.setState({loading: false});
    }
  };

  render() {
    const {cities, loading, error} = this.state;

    return (
        <div className="App">
          <nav className="navbar navbar-light bg-light px-3">
            <a className="navbar-brand d-flex align-items-center gap-2" href="./" onClick={(e)=>e.preventDefault()}>

              <img src={icon} alt="Airplane" width={40} /> CCJ Flight Tracker
            </a>
            <button className="btn btn-outline-primary" onClick={this.loadAllAirports}>
              Refresh
            </button>
          </nav>

          {loading && <div className="p-3">Loading…</div>}
          {error && <div className="alert alert-danger m-3">{error}</div>}
          {!loading && !error && <Table cities={cities} />}
        </div>
    );
  }
}

export default App;
