import { useState } from "react"
import { Mail, Lock } from "lucide-react"
import "./Login.css"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Login attempted with:", { email, password })
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="logo-container">
          <div className="logo-circles">
            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
            <div className="circle circle-3"></div>
          </div>
          <h1 className="logo-text">DFM</h1>
        </div>
        <h2 className="form-title">Login into your account</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <input
                type="email"
                placeholder="victor@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock className="input-icon" />
            </div>
          </div>
          <div className="forgot-password">
            <a href="#">Forgot Password?</a>
          </div>
          <button className="login-button" type="submit">
            Login Now
          </button>
          <div className="divider">
            <span>OR</span>
          </div>
          <button className="signup-button" type="button">
            Signup Now
          </button>
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
        <h3 className="info-text"></h3>
      </div>
    </div>
  )
}

export default Login;
