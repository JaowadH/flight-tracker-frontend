import {useEffect,useState} from 'react';
import Api from '../api/ApiClient';
import '../styles/Table.css';

export default function AirportsPage(){
    const [rows,setRows]=useState([]); const [err,setErr]=useState(null);
    useEffect(()=>{Api.getAirports().then(setRows).catch(e=>setErr(e.message));},[]);
    return(
        <div className="page">
            <div className="table-shell">
                <div className="table-card">
                    <div className="table-card__title">Airports</div>
                    <div className="table-wrap">
                        <table className="table-darkish">
                            <thead>
                            <tr><th>Id</th><th>Name</th><th>Port</th></tr>
                            </thead>
                            <tbody>
                            {err&&<tr className="table-empty"><td colSpan="3">{err}</td></tr>}
                            {!err&&rows.map(r=>(<tr key={r.id}>
                                <td>{r.id}</td><td>{r.name}</td><td>{r.portId}</td>
                            </tr>))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
