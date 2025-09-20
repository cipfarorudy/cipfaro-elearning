"use client";
import { useEffect, useMemo, useState } from "react";
import { SCORM12API } from "@cipfaro/scorm-runtime/src/Api12";

export default function LearnPage({ params }: { params: { moduleId: string } }) {
  const [token, setToken] = useState("");
  const [launchUrl] = useState(() => "/scorm/demo/index_lms.html");

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
    setToken(t);
  }, []);

  useEffect(() => {
    if (!token) return;
    const api = new SCORM12API(params.moduleId, token);
    (window as any).API = api; // Expose SCORM 1.2 API
    return () => { delete (window as any).API; };
  }, [params.moduleId, token]);

  const iframeStyles: React.CSSProperties = useMemo(() => ({
    width: "100%",
    height: "80vh",
    border: "1px solid #ddd",
    borderRadius: 8
  }), []);

  return (
    <main style={{ padding: 16 }}>
      <h2>Lecteur SCORM — Module: {params.moduleId}</h2>
      {!token && <p style={{color:'red'}}>⚠️ Connectez-vous via <a href="/login">/login</a> pour autoriser le commit SCORM.</p>}
      <iframe title="scorm-player" src={launchUrl} style={iframeStyles} />
    </main>
  );
}
