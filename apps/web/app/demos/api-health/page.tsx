"use client";
import { useEffect, useState } from "react";

// Same guard as landing, to avoid `process` in the browser
function safePublicEnv(name: string): string | undefined {
  if (typeof process !== "undefined" && (process as any).env) {
    const v = (process as any).env[name];
    if (typeof v === "string" && v.length) return v;
  }
  return undefined;
}

export default function ApiHealthPage() {
  const [status, setStatus] = useState<"idle" | "ok" | "down">("idle");
  const [payload, setPayload] = useState<any>(null);

  useEffect(() => {
    const baseFromEnv = safePublicEnv("NEXT_PUBLIC_API_BASE_URL") || "";
    const base = baseFromEnv.replace(/\/$/, "");
    const url = base ? `${base}/health` : "/api/health"; // fallback proxy
    fetch(url)
      .then(async (r) => ({ ok: r.ok, json: await r.json().catch(() => ({})) }))
      .then((res) => {
        setStatus(res.ok ? "ok" : "down");
        setPayload(res.json);
      })
      .catch(() => setStatus("down"));
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-slate-900">API Health Check</h1>
        <p className="mt-2 text-slate-600">Teste la route <code className="px-1.5 py-0.5 rounded bg-slate-100">/health</code> du backend.</p>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <span className={`inline-block h-3 w-3 rounded-full ${status === "ok" ? "bg-emerald-500" : status === "down" ? "bg-rose-500" : "bg-slate-300"}`} />
            <span className="text-slate-800 font-semibold">Statut : {status.toUpperCase()}</span>
          </div>
          <pre className="mt-4 overflow-x-auto text-sm text-slate-700 bg-slate-50 p-3 rounded">{JSON.stringify(payload, null, 2)}</pre>
        </div>
      </div>
    </main>
  );
}