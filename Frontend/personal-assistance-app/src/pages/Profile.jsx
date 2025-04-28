import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "Lib/api";
import NavBar from "Component/UI/NavBar";

const Profile = () => {
 const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profile_pic: "",
    bio: "",
    mobile: "",
    birthDay: "",
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/user/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res);
        
        setUser(res.data);
        setFormData({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          email: res.data.email || "",
          profile_pic: res.data.profile_pic || "",
          bio: res.data.bio || "",
          mobile: res.data.mobile || "",
          birthDay: res.data.birthDay ? res.data.birthDay.split("T")[0] : "",
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      const res = await api.patch(
        "/user/update-profile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(res.data);
      setMessage("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500"></div>
      </div>
    );
  }
  // Sample Logout Function
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/"); // Redirect to home
  };

  const userData = localStorage.getItem("userData");

  return (

    <div className="bg-gray-100 min-h-screen">
      <NavBar handleLogout={handleLogout}  user={userData}/>
      <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold mb-8 text-[#003366] text-center">My Profile</h2>

      {message && (
        <div className="text-center mb-6 text-green-600 font-semibold">
          {message}
        </div>
      )}

      <div className="flex flex-col items-center mb-8">
        <img
          src={formData.profile_pic || "/Images/person2.png"}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover mb-4 shadow-md"
        />
        {editMode && (
          <input
            type="text"
            name="profile_pic"
            value={formData.profile_pic}
            onChange={handleChange}
            placeholder="Profile Image URL"
            className="border p-2 rounded w-full max-w-sm text-center"
          />
        )}
      </div>

      {/* Form Section */}
      <div className="space-y-6">
        {/* Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">First Name</label>
            {editMode ? (
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            ) : (
              <p className="text-gray-800">{user.firstName}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Last Name</label>
            {editMode ? (
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            ) : (
              <p className="text-gray-800">{user.lastName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          {editMode ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          ) : (
            <p className="text-gray-800">{user.email}</p>
          )}
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Mobile</label>
          {editMode ? (
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          ) : (
            <p className="text-gray-800">{user.mobile || "N/A"}</p>
          )}
        </div>

        {/* Birthday */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Birthday</label>
          {editMode ? (
            <input
              type="date"
              name="birthDay"
              value={formData.birthDay}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          ) : (
            <p className="text-gray-800">{user.birthDay ? user.birthDay.split("T")[0] : "N/A"}</p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">About Me</label>
          {editMode ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              rows="4"
              placeholder="Write something about yourself..."
            ></textarea>
          ) : (
            <p className="text-gray-800">{user.bio || "No bio added yet."}</p>
          )}
        </div>
      </div>

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
                setFormData({
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  profile_pic: user.profile_pic || "",
                  bio: user.bio || "",
                  mobile: user.mobile || "",
                  birthDay: user.birthDay ? user.birthDay.split("T")[0] : "",
                });
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
      </div>
    </div>
      
    </div>
    

//
    
  );
};

export default Profile;
