import './Table.css';

function Table({title, cities}) {
    return (
        <div className="table-shell">
            <div className="table-card">
                <div className="table-card__title">{title}</div>
                <div className="table-wrap">
                    <table className="table-darkish">
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cities.length > 0 ? (
                            cities.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.id}</td>
                                    <td>{c.name}</td>
                                </tr>
                            ))
                        ) : (
                            <tr className="table-empty">
                                <td colSpan={2}>No data</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Table;
