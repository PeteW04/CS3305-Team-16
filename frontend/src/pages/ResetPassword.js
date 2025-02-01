import { useState } from "react"
import { Lock, ArrowLeft } from "lucide-react"
import "../CSS-files/ForgotPassword.css"

const ResetPassword = () => {
  const [Password, setPassword] = useState("")
  const [ConfirmPassword, setConfirmPassword] = useState("")
  const[Error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    if (Password !== ConfirmPassword) {
        setError("Password doesnt match. Try again!")
        return
    }
  }

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
                        value={Password}
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
                        id="confirmpassword"
                        placeholder="Confirm your new password"
                        value={ConfirmPassword}
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
