import { useState, useEffect } from "react"
import { registerEmployee } from "../api/auth"
import { useAuth } from "../context/AuthContext"
import { Lock, User } from "lucide-react"
import "../CSS-files/UserSignup.css"

const UserSignup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmpassword: ""
  })
  const [token, setToken] = useState(null);
  const { login } = useAuth();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const extractedToken = queryParams.get("token"); // Get 'token' from URL
    setToken(extractedToken);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmpassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      const response = await registerEmployee({
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        token,
      });
      console.log("Registration successful:", response);

      await login({
        email: response.user.email,
        password: formData.password,
      });

    } catch (error) {
      console.error("Error during registration:", error.message);
      alert(error.message || "An error occurred during registration.");
    }
  };

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

          <div className="input-group">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                name="confirmpassword"
                placeholder="Confirm your password"
                value={formData.confirmpassword}
                onChange={handleChange}
                required
              />
              <Lock className="input-icon" />
            </div>
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

