import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } else {
      alert("Login failed");
    }
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-2 w-64">
        <input className="border p-2" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="border p-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="bg-blue-500 text-white p-2">Login</button>
      </form>
    </div>
  );
}
