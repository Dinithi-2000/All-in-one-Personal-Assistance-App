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

  // Handle profile photo change
  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle cover photo change
  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update just the photos
  const handleUpdatePhotos = async () => {
    try {
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
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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
            <h2 className="text-3xl font-bold mt-4 text-[#003366]">
              {user.firstName} {user.lastName}
            </h2>
          </div>

          {/* Form Fields */}
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* First / Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field 
                label="First Name" 
                name="firstName" 
                value={user.firstName} 
                formValue={formData.firstName}
                onChange={handleChange} 
                editMode={editMode} 
              />
              <Field 
                label="Last Name" 
                name="lastName" 
                value={user.lastName} 
                formValue={formData.lastName}
                onChange={handleChange} 
                editMode={editMode} 
              />
            </div>

            {/* Email */}
            <Field 
              label="Email" 
              name="email" 
              value={user.email} 
              formValue={formData.email}
              onChange={handleChange} 
              editMode={editMode} 
              type="email"
            />

            {/* Mobile */}
            <Field 
              label="Mobile" 
              name="mobile" 
              value={user.mobile} 
              formValue={formData.mobile}
              onChange={handleChange} 
              editMode={editMode} 
            />
             <Field 
              label="NIC" 
              name="nic" 
              value={user.nic} 
              formValue={formData.nic}
              onChange={handleChange} 
              editMode={editMode} 
            />
             <Field 
              label="Address" 
              name="address" 
              value={user.address} 
              formValue={formData.address}
              onChange={handleChange} 
              editMode={editMode} 
            />            


            {/* Birthday */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Birthday
              </label>
              {editMode ? (
                <input
                  type="date"
                  name="birthDay"
                  value={formData.birthDay}
                  onChange={handleChange}
                  className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
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
                className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded-lg transition flex items-center gap-2"
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
                  className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-8 rounded-full transition"
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
                className="bg-red-500 hover:bg-blue-600 text-white font-semibold py-2 px-8 rounded-full transition"
              >
               Delete Account
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Field component for form fields
function Field({ label, name, value, formValue, onChange, editMode, type = "text" }) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      {editMode ? (
        <input
          type={type}
          name={name}
          value={formValue}
          onChange={onChange}
          className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-teal-300"
        />
      ) : (
        <p className="text-gray-800">{value || "—"}</p>
      )}
    </div>
  );
}

export default Profile;