import { useState, useEffect } from "react";
import api from "../../Lib/api";
import { useNavigate } from "react-router-dom";

function SignupForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const navigate = useNavigate();

  // Validation states
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  
  // Terms and privacy policy
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [termsError, setTermsError] = useState("");

  // Form validation
  useEffect(() => {
    // Reset form validation state
    setFormValid(false);
    
    // Validate first name (no numbers or special characters)
    if (firstName) {
      const nameRegex = /^[A-Za-z\s'-]+$/;
      if (!nameRegex.test(firstName)) {
        setFirstNameError("First name should only contain letters, spaces, hyphens, or apostrophes");
      } else if (firstName.length < 2) {
        setFirstNameError("First name must be at least 2 characters");
      } else {
        setFirstNameError("");
      }
    } else {
      setFirstNameError("");
    }
    
    // Validate last name (no numbers or special characters)
    if (lastName) {
      const nameRegex = /^[A-Za-z\s'-]+$/;
      if (!nameRegex.test(lastName)) {
        setLastNameError("Last name should only contain letters, spaces, hyphens, or apostrophes");
      } else if (lastName.length < 2) {
        setLastNameError("Last name must be at least 2 characters");
      } else {
        setLastNameError("");
      }
    } else {
      setLastNameError("");
    }
    
    // Validate mobile number (numbers only, proper length)
    if (mobile) {
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(mobile.replace(/\D/g, ''))) {
        setMobileError("Please enter a valid mobile number (10 digits)");
      } else {
        setMobileError("");
      }
    } else {
      setMobileError("");
    }
    
    // Validate email format
    if (email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
    } else {
      setEmailError("");
    }
    
    // Validate password strength
    if (password) {
      const passwordChecks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
      };
      
      if (!passwordChecks.length) {
        setPasswordError("Password must be at least 8 characters long");
      } else if (!(passwordChecks.uppercase && passwordChecks.lowercase)) {
        setPasswordError("Password must include both uppercase and lowercase letters");
      } else if (!passwordChecks.number) {
        setPasswordError("Password must include at least one number");
      } else if (!passwordChecks.special) {
        setPasswordError("Password must include at least one special character");
      } else {
        setPasswordError("");
      }
    } else {
      setPasswordError("");
    }
    
    // Validate password confirmation
    if (confirmPassword) {
      if (password !== confirmPassword) {
        setConfirmPasswordError("Passwords do not match");
      } else {
        setConfirmPasswordError("");
      }
    } else {
      setConfirmPasswordError("");
    }
    
    // Validate terms acceptance
    if (!acceptTerms) {
      setTermsError("You must accept the Terms and Privacy Policy");
    } else {
      setTermsError("");
    }
    
    // Check if form is valid
    if (
      firstName && lastName && mobile && email && password && confirmPassword && acceptTerms &&
      !firstNameError && !lastNameError && !mobileError && !emailError && 
      !passwordError && !confirmPasswordError && !termsError &&
      password === confirmPassword
    ) {
      setFormValid(true);
    }
  }, [firstName, lastName, mobile, email, password, confirmPassword, acceptTerms]);

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formValid) {
      setErrorMsg("Please fix all validation errors before submitting.");
      return;
    }
    
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await api.post("/api/auth/register", {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        mobile: mobile.replace(/\D/g, ''), // Remove any non-digit characters
        email: email.trim(),
        password,
      });

      if (res.data.message === "success") {
        // Auto-login after successful registration
        try {
          const loginRes = await api.post("/api/auth/token", {
            email: email.trim(),
            password,
          });
          
          if (loginRes.data.token) {
            localStorage.setItem("authToken", loginRes.data.token);
            localStorage.setItem("userRole", "user");
            // Set session timestamp
            localStorage.setItem("sessionStart", Date.now());
            navigate("/dashboard");
          } else {
            // Registration successful but auto-login failed
            setErrorMsg("Account created! Please login with your new credentials.");
            setTimeout(() => navigate("/signin"), 2000);
          }
        } catch (loginErr) {
          // Handle login failure after successful registration
          console.error("Auto-login failed:", loginErr);
          setErrorMsg("Account created! Please login with your new credentials.");
          setTimeout(() => navigate("/signin"), 2000);
        }
      } else {
        setErrorMsg(res.data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);

      if (err.response) {
        if (err.response.status === 409) {
          setEmailError("This email is already registered");
          setErrorMsg("This email address is already registered. Please use a different email or login.");
        } else if (err.response.data && err.response.data.message) {
          setErrorMsg(err.response.data.message);
        } else {
          setErrorMsg("Registration failed. Please check your information and try again.");
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

  // Format phone number as user types
  const formatPhoneNumber = (value) => {
    // Keep only numbers
    const cleaned = value.replace(/\D/g, '');
    setMobile(cleaned);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Create Your Account</h2>
          <p className="text-gray-500 mt-2">Join our community today</p>
        </div>
        
        <form onSubmit={handleSignup} className="space-y-4">
          {/* First Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              className={`w-full px-4 py-3 border ${
                firstNameError ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all`}
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              aria-invalid={firstNameError ? "true" : "false"}
              aria-describedby={firstNameError ? "firstName-error" : undefined}
              required
            />
            {firstNameError && (
              <p id="firstName-error" className="mt-1 text-sm text-red-600">
                {firstNameError}
              </p>
            )}
          </div>
          
          {/* Last Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              className={`w-full px-4 py-3 border ${
                lastNameError ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all`}
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              aria-invalid={lastNameError ? "true" : "false"}
              aria-describedby={lastNameError ? "lastName-error" : undefined}
              required
            />
            {lastNameError && (
              <p id="lastName-error" className="mt-1 text-sm text-red-600">
                {lastNameError}
              </p>
            )}
          </div>
          
          {/* Mobile Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input
              type="tel"
              className={`w-full px-4 py-3 border ${
                mobileError ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all`}
              placeholder="0771234567"
              value={mobile}
              onChange={(e) => formatPhoneNumber(e.target.value)}
              aria-invalid={mobileError ? "true" : "false"}
              aria-describedby={mobileError ? "mobile-error" : undefined}
              required
            />
            {mobileError && (
              <p id="mobile-error" className="mt-1 text-sm text-red-600">
                {mobileError}
              </p>
            )}
          </div>
          
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className={`w-full px-4 py-3 border ${
                emailError ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all`}
              placeholder="yourname@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={emailError ? "true" : "false"}
              aria-describedby={emailError ? "email-error" : undefined}
              required
            />
            {emailError && (
              <p id="email-error" className="mt-1 text-sm text-red-600">
                {emailError}
              </p>
            )}
          </div>
          
          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className={`w-full px-4 py-3 border ${
                passwordError ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={passwordError ? "true" : "false"}
              aria-describedby={passwordError ? "password-error" : undefined}
              required
            />
            {passwordError && (
              <p id="password-error" className="mt-1 text-sm text-red-600">
                {passwordError}
              </p>
            )}
            {password && !passwordError && (
              <p className="mt-1 text-sm text-green-600">
                Strong password!
              </p>
            )}
            <div className="mt-1 text-xs text-gray-500">
              Password must be at least 8 characters with uppercase, lowercase, number, and special character.
            </div>
          </div>
          
          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              className={`w-full px-4 py-3 border ${
                confirmPasswordError ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all`}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-invalid={confirmPasswordError ? "true" : "false"}
              aria-describedby={confirmPasswordError ? "confirm-password-error" : undefined}
              required
            />
            {confirmPasswordError && (
              <p id="confirm-password-error" className="mt-1 text-sm text-red-600">
                {confirmPasswordError}
              </p>
            )}
          </div>
          
          {/* Terms and Conditions Checkbox */}
          <div className="flex items-start mt-4">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-gray-700">
                I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
              </label>
              {termsError && (
                <p className="mt-1 text-sm text-red-600">
                  {termsError}
                </p>
              )}
            </div>
          </div>
          
          {/* Error Message */}
          {errorMsg && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-200 p-3 rounded-lg">
              {errorMsg}
            </div>
          )}
          
          {/* Submit Button */}
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
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a href="/signin" className="text-blue-600 font-medium hover:text-blue-800">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;