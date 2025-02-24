import { useState } from "react";
import { Mail, Lock, AlertCircle } from "lucide-react";
import "../CSS-files/Login.css";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); 

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await login(credentials); 
    } catch (err) {
      console.error("Login failed:", err.message);
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    setError(""); 
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="form-title">Login into your account</h2>
        {error && (
          <div className="error-message">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                placeholder="victor@email.com"
                value={credentials.email}
                onChange={handleInputChange}
                required
              />
              <Mail className="input-icon" />
            </div>
          </div>
          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleInputChange}
                required
              />
              <Lock className="input-icon" />
            </div>
          </div>
          <div className="forgot-password">
            <a href="/forgotpassword">Forgot Password?</a>
          </div>
          <button className="login-button" type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login Now"}
          </button>
          <div className="divider">
            <span>OR</span>
          </div>
          <a href="/signup">
            <button type="button" className="signup-button-loginpage">
              Signup Now
            </button>
          </a>
          <button className="google-button" type="button">
            <img src="https://www.google.com/favicon.ico" alt="Google" />
            Continue with Google
          </button>
        </form>
      </div>
      <div className="info-section">
        <img
          src="/logoillustration.png"
          alt="Login illustration"
          className="illustration"
        />
      </div>
    </div>
  );
};

export default Login;