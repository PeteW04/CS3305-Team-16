import { useState } from "react"
import { Mail, ArrowLeft } from "lucide-react"
import "../CSS-files/ForgotPassword.css"
import { forgotPassword } from "../api/auth"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const response = await forgotPassword(email);
      setMessage(response.message);
      setEmail("");
    } catch (err) {
      console.error("Error in forgotPasssword:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="fp-container">
      <div className="fp-form">
        <h2 className="fp-title">Forgot Password</h2>
        <p className="fp-description">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail className="input-icon" size={20} />
            </div>
          </div>
          <button type="submit" className="submit-button">
            Send Reset Instructions
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

export default ForgotPassword

