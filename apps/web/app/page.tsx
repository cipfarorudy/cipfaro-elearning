import { ArrowRight, BookOpen, Server } from "lucide-react";

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-sky-600 flex items-center justify-center text-white font-bold">CI</div>
            <span className="font-semibold">CIPFARO ELearning</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/dashboard" className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700">
              Dashboard <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-slate-900 mb-6">
            Plateforme E-Learning <span className="text-sky-600">CIPFARO</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Formation professionnelle sécurisée avec authentification JWT, modules SCORM et API REST.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-sky-700">
              Voir Demo <ArrowRight className="h-5 w-5" />
            </a>
            <a href="/demos/api-health" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-50">
              API Status <Server className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <BookOpen className="h-12 w-12 text-sky-600 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Modules SCORM</h3>
              <p className="text-slate-600">Support complet SCORM 1.2 avec suivi des progressions</p>
            </div>
            <div className="text-center p-6">
              <Server className="h-12 w-12 text-sky-600 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">API Sécurisée</h3>
              <p className="text-slate-600">REST API avec authentification JWT et protection CORS</p>
            </div>
            <div className="text-center p-6">
              <ArrowRight className="h-12 w-12 text-sky-600 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Prêt Production</h3>
              <p className="text-slate-600">Docker, monitoring et déploiement automatisé</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-2xl bg-sky-600 flex items-center justify-center text-white font-bold">CI</div>
            <span className="font-semibold">CIPFARO ELearning Platform</span>
          </div>
          <p className="text-sm text-slate-400"> 2024 CIPFARO ELearning. Plateforme e-learning moderne et sécurisée.</p>
        </div>
      </footer>
    </main>
  );
}
