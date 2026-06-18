import { useEffect, useState } from 'react';

function BusEditPage({ bus, drivers, seatTemplates, onBack, onSave }) {
  const [formState, setFormState] = useState(() => ({
    busNo: bus?.busNo || '',
    type: bus?.type || seatTemplates[0]?.value || '',
    routeNo: bus?.routeNo || '',
    assignedDriver: bus?.assignedDriver || '',
    targetIncome: bus?.targetIncome || 'Rs.350 000/=',
  }));

  useEffect(() => {
    setFormState({
      busNo: bus?.busNo || '',
      type: bus?.type || seatTemplates[0]?.value || '',
      routeNo: bus?.routeNo || '',
      assignedDriver: bus?.assignedDriver || '',
      targetIncome: bus?.targetIncome || 'Rs.350 000/=',
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
      type: formState.type,
      routeNo: formState.routeNo,
      assignedDriver: formState.assignedDriver,
      targetIncome: formState.targetIncome,
    });
  };

  // Find the selected template to display seat arrangement
  const selectedTemplate = seatTemplates.find(t => t.value === formState.type);
  const seatTemplateImage = selectedTemplate?.value || '';

  return (
    <section className="bus-edit-page">
      <div className="bus-summary-card panel">
        <div className="bus-summary-left">
          <img className="bus-preview" src={seatTemplateImage} alt="Bus preview" />
          <div>
            <h1>{formState.busNo || 'New Bus'}</h1>
            <p>{selectedTemplate?.label || 'Select a bus type'}</p>
          </div>
        </div>

        <div className="bus-summary-grid">
          <label>
            Plate No
            <input name="busNo" value={formState.busNo} onChange={handleChange} />
          </label>

          <label>
            Type
            <select name="type" value={formState.type} onChange={handleChange}>
              {seatTemplates.map((template) => (
                <option key={template.value} value={template.value}>
                  {template.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Route No.
            <input name="routeNo" value={formState.routeNo} onChange={handleChange} />
          </label>

          <label>
            Target Income
            <input name="targetIncome" value={formState.targetIncome} onChange={handleChange} />
          </label>

          <label>
            Assigned Driver
            <select name="assignedDriver" value={formState.assignedDriver} onChange={handleChange}>
              <option value="">Select driver (optional)</option>
              {drivers.map((driver) => (
                <option key={driver.driverId} value={driver.name}>
                  {driver.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="seat-template-card panel">
        <div className="seat-template-header">
          <h2>Seating Arrangement</h2>
          <p>{selectedTemplate?.label || 'Select a bus type to view seating arrangement'}</p>
        </div>

        <div className="template-preview-wrap">
          <img className="template-preview" src={seatTemplateImage} alt="Seating arrangement" />
        </div>

        <div className="template-footer">
          <div>
            <span>Assigned Driver</span>
            <strong>{formState.assignedDriver || 'Not assigned'}</strong>
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