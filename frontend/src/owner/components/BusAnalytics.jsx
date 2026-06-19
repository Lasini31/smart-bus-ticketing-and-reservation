function BusAnalytics({ rows, periodLabel, totalIncome }) {
  return (
    <section className="panel panel-large" id="analytics">
      <div className="panel-header">
        <h1>Analytics</h1>
        <button type="button" className="period-pill" aria-label={`Show analytics for ${periodLabel}`}>
          <span>{periodLabel}</span>
          <span className="chevron" aria-hidden="true">⌄</span>
        </button>
      </div>

      <div className="analytics-table" role="table" aria-label="Bus analytics">
        <div className="table-head" role="row">
          <span role="columnheader">Bus No.</span>
          <span role="columnheader">Route No.</span>
          <span role="columnheader">Target</span>
        </div>

        <div className="table-body">
          {rows.map((row) => (
            <div className="table-row" role="row" key={row.busNo}>
              <span className="cell bus-cell" role="cell">{row.busNo}</span>
              <span className="cell route-cell" role="cell">{row.routeNo}</span>
              <span className="cell target-cell" role="cell">
                <span className="progress-track" aria-hidden="true">
                  <span className="progress-fill" style={{ width: `${row.percentage}%` }} />
                </span>
                <strong className="percentage-label">{row.percentage}%</strong>
              </span>
            </div>
          ))}
        </div>

        <div className="income-row">
          <strong>Total Income</strong>
          <strong>{totalIncome}</strong>
        </div>
      </div>
    </section>
  );
}

export default BusAnalytics;
