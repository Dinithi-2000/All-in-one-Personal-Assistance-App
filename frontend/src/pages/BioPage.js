import React, { useState } from 'react';
import '../styles/Bio.css';

const BiologicalData = () => {
  const [bioData, setBioData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    bloodType: '',
    allergies: '',
    medicalConditions: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setBioData({ ...bioData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!bioData.age || !bioData.gender || !bioData.height || !bioData.weight || !bioData.bloodType) {
      setError('All required fields must be filled!');
      return;
    }

    console.log('✅ Biological Data Submitted:', bioData);
    setError('');
  };

  return (
    <div className="bio-container">
      <div className="bio-box">
        <h2>Biological Data</h2>
        <p>Provide your fitness data below</p>
        <form onSubmit={handleSubmit} className="bio-form">
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={bioData.age}
            onChange={handleChange}
            required
          />
          <select name="gender" value={bioData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            name="height"
            placeholder="Height (cm)"
            value={bioData.height}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="weight"
            placeholder="Weight (kg)"
            value={bioData.weight}
            onChange={handleChange}
            required
          />

          {/* ✅ Blood Type Drop-down */}
          <select name="bloodType" value={bioData.bloodType} onChange={handleChange} required>
            <option value="">Select Blood Type</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>

          <input
            type="text"
            name="allergies"
            placeholder="Allergies (if any)"
            value={bioData.allergies}
            onChange={handleChange}
          />
          <input
            type="text"
            name="medicalConditions"
            placeholder="Medical Conditions (if any)"
            value={bioData.medicalConditions}
            onChange={handleChange}
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="bio-button">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default BiologicalData;
