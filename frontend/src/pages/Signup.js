import { useState } from "react"
import { registerManager } from "../api/auth"
import { useAuth } from "../context/AuthContext"
import { Mail, Lock, User, Building2 } from "lucide-react"
import "../CSS-files/Signup.css"

const Signup = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
    description: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await registerManager(formData);
      await login({ email: formData.email, password: formData.password });
    } catch (err) {
      console.error("Signup Failed:", err.message);
      alert("Signup Failed. Please try again");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form-container">
        <div className="signup-form">
          {/* logo goes here if needed */}
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
                  <User className="input-icon" />
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
              <label>Email Address</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  name="email"
                  placeholder="victor@email.com"
                  value={formData.email}
                  onChange={handleChange}
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
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Lock className="input-icon" />
              </div>
            </div>
            <div className="input-group">
              <label>Confirm Password</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <Lock className="input-icon" />
              </div>
            </div>
            <div className="input-group">
              <label>Organization</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="organizationName"
                  placeholder="Enter your organization"
                  value={formData.organizationName}
                  onChange={handleChange}
                  required
                />
                <Building2 className="input-icon" />
              </div>
            </div>
            <div className="input-group">
              <label>Organization Description</label>
              <div className="input-wrapper">
                <textarea
                  name="description"
                  placeholder="Tell me about your organization"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </div>
            </div>
            <button className="signup-button" type="submit">
              Signup Now
            </button>
            <div className="divider">
              <span>OR</span>
            </div>
            <a href="/login">
              <button type="button" className="login-link-button" href=''>
                Login Now
              </button>
            </a>
          </form>
        </div>
      </div>
      <div className="info-section">
        <img
          src="/logoillustration.png"
          alt="Signup illustration"
          className="illustration"
        />
      </div>
    </div>
  )
}

export default Signup
