import React from 'react';
import busImage from './bus.png';

const UpdatePassword = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit Update Password");
  };

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'space-around', fontFamily: 'Arial, sans-serif', padding: '0 50px' }}>
      
      {/* Left Side - Bus Image */}
      <img src={busImage} alt="Bus" style={{ width: '45%', maxHeight: '500px', objectFit: 'contain' }} />

      {/* Right Side - Form Fields */}
      <form onSubmit={handleSubmit} style={{ width: '35%', textAlign: 'left' }}>
        {/* Title is now centered relative to the form width */}
        <h1 style={{ fontSize: '48px', marginBottom: '40px', fontWeight: '500', textAlign: 'center' }}>Update Password</h1>
        
        <label style={styles.label}>New Password</label>
        <input type="password" placeholder="New Password" style={styles.input} />

        <label style={styles.label}>Confirm Password</label>
        <input type="password" placeholder="Confirm Password" style={styles.input} />

        <button type="submit" style={styles.button}>Enter</button>
      </form>

    </div>
  );
};

const styles = {
  label: { fontSize: '14px', color: '#333', display: 'block', marginTop: '15px' },
  input: { width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #4CAF50', borderRadius: '4px', outline: 'none', boxSizing: 'border-box' },
  button: { padding: '8px 35px', backgroundColor: 'white', border: '1px solid #4CAF50', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '30px' }
};

export default UpdatePassword;