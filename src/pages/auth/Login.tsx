import { useState, useEffect } from "react";
import "./Login.css";
import { login } from "./authService";
import { SnackBarLib } from "../../components/SnackBarLib";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const { login: authLogin, error: authError, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  // Check if user landed here due to session expired
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const reason = urlParams.get("reason");

    if (reason === "session_expired") {
      setShowSessionExpired(true);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleSessionExpiredClose = () => {
    setShowSessionExpired(false);
  };

  const handleLoginFormChange = (field: string, value: string) => {
    setLoginForm({
      ...loginForm,
      [field]: value,
    });
    if (field === "email") {
      setEmailError("");
    } else if (field === "password") {
      setPasswordError("");
    }

    // Clear login error when user starts typing
    if (loginError) {
      setLoginError("");
    }

    if (field === "email" && !value) {
      setEmailError("Email is required");
    } else if (field === "password" && !value) {
      setPasswordError("Password is required");
    }
  };

  const handleLogin = async () => {
    // Clear previous errors
    setLoginError("");
    clearError();

    if (loginForm.email !== "" && loginForm.password !== "") {
      try {
        const response = await login(loginForm.email, loginForm.password);
        console.log("response", response);

        if (response.token && response.user && response.expires_at) {
          // Use auth context to handle login
          authLogin({
            token: response.token,
            user: response.user,
            expires_at: response.expires_at,
          });
          // Navigation will be handled automatically by the App component
        } else if (response.message) {
          // Display API error message
          setLoginError(response.message);
        }
      } catch (error) {
        console.error("Login error:", error);
        setLoginError("Login failed. Please try again.");
      }
    } else {
      console.log("show error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your student account</p>
        </div>

        <div className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              required
              value={loginForm.email}
              onChange={(e) => handleLoginFormChange("email", e.target.value)}
            />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                required
                value={loginForm.password}
                onChange={(e) =>
                  handleLoginFormChange("password", e.target.value)
                }
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>

          {(loginError || authError) && (
            <div className="login-error">
              <p className="error-message">{loginError || authError}</p>
            </div>
          )}

          <button className="login-button" onClick={handleLogin}>
            Sign In
          </button>
        </div>
        
      </div>
      {showSessionExpired && (
        <SnackBarLib
          type="error"
          description="Your session has expired. Please log in again."
          show={showSessionExpired}
          onClose={handleSessionExpiredClose}
          autoHideDuration={5000}
          position="top-right"
        />
      )}
    </div>
  );
}
