import React from 'react';
import './Table.css';

const Table = ({cities}) => {
    const rows = Array.isArray(cities) ? cities : [];

    return (
        <div className="table-shell">
            <div className="table-card">
                <div className="table-card__title">Airports</div>
                <div className="table-wrap">
                    <table className="table table-darkish">
                        <thead>
                        <tr>
                            <th style={{width: 120}}>Id</th>
                            <th>Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.length > 0 ? (
                            rows.map((city, i) => (
                                <tr key={city.id ?? i}>
                                    <td>{city.id}</td>
                                    <td>{city.name}</td>
                                </tr>
                            ))
                        ) : (
                            <tr className="table-empty">
                                <td colSpan="2">No data</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Table;
