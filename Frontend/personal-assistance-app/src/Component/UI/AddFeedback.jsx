import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/addFinance.css';

export default function AddFinancial() {
  const [imagePercent, setImagePercent] = useState(0);
  const fileRef1 = useRef(null);
  const [imageError, setImageError] = useState(false);
  const [image1, setImage1] = useState(undefined);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    userId: currentUser._id,
    name: "",
    u_email: "",
    category: "",
    reviews: "",
    selectraiting: "",
  });

  useEffect(() => {
    if (image1) {
      handleFileUpload(image1, 'profilePicture');
    }
  }, [image1]);

  const handleFileUpload = async (image, field) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
        setError('Image upload failed');
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({
            ...prev,
            [field]: downloadURL,
          }));
        });
      }
    );
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.u_email.trim()) errors.u_email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.u_email)) errors.u_email = 'Invalid email format';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.reviews.trim()) errors.reviews = 'Review is required';
    if (!formData.selectraiting) errors.selectraiting = 'Rating is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    try {
      const res = await fetch('/api/auth/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create item');
      }
      Swal.fire({ icon: "success", title: "Success", text: "Feedback submitted successfully!" });
      navigate('/itemprofile');
    } catch (error) {
      setError('Something went wrong!');
      Swal.fire({ icon: "error", title: "Error", text: error.message || "Something went wrong." });
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Submit Feedback</h2>
      <form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          {formErrors.name && <div className="text-danger">{formErrors.name}</div>}
        </div> 

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="text" className="form-control" value={formData.u_email} onChange={(e) => setFormData({ ...formData, u_email: e.target.value })} />
          {formErrors.u_email && <div className="text-danger">{formErrors.u_email}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Select Category</label>
          <select className="form-select" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
            <option value="">Choose category</option>
            <option value="Child Care">Child Care</option>
            <option value="Elder Care">Elder Care</option>
            <option value="Kitchen helpers">Kitchen helpers</option>
            <option value="Pet Care">Pet Care</option>
            <option value="House Cleaning">House Cleaning</option>
            <option value="Tutoring">Tutoring</option>
          </select>
          {formErrors.category && <div className="text-danger">{formErrors.category}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Reviews</label>
          <textarea className="form-control" rows="3" value={formData.reviews} onChange={(e) => setFormData({ ...formData, reviews: e.target.value })}></textarea>
          {formErrors.reviews && <div className="text-danger">{formErrors.reviews}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Rating</label>
          <div>
            {[1, 2, 3, 4, 5].map((rating) => (
              <span key={rating} className={`me-2 star ${formData.selectraiting >= rating ? 'text-warning' : 'text-secondary'}`} onClick={() => setFormData({ ...formData, selectraiting: rating })}>
                &#9733;
              </span>
            ))}
          </div>
          {formErrors.selectraiting && <div className="text-danger">{formErrors.selectraiting}</div>}
        </div>

        <button type="submit" className="btn btn-success w-100">Submit</button>
      </form>
      {error && <p className="text-danger mt-3">{error}</p>}
    </div>
  );
}