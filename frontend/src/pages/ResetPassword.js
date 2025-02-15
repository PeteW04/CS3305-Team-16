import { useState, useSearchParams } from "react"
import { changePassword } from "../api/employee.js"
import { useAuth } from '../context/AuthContext.js'
import { Lock, ArrowLeft } from "lucide-react"
import "../CSS-files/ForgotPassword.css"

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Try again!");
      return;
    }

    try {
      const token = searchParams.get("token"); // Extract token from URL
      if (!token) throw new Error("Invalid or missing token");

      const response = await resetPasswordAPI(token, password); // Call API helper
      setSuccessMessage(response.message); // Display success message
      setPassword(""); // Clear input fields
      setConfirmPassword("");
    } catch (err) {
      console.error("Failed to reset password:", err.message);
      setError(err.message || "Failed to reset password. Please try again!");
    }
  };

  return (
    <div className="fp-container">
      <div className="fp-form">
        <h2 className="fp-title">Reset Password</h2>
        <p className="fp-description">
          Please enter a new password.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock className="input-icon" size={20} />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="password">Confirm Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Lock className="input-icon" size={20} />
            </div>
          </div>
          <button type="submit" className="submit-button">
            Reset Password
          </button>
        </form>
        <a href="/login" className="back-to-login">
          <ArrowLeft size={20} />
          <span>Back to Login</span>
        </a>
      </div>
    </div>
  )
}

export default ResetPassword;
