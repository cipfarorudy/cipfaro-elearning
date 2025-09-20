"use client";
import { useEffect, useState } from "react";

export default function AdminModules() {
  const [token, setToken] = useState("");
  const [sessions, setSessions] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
    fetch("http://localhost:3001/catalog/sessions").then(r=>r.json()).then(setSessions);
  }, []);

  async function refreshModules(sid: string) {
    if (!sid) return;
    const r = await fetch(`http://localhost:3001/modules?sessionId=${sid}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (r.ok) setModules(await r.json());
  }

  useEffect(() => { refreshModules(sessionId); }, [sessionId, token]);

  async function createModule() {
    const body = { sessionId, title: "SCORM Démo", type: "SCORM", orderIndex: 1 };
    const r = await fetch("http://localhost:3001/modules", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    if (r.ok) {
      const m = await r.json();
      setModules((prev) => [...prev, m]);
    } else {
      alert("Erreur création module");
    }
  }

  async function uploadZip(moduleId: string, file: File) {
    const fd = new FormData();
    fd.append("package", file);
    const r = await fetch(`http://localhost:3001/scorm/import/${moduleId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd
    });
    if (r.ok) {
      alert("Import OK");
      refreshModules(sessionId);
    } else {
      const err = await r.text();
      alert("Erreur import: " + err);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Admin · Modules</h1>

      <p>Token: {token ? "✅" : "❌ (connectez-vous sur /login)"}</p>

      <label>Session : </label>
      <select value={sessionId} onChange={e=>setSessionId(e.target.value)}>
        <option value="">Choisir…</option>
        {sessions.map((s:any)=>(<option key={s.id} value={s.id}>{s.title}</option>))}
      </select>
      <button onClick={createModule} disabled={!sessionId || !token} style={{ marginLeft: 8 }}>+ Module SCORM</button>

      <ul>
        {modules.map((m:any)=> (
          <li key={m.id} style={{ marginTop: 12 }}>
            <strong>{m.title}</strong> — {m.type}
            <div>
              <input type="file" accept=".zip" onChange={(e)=> e.target.files && uploadZip(m.id, e.target.files[0])} />
            </div>
            {m.scorm && <small>launchUrl: {m.scorm.launchUrl}</small>}
          </li>
        ))}
      </ul>
    </main>
  );
}
