import { useState, useEffect } from "react";
import api from "../../Lib/api";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginAs, setLoginAs] = useState("user"); // "user" or "provider"
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const navigate = useNavigate();

  // Form validation
  useEffect(() => {
    // Reset form validation state
    setFormValid(false);
    
    // Validate email format
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
    } else {
      setEmailError("");
    }
    
    // Validate password
    if (password) {
      if (password.length < 8) {
        setPasswordError("Password must be at least 8 characters");
      } else {
        setPasswordError("");
      }
    } else {
      setPasswordError("");
    }
    
    // Check if form is valid
    if (email && password && !emailError && !passwordError) {
      setFormValid(true);
    }
  }, [email, password, emailError, passwordError]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formValid) {
      return;
    }
    
    // Check login attempts to prevent brute force
    if (loginAttempts >= 5) {
      setErrorMsg("Too many login attempts. Please try again later or reset your password.");
      return;
    }
    
    setIsLoading(true);
    setErrorMsg("");

    try {
      const endpoint = loginAs === "user" ? "/api/auth/token" : "/api/auth/token-service-provider";
      
      const res = await api.post(endpoint, {
        email: email.trim(),
        password,
      });

      if (res.data.token) {
        // Reset login attempts on successful login
        setLoginAttempts(0);
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("userRole", loginAs);
        
        // Set session timestamp for additional security
        localStorage.setItem("sessionStart", Date.now());
        
        navigate(loginAs === "user" ? "/dashboard" : "/spdashboard");
      } else {
        setLoginAttempts(prevAttempts => prevAttempts + 1);
        setErrorMsg(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setLoginAttempts(prevAttempts => prevAttempts + 1);

      // Handle specific error responses
      if (err.response) {
        if (err.response.status === 401) {
          setErrorMsg("Invalid email or password");
        } else if (err.response.status === 429) {
          setErrorMsg("Too many login attempts. Please try again later.");
        } else if (err.response.data && err.response.data.message) {
          setErrorMsg(err.response.data.message);
        } else {
          setErrorMsg("Authentication failed. Please check your credentials.");
        }
      } else if (err.request) {
        setErrorMsg("Network error. Please check your connection and try again.");
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Sign in to access your account</p>
        </div>
        
        {/* Toggle buttons */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          <button
            type="button"
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
              loginAs === "user" 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setLoginAs("user")}
          >
            Customer
          </button>
          <button
            type="button"
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
              loginAs === "provider" 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setLoginAs("provider")}
          >
            Service Provider
          </button>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                type="email"
                className={`w-full pl-10 pr-4 py-3 border ${
                  emailError ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                } rounded-lg outline-none transition-all`}
                placeholder="yourname@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={emailError ? "true" : "false"}
                aria-describedby={emailError ? "email-error" : undefined}
                required
              />
            </div>
            {emailError && (
              <p id="email-error" className="mt-1 text-sm text-red-600">
                {emailError}
              </p>
            )}
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="password"
                className={`w-full pl-10 pr-4 py-3 border ${
                  passwordError ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                } rounded-lg outline-none transition-all`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={passwordError ? "true" : "false"}
                aria-describedby={passwordError ? "password-error" : undefined}
                required
              />
            </div>
            {passwordError && (
              <p id="password-error" className="mt-1 text-sm text-red-600">
                {passwordError}
              </p>
            )}
          </div>
          
          {errorMsg && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-200 p-3 rounded-lg">
              {errorMsg}
            </div>
          )}
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !formValid}
              className={`w-full flex items-center justify-center bg-blue-600 text-white py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ${
                isLoading || !formValid ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                `Sign in as ${loginAs === "user" ? "Customer" : "Service Provider"}`
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <a 
              href={loginAs === "user" ? "/signup" : "/serviceselections"} 
              className="text-blue-600 font-medium hover:text-blue-800"
            >
              Sign up
            </a>
          </p>
        </div>
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Sign in As Admin{" "}
            <a 
              href="/admin-signin" 
              className="text-blue-600 font-medium hover:text-blue-800"
            >
              Sign in
            </a>
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center">
            <span className="text-sm text-gray-500">
              © 2025 Your Company. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;