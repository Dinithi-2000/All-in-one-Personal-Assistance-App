import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "Lib/api";
import NavBar from "Component/UI/NavBar";
import Swal from "sweetalert2";

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const [user, setUser]       = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profile_pic: "",
    about: "",
    mobile: "",
    birthDay: "",
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // 1) Unified fetch function
  const fetchUserData = useCallback(async () => {
    try {
      const res = await api.get("/user/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const u = res.data;
      setUser(u);

      setFormData({
        firstName: u.firstName || "",
        lastName:  u.lastName  || "",
        email:     u.email     || "",
        profile_pic: u.profile_pic || "",
        about:     u.about     || "",
        mobile:    u.mobile    || "",
        birthDay:  u.birthDay ? u.birthDay.split("T")[0] : "",
      });

      // keep localStorage in sync so NavBar shows updated info
      localStorage.setItem("userData", JSON.stringify(u));
    } catch (err) {
      console.error("Fetch user failed:", err);
      // maybe navigate("/signin") if 401
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // 2) On Save: patch, then re-fetch
  const handleSave = async () => {
    try {
      await api.patch(
        "/user/update-profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

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

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/");
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

      <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-8 text-[#003366] text-center">
          My Profile
        </h2>

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
              onChange={(e) =>
                setFormData((f) => ({ ...f, [e.target.name]: e.target.value }))
              }
              placeholder="Profile Image URL"
              className="border p-2 rounded w-full max-w-sm text-center"
            />
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* First / Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["firstName", "lastName"].map((field, idx) => (
              <div key={field}>
                <label className="block text-gray-700 font-medium mb-1">
                  {field === "firstName" ? "First Name" : "Last Name"}
                </label>
                {editMode ? (
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />
                ) : (
                  <p className="text-gray-800">{user[field] || "—"}</p>
                )}
              </div>
            ))}
          </div>

          {/* Email */}
          <Field label="Email" name="email" value={user.email} editMode />

          {/* Mobile */}
          <Field label="Mobile" name="mobile" value={user.mobile} editMode />

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
                className="border p-2 rounded w-full"
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
                className="border p-2 rounded w-full"
                rows="4"
                placeholder="Write something about yourself..."
              />
            ) : (
              <p className="text-gray-800">{user.about || "—"}</p>
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
                  fetchUserData(); // reset formData back to original
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
  );

  // small helper component for simple text fields
  function Field({ label, name, value, editMode }) {
    return (
      <div>
        <label className="block text-gray-700 font-medium mb-1">{label}</label>
        {editMode ? (
          <input
            type={name === "email" ? "email" : "text"}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        ) : (
          <p className="text-gray-800">{value || "—"}</p>
        )}
      </div>
    );
  }

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }
};

export default Profile;
