"use client";
import { useEffect, useState } from "react";

type Overview = {
  learners: number;
  modules: number;
  completionRate: number;
  averageScore: number | null;
  totalAttendanceHours: number;
  xapiCount: number;
  attendanceByDay: { date: string; hours: number }[];
};

export default function Dashboard() {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const [token, setToken] = useState("");
  const [sessions, setSessions] = useState<any[]>([]);
  const [sessionId, setSessionId] = useState("");
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
    fetch(`${API}/catalog/sessions`).then(r=>r.json()).then(setSessions);
  }, [API]);

  async function load() {
    setError("");
    setData(null);
    try {
      const r = await fetch(`${API}/dashboard/overview?sessionId=${encodeURIComponent(sessionId)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!r.ok) throw new Error(await r.text());
      const json = await r.json();
      setData(json);
    } catch (e:any) {
      setError("Impossible de charger les données du dashboard");
      console.error(e);
    }
  }

  useEffect(() => { if (token && sessionId) load(); }, [token, sessionId]);

  return (
    <main style={{ padding: 24 }}>
      <h1>Admin · Dashboard</h1>
      <p>Token: {token ? "✅" : "❌ (connectez-vous sur /login)"}</p>

      <label>Session : </label>
      <select value={sessionId} onChange={e=>setSessionId(e.target.value)}>
        <option value="">Choisir…</option>
        {sessions.map((s:any)=>(<option key={s.id} value={s.id}>{s.title}</option>))}
      </select>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <section style={{ marginTop: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <Card title="Inscrits">{data.learners}</Card>
            <Card title="Modules">{data.modules}</Card>
            <Card title="Achèvement moyen">{data.completionRate}%</Card>
            <Card title="Score moyen">{data.averageScore ?? "—"}</Card>
            <Card title="Heures émargées">{data.totalAttendanceHours} h</Card>
            <Card title="xAPI statements">{data.xapiCount}</Card>
          </div>

          <h3 style={{ marginTop: 16 }}>Heures émargées par jour</h3>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead><tr><th style={{textAlign:'left'}}>Date</th><th style={{textAlign:'right'}}>Heures</th></tr></thead>
            <tbody>
              {data.attendanceByDay.map(r => (
                <tr key={r.date}>
                  <td style={{ borderBottom: "1px solid #eee", padding: "6px 4px" }}>{r.date}</td>
                  <td style={{ borderBottom: "1px solid #eee", padding: "6px 4px", textAlign:"right" }}>{r.hours.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}

function Card({ title, children }: { title: string; children: any }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      <div style={{ fontSize: 12, color: "#666" }}>{title}</div>
      <div style={{ fontSize: 20, fontWeight: 600 }}>{children}</div>
    </div>
  );
}