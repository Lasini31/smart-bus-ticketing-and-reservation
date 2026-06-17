function MyDrivers({ drivers, onAddDriver, onEditDriver }) {
  return (
    <section className="panel panel-medium" id="drivers">
      <div className="panel-header compact-header">
        <h2>My Drivers</h2>
        <button type="button" className="action-button" onClick={onAddDriver}>
          Add New Driver
        </button>
      </div>

      <div className="mini-table" role="table" aria-label="Bus owner drivers">
        <div className="mini-table-head drivers-head" role="row">
          <span role="columnheader">Driver Name</span>
          <span role="columnheader" className="driver-id-head">Driver ID</span>
          <span role="columnheader" className="payment-status-head">Payment Stat</span>
          <span role="columnheader" className="ghost-cell">Settings</span>
        </div>

        <div className="mini-table-body drivers-body">
          {drivers.map((driver) => (
            <div className="mini-row driver-row" role="row" key={driver.driverId}>
              <span role="cell" className="driver-name-cell">{driver.name}</span>
              <span role="cell" className="driver-id-cell">{driver.driverId}</span>
              <span role="cell" className="payment-status-cell">
                <span className={`status-pill ${driver.status === 'Paid' ? 'status-paid' : 'status-due'}`}>
                  {driver.status}
                </span>
              </span>
              <button type="button" className="settings-button" aria-label={`Edit ${driver.name}`} onClick={() => onEditDriver(driver.driverId)}>
                <img className="menu-icon" src="/Menu-Icon.png" alt="" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MyDrivers;