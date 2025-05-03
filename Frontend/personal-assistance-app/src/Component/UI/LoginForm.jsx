import { useState } from "react";
import api from "../../Lib/api";
import { useNavigate } from "react-router-dom";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
  
    const handleLogin = async (e) => {
        e.preventDefault();
      
        try {
          const res = await api.post("/auth/token-service-provider", {
            email,
            password,
          });
          console.log(res);
          
      
          if (res.data.token) {
            localStorage.setItem("authToken", res.data.token);
            navigate("/dashboard");
          } else {
            setErrorMsg(res.data.message || "Login failed");
          }
        } catch (err) {
          console.error(err);
      
          if (err.response && err.response.data && err.response.data.message) {
            setErrorMsg(err.response.data.message);
          } else {
            setErrorMsg("Something went wrong. Please try again.");
          }
        }
      };
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back 👋</h2>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="yourname@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {errorMsg && (
              <div className="text-sm text-red-500">{errorMsg}</div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Log In
            </button>
          </form>
          <p className="text-sm text-center text-gray-500 mt-4">
            Don’t have an account? <a href="/signup" className="text-blue-600">Sign up</a>
          </p>
        </div>
      </div>
    );
  }
  
  export default LoginForm;