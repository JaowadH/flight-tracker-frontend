import React, {Component} from 'react';
import './App.css';
import Table from './components/Table';
import airplaneIcon from './airplane-icon.png';
import ApiClient from './api/ApiClient';

class App extends Component {
  state = {
    activeTab: 'airports',
    cities: [],
    loading: true,
    error: null
  };

  componentDidMount() {
    this.loadCurrentTab().catch(console.error);
  }

  toRows = list => (Array.isArray(list) ? list : []).map((item, i) => ({
    id: item?.id ?? i,
    name: item?.name ?? 'Unknown'
  }));

  loadCurrentTab = async () => {
    const {activeTab} = this.state;
    this.setState({loading: true, error: null});

    try {
      let data;
      if (activeTab === 'airports') data = await ApiClient.getAllAirports();
      else if (activeTab === 'aircraft') data = await ApiClient.getAllAircraft();
      else data = await ApiClient.getAllPassengers();

      this.setState({cities: this.toRows(data)});
    } catch (err) {
      this.setState({error: err.message || 'Failed to load'});
    } finally {
      this.setState({loading: false});
    }
  };

  setTab = tab => {
    if (tab === this.state.activeTab) return;
    this.setState({activeTab: tab}, () => this.loadCurrentTab());
  };

  render() {
    const {activeTab, loading, error, cities} = this.state;

    const tabTitles = {
      airports: 'Airports',
      aircraft: 'Aircraft',
      passengers: 'Passengers'
    };

    return (
        <div className="App">
          <nav className="navbar navbar-dark px-3" style={{background: 'linear-gradient(180deg, var(--bg-elev-1), var(--bg-elev-2))'}}>
            <a className="navbar-brand d-flex align-items-center gap-2" href="./" onClick={e => e.preventDefault()}>
              <img src={airplaneIcon} alt="Airplane Icon" width={28} height={28}/>
              <span>Flight Tracker</span>
            </a>

            <div className="d-flex gap-2">
              <button
                  className={`btn ${activeTab==='airports' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => this.setTab('airports')}
              >
                Airports
              </button>
              <button
                  className={`btn ${activeTab==='aircraft' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => this.setTab('aircraft')}
              >
                Aircraft
              </button>
              <button
                  className={`btn ${activeTab==='passengers' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => this.setTab('passengers')}
              >
                Passengers
              </button>
            </div>
          </nav>

          {loading && <div className="p-3">Loading…</div>}
          {error && <div className="alert alert-danger m-3">{error}</div>}
          {!loading && !error && <Table title={tabTitles[activeTab]} cities={cities}/>}
        </div>
    );
  }
}

export default App;
