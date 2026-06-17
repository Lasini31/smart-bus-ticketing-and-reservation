import { useEffect, useMemo, useState } from 'react';

function DriverEditPage({ driver, buses, onBack, onSave, onPay }) {
  const initialHistory = useMemo(() => driver?.paymentHistory || [], [driver]);
  const isNewDriver = !driver;

  const [formState, setFormState] = useState(() => ({
    name: driver?.name || '',
    age: driver?.age || '',
    contactNo: driver?.contactNo || '',
    driverId: driver?.driverId || '',
    licenceNo: driver?.licenceNo || '',
    assignedBusNo: driver?.assignedBusNo || '',
    totalDrivingHours: driver?.totalDrivingHours || '',
    totalDistanceDriven: driver?.totalDistanceDriven || '',
    payableAmount: driver?.payableAmount ?? 0,
    paymentHistory: initialHistory,
  }));

  useEffect(() => {
    setFormState({
      name: driver?.name || '',
      age: driver?.age || '',
      contactNo: driver?.contactNo || '',
      driverId: driver?.driverId || '',
      licenceNo: driver?.licenceNo || '',
      assignedBusNo: driver?.assignedBusNo || '',
      totalDrivingHours: driver?.totalDrivingHours || '',
      totalDistanceDriven: driver?.totalDistanceDriven || '',
      payableAmount: driver?.payableAmount ?? 0,
      paymentHistory: driver?.paymentHistory || [],
    });
  }, [driver]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((currentState) => ({
      ...currentState,
      [name]: name === 'payableAmount' ? Number(value) : value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    onSave({
      ...driver,
      name: formState.name,
      age: formState.age,
      contactNo: formState.contactNo,
      driverId: formState.driverId,
      licenceNo: formState.licenceNo,
      assignedBusNo: formState.assignedBusNo,
      totalDrivingHours: formState.totalDrivingHours,
      totalDistanceDriven: formState.totalDistanceDriven,
      payableAmount: formState.payableAmount,
      paymentHistory: formState.paymentHistory,
      status: formState.payableAmount > 0 ? 'Due' : 'Paid',
    });
  };

  const canPay = formState.payableAmount > 0;

  const handlePay = () => {
    if (!canPay) {
      return;
    }

    onPay(formState.driverId, formState.payableAmount);
  };

  return (
    <section className="driver-edit-page">
      <div className="driver-summary-card panel">
        <div className="driver-summary-left">
          <img className="driver-avatar" src="/blank-profile-pic.jpg" alt={formState.name} />
          <div>
            <h1>{formState.name || 'New Driver'}</h1>
            <p>{isNewDriver ? 'Create a new driver' : `Driver ID: ${formState.driverId}`}</p>
          </div>
        </div>

        <div className="driver-summary-grid">
          <label>
            Driver Name
            <input name="name" value={formState.name} onChange={handleChange} />
          </label>

          <label>
            Age
            <input name="age" value={formState.age} onChange={handleChange} />
          </label>

          <label>
            Contact No
            <input name="contactNo" value={formState.contactNo} onChange={handleChange} />
          </label>

          <label>
            Driver ID
            <input name="driverId" value={formState.driverId} onChange={handleChange} />
          </label>

          <label>
            Licence No.
            <input name="licenceNo" value={formState.licenceNo} onChange={handleChange} />
          </label>

          <label>
            Assigned Bus No.
            <select name="assignedBusNo" value={formState.assignedBusNo} onChange={handleChange}>
              <option value="">Select bus</option>
              {buses.map((bus) => (
                <option key={bus.busNo} value={bus.busNo}>
                  {bus.busNo}
                </option>
              ))}
            </select>
          </label>

          <label>
            Total Payable
            <input
              name="payableAmount"
              type="number"
              min="0"
              value={formState.payableAmount}
              onChange={handleChange}
            />
          </label>
        </div>
      </div>

      <div className="driver-stats-card panel">
        <div className="driver-stats-grid">
          <div>
            <span>Total Driving Hours</span>
            <strong>{formState.totalDrivingHours}</strong>
          </div>
          <div>
            <span>Total Distance Driven</span>
            <strong>{formState.totalDistanceDriven}</strong>
          </div>
        </div>
      </div>

      {!isNewDriver && (
        <div className="driver-payment-card panel">
        <div className="payment-header">
          <h2>Payment Details</h2>
        </div>

        <div className="payment-panel-grid">
          <div className="payment-current-box">
            <div className="payment-current-title">Current Payable Amount</div>
            <div className="payment-current-amount">Rs.{Number(formState.payableAmount).toLocaleString()}/=</div>
            <button
              type="button"
              className="pay-button"
              onClick={handlePay}
              disabled={!canPay}
            >
              Pay
            </button>
          </div>

          <div className="payment-history-box">
            <h3>Payment History</h3>
            <div className="payment-history-table" role="table" aria-label="Driver payment history">
              <div className="payment-history-head" role="row">
                <span role="columnheader">Payment Date</span>
                <span role="columnheader">Payment Amount</span>
              </div>
              <div className="payment-history-body">
                {formState.paymentHistory.map((entry) => (
                  <div className="payment-history-row" role="row" key={`${entry.date}-${entry.amount}`}>
                    <span role="cell">{entry.date}</span>
                    <span role="cell">{entry.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="edit-actions driver-actions">
          <button type="button" className="back-button" onClick={onBack}>
            Back
          </button>
          <button type="button" className="action-button save-button" onClick={handleSave}>
            {isNewDriver ? 'Create Driver' : 'Save Details'}
          </button>
        </div>
        </div>
      )}

      {isNewDriver && (
        <div className="driver-payment-card panel">
          <div className="edit-actions driver-actions">
            <button type="button" className="back-button" onClick={onBack}>
              Back
            </button>
            <button type="button" className="action-button save-button" onClick={handleSave}>
              Create Driver
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default DriverEditPage;