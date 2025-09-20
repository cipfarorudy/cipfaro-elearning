"use client";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("admin@cipfaro.local");
  const [password, setPassword] = useState("admin1234");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Login failed"); return; }
    localStorage.setItem("token", data.token);
    window.location.href = "/admin/modules";
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Connexion</h1>
      <form onSubmit={onSubmit}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" /><br/>
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Mot de passe" /><br/>
        <button type="submit">Se connecter</button>
        {error && <p style={{color:'red'}}>{error}</p>}
      </form>
    </main>
  );
}
