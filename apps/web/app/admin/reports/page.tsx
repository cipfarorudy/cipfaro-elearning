"use client";
import { useEffect, useState } from "react";

export default function Reports() {
  const [token, setToken] = useState("");
  const [sessions, setSessions] = useState<any[]>([]);
  const [sessionId, setSessionId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
    fetch("http://localhost:3001/catalog/sessions").then(r=>r.json()).then(setSessions);
  }, []);

  const csvUrl = `http://localhost:3001/reports/attendance.csv?sessionId=${encodeURIComponent(sessionId || "")}`;
  const pdfUrl = `http://localhost:3001/reports/attendance.pdf?sessionId=${encodeURIComponent(sessionId || "")}`;
  const zipUrl = `http://localhost:3001/reports/attestations.zip?sessionId=${encodeURIComponent(sessionId || "")}`;
  const auditUrl = `http://localhost:3001/reports/audit.csv?sessionId=${encodeURIComponent(sessionId || "")}${from?`&from=${encodeURIComponent(from)}`:""}${to?`&to=${encodeURIComponent(to)}`:""}`;

  return (
    <main style={{ padding: 24 }}>
      <h1>Admin · Rapports</h1>
      <p>Token: {token ? "✅" : "❌ (connectez-vous sur /login)"}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 680 }}>
        <div>
          <label>Session : </label>
          <select value={sessionId} onChange={e=>setSessionId(e.target.value)}>
            <option value="">Choisir…</option>
            {sessions.map((s:any)=>(<option key={s.id} value={s.id}>{s.title}</option>))}
          </select>
        </div>
        <div>
          <label style={{display:'block'}}>Audit — Période :</label>
          <input type="date" value={from} onChange={e=>setFrom(e.target.value)} /> →
          <input type="date" value={to} onChange={e=>setTo(e.target.value)} />
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <p><a href={csvUrl} target="_blank" rel="noreferrer">⬇️ Export CSV présences</a></p>
        <p><a href={pdfUrl} target="_blank" rel="noreferrer">⬇️ Export PDF présences (signé)</a></p>
        <p><a href={zipUrl} target="_blank" rel="noreferrer">⬇️ Attestations (ZIP)</a></p>
        <p><a href={auditUrl} target="_blank" rel="noreferrer">⬇️ Journal d’audit (CSV)</a></p>
      </div>
    </main>
  );
}
