import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css"; // Import the CSS file

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/register";

    const body = isLogin ? { email, password } : { username, email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (isLogin) {
        if (data.token) {
          localStorage.setItem("token", data.token);
          navigate("/dashboard");
        } else {
          alert(data.error || "Login failed");
        }
      } else {
        if (data.message === "User registered") {
          alert("Registration successful! Now login.");
          setIsLogin(true);
          clearForm();
        } else {
          alert(data.error || "Registration failed");
        }
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  }

  function clearForm() {
    setUsername("");
    setEmail("");
    setPassword("");
  }

  function toggleMode() {
    setIsLogin(!isLogin);
    clearForm();
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Header */}
        <div className="auth-header">
          <h2 className="auth-title">
            {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
          </h2>
          <p className="auth-subtitle">
            {isLogin ? "Sign in to continue" : "Join us today"}
          </p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Toggle Section */}
        <div className="toggle-section">
          <p className="toggle-text">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button type="button" className="toggle-btn" onClick={toggleMode}>
            {isLogin ? "Create one here" : "Sign in here"}
          </button>
        </div>

        {/* Footer */}
        
      </div>
    </div>
  );
}
