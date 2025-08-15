import {useEffect,useState} from 'react';
import Api from '../api/ApiClient';
import '../styles/Table.css';

export default function AircraftPage(){
    const [rows,setRows]=useState([]); const [err,setErr]=useState(null);
    useEffect(()=>{Api.getAircraft().then(setRows).catch(e=>setErr(e.message));},[]);
    return(
        <div className="page">
            <div className="table-shell">
                <div className="table-card">
                    <div className="table-card__title">Aircraft</div>
                    <div className="table-wrap">
                        <table className="table-darkish">
                            <thead>
                            <tr><th>Id</th><th>Type</th><th>Airline</th><th># Passengers</th></tr>
                            </thead>
                            <tbody>
                            {err&&<tr className="table-empty"><td colSpan="4">{err}</td></tr>}
                            {!err&&rows.map(r=>(<tr key={r.id}>
                                <td>{r.id}</td><td>{r.type}</td><td>{r.airlineName??'—'}</td><td>{r.numOfPassengers}</td>
                            </tr>))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
