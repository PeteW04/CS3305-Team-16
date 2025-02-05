import { useState } from "react"
import { Mail, Lock } from "lucide-react"
import { login } from "../api/auth"
import "../CSS-files/Login.css"
import { useAuth } from "../context/AuthContext"

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(credentials);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="form-title">Login into your account</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <input
                type="email"
                placeholder="victor@email.com"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
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
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
              />
              <Lock className="input-icon" />
            </div>
          </div>
          <div className="forgot-password">
            <a href="/forgotpassword">Forgot Password?</a>
          </div>
          <button className="login-button" type="submit">
            Login Now
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
  )
}

export default Login;
