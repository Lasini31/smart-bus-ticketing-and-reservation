import React from 'react';
import busImage from './bus.png';

const ForgetPassword = () => {
  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'space-around', fontFamily: 'Arial, sans-serif', padding: '0 50px' }}>
      
      {/* Left Side - Bus Image */}
      <img src={busImage} alt="Bus" style={{ width: '45%', maxHeight: '500px', objectFit: 'contain' }} />

      {/* Right Side - Form Fields */}
      <form style={{ width: '35%', textAlign: 'left' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '40px', fontWeight: '500', textAlign: 'center' }}>Forget Password</h1>
        
        <label style={{ fontSize: '14px', color: '#333', display: 'block', marginTop: '15px' }}>Email</label>
        <input type="email" placeholder="Email" style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #4CAF50', borderRadius: '4px', outline: 'none', boxSizing: 'border-box' }} />

        <label style={{ fontSize: '14px', color: '#333', display: 'block', marginTop: '15px' }}>Code</label>
        <input type="text" placeholder="Code" style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #4CAF50', borderRadius: '4px', outline: 'none', boxSizing: 'border-box' }} />

        <a href="#" style={{ fontSize: '12px', color: '#4CAF50', textDecoration: 'none', display: 'block', textAlign: 'right', margin: '10px 0 30px 0' }}>Didn't Receive the code?</a>

        <button type="submit" style={{ padding: '8px 35px', backgroundColor: 'white', border: '1px solid #4CAF50', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>Enter</button>
      </form>

    </div>
  );
};

export default ForgetPassword;