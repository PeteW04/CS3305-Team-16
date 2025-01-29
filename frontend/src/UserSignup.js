import { useState } from "react"
import { Lock, User } from "lucide-react"
import "./UserSignup.css"

const UserSignup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("User Signup attempted with:", formData)
  }

  return (
    <div className="usersignup-container">
      <div className="usersignup-form">
        <h2 className="form-title">Create your account</h2>
        <form onSubmit={handleSubmit}>
          <div className="name-row">
            <div className="input-group">
              <label>First Name</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="firstName"
                  placeholder="Victor"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Zedo"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                <User className="input-icon" />
              </div>
            </div>
          </div>
          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Lock className="input-icon" />
            </div>
          </div>
          <div className="forgot-password">
            <a href="#">Forgot Password?</a>
          </div>
          <button className="signup-button" type="submit">
            Signup Now
          </button>
          <div className="divider">
            <span>OR</span>
          </div>
          <a href="/login">
            <button type="button" className="login-link-button">
                Login Now
            </button>
          </a>
        </form>
      </div>
      <div className="info-section">
        <img
          src="/logoillustration.png"
          alt="User Signup illustration"
          className="illustration"
        />
      </div>
    </div>
  )
}

export default UserSignup

