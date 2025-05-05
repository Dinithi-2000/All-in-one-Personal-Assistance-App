import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LoginPage = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(username);
    const redirectTo =
      location.state?.from?.pathname ||
      (username === "SerenniAdmin" ? "/admin" : "/payment");
    // Redirect based on role
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Admin access: Use "SerenniAdmin" as username
      </p>
    </div>
  );
};

export default LoginPage;
