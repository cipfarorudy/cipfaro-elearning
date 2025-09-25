"use client";
import { useState } from "react";

export default function Login() {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:10002";
  const [email, setEmail] = useState("admin@cipfaro.fr");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Login failed"); return; }
    localStorage.setItem("token", data.token);
    window.location.href = "/dashboard";
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Connexion</h1>
      <form onSubmit={onSubmit}>
        <input 
          name="email"
          value={email} 
          onChange={e=>setEmail(e.target.value)} 
          placeholder="Email" 
        /><br/>
        <input 
          name="password"
          value={password} 
          onChange={e=>setPassword(e.target.value)} 
          type="password" 
          placeholder="Mot de passe" 
        /><br/>
        <button type="submit">Se connecter</button>
        {error && <p data-testid="error-message" style={{color:'red'}}>{error}</p>}
      </form>
    </main>
  );
}
