import { useEffect, useState } from 'react';

function BusEditPage({ bus, drivers, seatTemplates, onBack, onSave }) {
  const [formState, setFormState] = useState(() => ({
    busNo: bus?.busNo || '',
    routeNo: bus?.routeNo || '',
    assignedDriver: bus?.assignedDriver || '',
    targetIncome: bus?.targetIncome || 'Rs.350 000/=',
    seatCapacity: bus?.seatCapacity || '60 Seats',
    seatTemplate: bus?.seatTemplate || seatTemplates[0]?.value || '',
  }));

  useEffect(() => {
    setFormState({
      busNo: bus?.busNo || '',
      routeNo: bus?.routeNo || '',
      assignedDriver: bus?.assignedDriver || '',
      targetIncome: bus?.targetIncome || 'Rs.350 000/=',
      seatCapacity: bus?.seatCapacity || '60 Seats',
      seatTemplate: bus?.seatTemplate || seatTemplates[0]?.value || '',
    });
  }, [bus, seatTemplates]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((currentState) => ({
      ...currentState,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      busNo: formState.busNo,
      routeNo: formState.routeNo,
      assignedDriver: formState.assignedDriver,
      targetIncome: formState.targetIncome,
      seatCapacity: formState.seatCapacity,
      seatTemplate: formState.seatTemplate,
    });
  };

  return (
    <section className="bus-edit-page">
      <div className="bus-summary-card panel">
        <div className="bus-summary-left">
          <img className="bus-preview" src={formState.seatTemplate} alt="Bus preview" />
          <div>
            <h1>{formState.busNo || 'New Bus'}</h1>
            <p>Yutong Bus 2500YS</p>
          </div>
        </div>

        <div className="bus-summary-grid">
          <label>
            Bus No.
            <input name="busNo" value={formState.busNo} onChange={handleChange} />
          </label>

          <label>
            Assigned Driver
            <select name="assignedDriver" value={formState.assignedDriver} onChange={handleChange}>
              <option value="" disabled>
                Select driver
              </option>
              {drivers.map((driver) => (
                <option key={driver.driverId} value={driver.name}>
                  {driver.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Target Income
            <input name="targetIncome" value={formState.targetIncome} onChange={handleChange} />
          </label>

          <label>
            Route No.
            <input name="routeNo" value={formState.routeNo} onChange={handleChange} />
          </label>

          <label>
            Seat Capacity
            <input name="seatCapacity" value={formState.seatCapacity} onChange={handleChange} />
          </label>
        </div>
      </div>

      <div className="seat-template-card panel">
        <div className="seat-template-header">
          <h2>Seat Template</h2>
          <label className="template-select">
            <span>Customize Template</span>
            <select name="seatTemplate" value={formState.seatTemplate} onChange={handleChange}>
              {seatTemplates.map((template) => (
                <option key={template.value} value={template.value}>
                  {template.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="template-preview-wrap">
          <img className="template-preview" src={formState.seatTemplate} alt="Selected seat template" />
        </div>

        <div className="template-footer">
          <div>
            <span>Assigned Driver</span>
            <strong>{formState.assignedDriver}</strong>
          </div>
          <div>
            <span>Target Income</span>
            <strong>{formState.targetIncome}</strong>
          </div>
        </div>

        <div className="edit-actions">
          <button type="button" className="back-button" onClick={onBack}>
            Back
          </button>
          <button type="button" className="action-button save-button" onClick={handleSubmit}>
            Save Details
          </button>
        </div>
      </div>
    </section>
  );
}

export default BusEditPage;