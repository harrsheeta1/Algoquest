import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    if (data.message === "User registered") {
      alert("Registration successful! Now login.");
      navigate("/");
    } else {
      alert(data.error || "Registration failed");
    }
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl mb-4">Register</h2>
      <form onSubmit={handleRegister} className="flex flex-col gap-2 w-64">
        <input className="border p-2" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input className="border p-2" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="border p-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="bg-green-600 text-white p-2">Register</button>
      </form>
    </div>
  );
}
