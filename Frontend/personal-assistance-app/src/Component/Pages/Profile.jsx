import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Lib/api";
import NavBar from "../UI/NavBar";
import Swal from "sweetalert2";

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profile_pic: "",
    cover_pic: "",
    about: "",
    nic: "",
    address: "",
    mobile: "",
    birthDay: "",
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  
  // Validation states
  const [errors, setErrors] = useState({});
  const [isTouched, setIsTouched] = useState({});
  
  // State for file uploads
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);

  // Unified fetch function
  const fetchUserData = useCallback(async () => {
    try {
      const res = await api.get("/api/user/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const u = res.data;
      setUser(u);

      setFormData({
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        email: u.email || "",
        profile_pic: u.profile_pic || "",
        cover_pic: u.cover_pic || "",
        about: u.about || "",
        mobile: u.mobile || "",
        nic: u.nic || "",
        address: u.address || "",
        birthDay: u.birthDay ? u.birthDay.split("T")[0] : "",
      });

      // Reset photo previews when fetching new data
      setProfilePhotoPreview(u.profile_pic || null);
      setCoverPhotoPreview(u.cover_pic || null);

      // keep localStorage in sync so NavBar shows updated info
      localStorage.setItem("userData", JSON.stringify(u));
    } catch (err) {
      console.error("Fetch user failed:", err);
      if (err.response && err.response.status === 401) {
        navigate("/signin");
      }
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }
    
    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Mobile validation
    if (formData.mobile && !/^[0-9]{10}$/.test(formData.mobile.replace(/[^0-9]/g, ''))) {
      newErrors.mobile = "Please enter a valid 10-digit phone number";
    }
    
    // NIC validation (Sri Lankan ID format)
    if (formData.nic && !isValidNIC(formData.nic)) {
      newErrors.nic = "Please enter a valid NIC number";
    }
    
    // Birthday validation
    if (formData.birthDay) {
      const birthDate = new Date(formData.birthDay);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      // Check if the birthday has occurred this year
      const isBirthdayPassed = 
        today.getMonth() > birthDate.getMonth() || 
        (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
      
      const actualAge = isBirthdayPassed ? age : age - 1;
      
      if (actualAge < 13) {
        newErrors.birthDay = "You must be at least 13 years old";
      } else if (birthDate > today) {
        newErrors.birthDay = "Birth date cannot be in the future";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // NIC validation helper function (handles both old and new SL formats)
  const isValidNIC = (nic) => {
    // Old format: 9 digits + V/X (e.g., 123456789V)
    // New format: 12 digits (e.g., 199812345678)
    const oldFormat = /^[0-9]{9}[vVxX]$/;
    const newFormat = /^[0-9]{12}$/;
    
    return oldFormat.test(nic) || newFormat.test(nic);
  };

  // Validate a specific field when it's touched
  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "firstName":
        if (!value.trim()) {
          error = "First name is required";
        } else if (value.length < 2) {
          error = "First name must be at least 2 characters";
        }
        break;
        
      case "lastName":
        if (!value.trim()) {
          error = "Last name is required";
        } else if (value.length < 2) {
          error = "Last name must be at least 2 characters";
        }
        break;
        
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
        
      case "mobile":
        if (value && !/^[0-9]{10}$/.test(value.replace(/[^0-9]/g, ''))) {
          error = "Please enter a valid 10-digit phone number";
        }
        break;
        
      case "nic":
        if (value && !isValidNIC(value)) {
          error = "Please enter a valid NIC number";
        }
        break;
        
      case "birthDay":
        if (value) {
          const birthDate = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          
          const isBirthdayPassed = 
            today.getMonth() > birthDate.getMonth() || 
            (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
          
          const actualAge = isBirthdayPassed ? age : age - 1;
          
          if (actualAge < 13) {
            error = "You must be at least 13 years old";
          } else if (birthDate > today) {
            error = "Birth date cannot be in the future";
          }
        }
        break;
        
      default:
        break;
    }
    
    return error;
  };

  // Handle profile photo change
  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({...prev, profilePhoto: "Profile photo must be less than 5MB"}));
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({...prev, profilePhoto: "Only JPG, PNG and WebP formats are supported"}));
        return;
      }
      
      setProfilePhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear any previous errors
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.profilePhoto;
        return newErrors;
      });
    }
  };

  // Handle cover photo change
  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({...prev, coverPhoto: "Cover photo must be less than 10MB"}));
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({...prev, coverPhoto: "Only JPG, PNG and WebP formats are supported"}));
        return;
      }
      
      setCoverPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear any previous errors
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.coverPhoto;
        return newErrors;
      });
    }
  };

  // Update just the photos
  const handleUpdatePhotos = async () => {
    try {
      // Validate photos first
      if (errors.profilePhoto || errors.coverPhoto) {
        Swal.fire({
          text: "Please fix the errors with your photos before uploading.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
        return;
      }
      
      const photoData = {
        profile_pic: profilePhotoPreview || formData.profile_pic,
        cover_pic: coverPhotoPreview || formData.cover_pic
      };

      await api.patch(
        "/api/user/update-profile-pic-and-cover",
        photoData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        text: "Photos updated successfully!",
        icon: "success",
        confirmButtonColor: "#0d9488",
      });

      // Update local state with new photos
      setFormData(prev => ({
        ...prev,
        profile_pic: photoData.profile_pic,
        cover_pic: photoData.cover_pic
      }));

      // Reset file states
      setProfilePhotoFile(null);
      setCoverPhotoFile(null);

      // Re-fetch to ensure everything is synced
      await fetchUserData();

    } catch (error) {
      console.error("Error updating photos:", error);
      Swal.fire({
        text: "Failed to update photos.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  // Save all profile data
  const handleSave = async () => {
    // Mark all fields as touched for validation
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setIsTouched(allTouched);
    
    // Validate all fields
    if (!validateForm()) {
      Swal.fire({
        text: "Please fix the validation errors before saving.",
        icon: "warning",
        confirmButtonColor: "#d33",
      });
      return;
    }
    
    try {
      // Update profile details first
      await api.patch(
        "/api/user/update-profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // If photos were updated, also update them
      if (profilePhotoPreview !== user.profile_pic || coverPhotoPreview !== user.cover_pic) {
        await handleUpdatePhotos();
      }

      Swal.fire({
        text: "Profile updated successfully!",
        icon: "success",
        confirmButtonColor: "#0d9488",
      });

      setEditMode(false);
      // Reset touched state
      setIsTouched({});
      // re-fetch fresh data & update form
      await fetchUserData();

    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        text: "Failed to update profile.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleDelete = async() => {
     Swal.fire({
          title: 'Are you sure?',
          text: "This account will be permently deleted.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#0d9488', 
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Delete!',
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
  
              const res = await api.delete(`/api/user/delete-user-account/${user._id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                });
              console.log(res);
              if(res.status == 200){
                Swal.fire('Deleted!', 'Your account has been deleted.', 'success');
                handleLogout();
              }
            } catch (error) {
              console.error("Account deletion failed:", error);
              Swal.fire('Error!', 'There was a problem deleting your account.', 'error');
            }
          }
        });
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Mark field as touched
    setIsTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate the field as user types
    const fieldError = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setIsTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate on blur
    const fieldError = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500" />
      </div>
    );
  }

  // guard in case fetch completely failed
  if (!user) {
    return <div className="text-center mt-20">Unable to load profile.</div>;
  }

  // parse userData for NavBar
  const navUser = JSON.parse(localStorage.getItem("userData") || "null");

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar handleLogout={handleLogout} user={navUser} />

      <div className="max-w-4xl mx-auto mt-10 bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Cover Photo Section */}
        <div className="relative h-64 bg-gray-200">
          <img
            src={coverPhotoPreview || formData.cover_pic || "/Images/default-cover.png"}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          
          {editMode && (
            <div className="absolute bottom-4 right-4">
              <label className="bg-white bg-opacity-75 hover:bg-opacity-90 text-gray-800 font-medium py-2 px-4 rounded-lg cursor-pointer transition flex items-center gap-2 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Update Cover
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverPhotoChange}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
        
        {/* Error message for cover photo */}
        {errors.coverPhoto && (
          <div className="bg-red-100 text-red-700 p-2 text-center">
            {errors.coverPhoto}
          </div>
        )}

        <div className="p-8">
          {/* Profile Photo Section */}
          <div className="flex flex-col items-center -mt-20 mb-8">
            <div className="relative">
              <img
                src={profilePhotoPreview || formData.profile_pic || "/Images/person2.png"}
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-md"
              />
              {editMode && (
                <label className="absolute bottom-0 right-0 bg-teal-500 hover:bg-teal-600 text-white rounded-full p-2 cursor-pointer shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            {/* Error message for profile photo */}
            {errors.profilePhoto && (
              <div className="mt-2 text-red-600 text-sm">
                {errors.profilePhoto}
              </div>
            )}
            
            <h2 className="text-3xl font-bold mt-4 text-[#003366]">
              {user.firstName} {user.lastName}
            </h2>
          </div>

          {/* Form Fields */}
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* First / Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedField 
                label="First Name" 
                name="firstName" 
                value={formData.firstName}
                onChange={handleChange} 
                onBlur={handleBlur}
                editMode={editMode}
                error={isTouched.firstName && errors.firstName}
                required
              />
              <ValidatedField 
                label="Last Name" 
                name="lastName" 
                value={formData.lastName}
                onChange={handleChange} 
                onBlur={handleBlur}
                editMode={editMode} 
                error={isTouched.lastName && errors.lastName}
                required
              />
            </div>

            {/* Email */}
            <ValidatedField 
              label="Email" 
              name="email" 
              value={formData.email}
              onChange={handleChange} 
              onBlur={handleBlur}
              editMode={editMode} 
              type="email"
              error={isTouched.email && errors.email}
              required
            />

            {/* Mobile */}
            <ValidatedField 
              label="Mobile" 
              name="mobile" 
              value={formData.mobile}
              onChange={handleChange} 
              onBlur={handleBlur}
              editMode={editMode} 
              error={isTouched.mobile && errors.mobile}
            />
             
             {/* NIC */}
             <ValidatedField 
              label="NIC" 
              name="nic" 
              value={formData.nic}
              onChange={handleChange} 
              onBlur={handleBlur}
              editMode={editMode} 
              error={isTouched.nic && errors.nic}
            />
             
             {/* Address */}
             <ValidatedField 
              label="Address" 
              name="address" 
              value={formData.address}
              onChange={handleChange} 
              onBlur={handleBlur}
              editMode={editMode} 
              error={isTouched.address && errors.address}
            />            

            {/* Birthday */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Birthday
              </label>
              {editMode ? (
                <div>
                  <input
                    type="date"
                    name="birthDay"
                    value={formData.birthDay}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`border p-2 rounded w-full focus:outline-none ${
                      isTouched.birthDay && errors.birthDay 
                        ? "border-red-500 focus:ring-red-300" 
                        : "focus:ring-2 focus:ring-teal-300"
                    }`}
                  />
                  {isTouched.birthDay && errors.birthDay && (
                    <p className="text-red-600 text-sm mt-1">{errors.birthDay}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-800">
                  {user.birthDay ? user.birthDay.split("T")[0] : "—"}
                </p>
              )}
            </div>

            {/* About */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                About Me
              </label>
              {editMode ? (
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-teal-300"
                  rows="4"
                  placeholder="Write something about yourself..."
                />
              ) : (
                <p className="text-gray-800">{user.about || "—"}</p>
              )}
            </div>
          </div>

          {/* Photo Update Button (when in edit mode and photos have changed) */}
          {editMode && (profilePhotoFile || coverPhotoFile) && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleUpdatePhotos}
                disabled={errors.profilePhoto || errors.coverPhoto}
                className={`${
                  errors.profilePhoto || errors.coverPhoto
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-teal-500 hover:bg-teal-600"
                } text-white font-semibold py-2 px-6 rounded-lg transition flex items-center gap-2`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                </svg>
                Update Photos
              </button>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-center mt-8 space-x-4">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={Object.keys(errors).some(key => errors[key])}
                  className={`${
                    Object.keys(errors).some(key => errors[key])
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-teal-500 hover:bg-teal-600"
                  } text-white font-semibold py-2 px-8 rounded-full transition`}
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    fetchUserData(); // reset formData back to original
                    setProfilePhotoPreview(user.profile_pic || null);
                    setCoverPhotoPreview(user.cover_pic || null);
                    setProfilePhotoFile(null);
                    setCoverPhotoFile(null);
                    setErrors({});
                    setIsTouched({});
                  }}
                  className="border border-gray-400 text-gray-700 font-semibold py-2 px-8 rounded-full transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-8 rounded-full transition"
              >
                Edit Profile
              </button>
            )}
            <button
                onClick={() => handleDelete()}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-8 rounded-full transition"
              >
               Delete Account
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Field component for form fields with validation
function ValidatedField({ 
  label, 
  name, 
  value, 
  onChange, 
  onBlur, 
  editMode, 
  type = "text", 
  error,
  required = false 
}) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {editMode ? (
        <div>
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={`border p-2 rounded w-full focus:outline-none ${
              error ? "border-red-500 focus:ring-red-300" : "focus:ring-2 focus:ring-teal-300"
            }`}
          />
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>
      ) : (
        <p className="text-gray-800">{value || "—"}</p>
      )}
    </div>
  );
}

export default Profile;