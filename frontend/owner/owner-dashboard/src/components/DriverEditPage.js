import { useEffect, useState } from 'react';

function DriverEditPage({ driver, buses, onBack, onSave }) {
  const isNewDriver = !driver;

  const [formState, setFormState] = useState(() => ({
    name: driver?.name || '',
    contactNo: driver?.contactNo || '',
    email: driver?.email || '',
    licenceNo: driver?.licenceNo || '',
    password: driver?.password || '',
    assignedBusNo: driver?.assignedBusNo || '',
    totalDrivingHours: driver?.totalDrivingHours || '',
    driverId: driver?.driverId || '',
  }));

  useEffect(() => {
    setFormState({
      name: driver?.name || '',
      contactNo: driver?.contactNo || '',
      email: driver?.email || '',
      licenceNo: driver?.licenceNo || '',
      password: driver?.password || '',
      assignedBusNo: driver?.assignedBusNo || '',
      totalDrivingHours: driver?.totalDrivingHours || '',
      driverId: driver?.driverId || '',
    });
  }, [driver]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((currentState) => ({
      ...currentState,
      [name]: value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    onSave({
      ...driver,
      name: formState.name,
      contactNo: formState.contactNo,
      email: formState.email,
      licenceNo: formState.licenceNo,
      password: formState.password,
      assignedBusNo: formState.assignedBusNo,
      totalDrivingHours: formState.totalDrivingHours,
      driverId: formState.driverId,
    });
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
            Contact No
            <input name="contactNo" value={formState.contactNo} onChange={handleChange} />
          </label>

          <label>
            Email
            <input name="email" type="email" value={formState.email} onChange={handleChange} />
          </label>

          <label>
            Licence No.
            <input name="licenceNo" value={formState.licenceNo} onChange={handleChange} />
          </label>

          {isNewDriver && (
            <label>
              Password
              <input name="password" type="password" value={formState.password} onChange={handleChange} />
            </label>
          )}

          {!isNewDriver && (
            <>
              <label>
                Driver ID
                <input name="driverId" value={formState.driverId} disabled />
              </label>

              <label>
                Assigned Bus No.
                <input name="assignedBusNo" value={formState.assignedBusNo} disabled />
              </label>
            </>
          )}


        </div>
      </div>

      {!isNewDriver && (
        <div className="driver-stats-card panel">
          <div className="driver-stats-grid">
            <div>
              <span>Total Driving Hours</span>
              <strong>{formState.totalDrivingHours}</strong>
            </div>
          </div>
        </div>
      )}

      {!isNewDriver && (
        <div className="driver-payment-card panel">
          <div className="edit-actions driver-actions">
            <button type="button" className="back-button" onClick={onBack}>
              Back
            </button>
            <button type="button" className="action-button save-button" onClick={handleSave}>
              Save Details
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