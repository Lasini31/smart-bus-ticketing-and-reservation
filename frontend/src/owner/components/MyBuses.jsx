function MyBuses({ buses, roots, onAddBus, onEditBus }) {
  const getRouteLabel = (routeId) => {
    return roots?.find((root) => root.routeID === routeId)?.rootName || 'Unknown Route';
  };

  return (
    <section className="panel panel-medium" id="buses">
      <div className="panel-header compact-header">
        <h2>My Buses</h2>
        <button type="button" className="action-button" onClick={onAddBus}>
          Add New Bus
        </button>
      </div>

      <div className="mini-table" role="table" aria-label="Registered buses">
        <div className="mini-table-head" role="row">
          <span role="columnheader">Bus No.</span>
          <span role="columnheader">Route No.</span>
          <span role="columnheader">Assigned Driv.</span>
          <span role="columnheader" className="ghost-cell">Settings</span>
        </div>

        <div className="mini-table-body">
          {buses.map((bus) => (
            <div className="mini-row bus-row" role="row" key={bus.busNo}>
              <span role="cell" className="bus-cell bus-number-cell">{bus.busNo}</span>
              <span role="cell" className="bus-cell route-number-cell">{getRouteLabel(bus.routeId)}</span>
              <span role="cell" className="assigned-driver-cell">{bus.assignedDriver}</span>
              <button type="button" className="settings-button bus-settings-button" aria-label={`Edit ${bus.busNo}`} onClick={() => onEditBus(bus.busNo)}>
                <img className="menu-icon" src="/Menu-Icon.png" alt="" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MyBuses;
