import React from 'react';
import './Table.css';

const Table = ({title, columns = [], rows = []}) => {
    const safe = v => (v === null || v === undefined || v === '' ? '—' : v);

    return (
        <div className="ft-shell">
            <div className="ft-card">
                <div className="ft-title">{title}</div>

                <div className="ft-sep" />

                <div className="ft-wrap">
                    <table className="ft-table">
                        <colgroup>
                            {columns.map(col => (
                                <col
                                    key={col.key}
                                    style={col.width ? {width: `${col.width}px`} : {}}
                                />
                            ))}
                        </colgroup>

                        <thead>
                        <tr>
                            {columns.map(col => (
                                <th key={col.key}>{col.label}</th>
                            ))}
                        </tr>
                        </thead>

                        <tbody>
                        {rows.length ? (
                            rows.map((r, i) => (
                                <tr key={r.id ?? i}>
                                    {columns.map(col => (
                                        <td key={col.key}>
                                            {safe(r[col.key])}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr className="ft-empty">
                                <td colSpan={columns.length}>No data</td>
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
