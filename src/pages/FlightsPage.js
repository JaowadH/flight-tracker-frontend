// src/pages/FlightsPage.js
import {useEffect,useState} from 'react';
import Api from '../api/ApiClient';
import '../styles/Table.css';

export default function FlightsPage(){
    const [rows,setRows]=useState([]); const [err,setErr]=useState(null);

    useEffect(()=>{
        Api.getFlights()
            .then(setRows)
            .catch(e=>setErr(e.message));
    },[]);

    const fmt=(v)=>v==null?'-':String(v);
    const fmtDT=(v)=>v?new Date(v).toLocaleString():'-';

    return(
        <div className="page">
            <div className="table-shell">
                <div className="table-card">
                    <div className="table-card__title">Flights</div>
                    <div className="table-wrap">
                        <table className="table-darkish">
                            <thead>
                            <tr>
                                <th>Id</th>
                                <th>Airline</th>
                                <th>Flight #</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Departs</th>
                                <th>Arrives</th>
                                <th>Status</th>
                                <th>Distance (km)</th>
                                <th>Duration (min)</th>
                            </tr>
                            </thead>
                            <tbody>
                            {err&&<tr className="table-empty"><td colSpan="10">{err}</td></tr>}
                            {!err&&rows.map(f=>(
                                <tr key={f.id}>
                                    <td>{fmt(f.id)}</td>
                                    <td>{fmt(f.airline)}</td>
                                    <td>{fmt(f.flightNumber)}</td>
                                    <td>{fmt(f.departureAirport?.name||f.departureAirport?.portId)}</td>
                                    <td>{fmt(f.arrivalAirport?.name||f.arrivalAirport?.portId)}</td>
                                    <td>{fmtDT(f.scheduledDeparture)}</td>
                                    <td>{fmtDT(f.scheduledArrival)}</td>
                                    <td>{fmt(f.status)}</td>
                                    <td>{fmt(f.distanceKm)}</td>
                                    <td>{fmt(f.durationMinutes)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
