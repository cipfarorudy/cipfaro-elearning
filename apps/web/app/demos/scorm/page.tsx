export default function ScormDemoPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-slate-900">SCORM Player Demo</h1>
        <p className="mt-2 text-slate-600">Cette page accueillera le lecteur SCORM (1.2/2004). Par défaut, démo statique.</p>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <ol className="list-decimal list-inside text-sm text-slate-700 space-y-2">
            <li>Uploader un paquet SCORM (ZIP) dans votre bucket MinIO <code className="bg-slate-100 px-1.5 py-0.5 rounded">scorm</code>.</li>
            <li>Exposez une URL publique **ou** servez-le via l'API.</li>
            <li>Intégrez un lecteur (Rustici, pipwerks wrapper, ou player maison) ici.</li>
          </ol>
        </div>
      </div>
    </main>
  );
}