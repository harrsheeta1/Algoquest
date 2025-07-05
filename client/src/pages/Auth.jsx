import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true); // toggle between login/register
  const [username, setUsername] = useState(""); // for register only
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/register";

    const body = isLogin
      ? { email, password }
      : { username, email, password };

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
      } else {
        alert(data.error || "Registration failed");
      }
    }
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 shadow-lg rounded-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              className="border p-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="border p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? "Register here" : "Login here"}
          </button>
        </p>
      </div>
    </div>
  );
}
