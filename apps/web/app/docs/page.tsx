export default function DocsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-slate-900">Documentation Technique</h1>
        <ul className="mt-4 list-disc list-inside text-slate-700 space-y-2">
          <li>API REST — auth JWT, endpoints, conventions.</li>
          <li>SCORM — stockage MinIO, structure des paquets, lecture.</li>
          <li>CI/CD — GitHub Actions, docker build/push.</li>
        </ul>
      </div>
    </main>
  );
}