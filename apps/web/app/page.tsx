// app/page.tsx (Next.js 14 / App Router)
// Single-file landing page for "CIPFARO E‑Learning" — TailwindCSS, framer-motion, lucide-react
// Drop this into your Next.js app at app/page.tsx and ensure Tailwind is configured.

import { ArrowRight, BookOpen, Users2, CheckCircle2, TrendingUp, ShieldCheck, LayoutDashboard, UploadCloud, CalendarDays, GitBranch, Cog, Server } from "lucide-react";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header / Nav */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/75 bg-white/90 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-sky-600 flex items-center justify-center text-white font-bold">CI</div>
            <span className="font-semibold">CIPFARO E‑Learning</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="hover:text-sky-700">Fonctionnalités</a>
            <a href="#stats" className="hover:text-sky-700">Chiffres</a>
            <a href="#tech" className="hover:text-sky-700">Architecture</a>
            <a href="#support" className="hover:text-sky-700">Support</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="/login/v2" className="hidden sm:inline-block rounded-2xl border border-slate-300 px-4 py-2 text-sm hover:bg-white">Documentation</a>
            <a href="/login/v2" className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700">
              Accéder au Dashboard <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-sky-50 via-white to-slate-50" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.5}}>
              <p className="inline-flex items-center gap-2 rounded-full bg-sky-100 text-sky-800 px-3 py-1 text-xs font-semibold mb-4">
                Plateforme E‑Learning Nouvelle Génération
              </p>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-slate-900">
                Formation professionnelle <span className="text-sky-600">sécurisée</span>,
                <br className="hidden sm:block" /> interactive et <span className="text-sky-600">scalable</span>
              </h1>
              <p className="mt-5 text-lg text-slate-600 max-w-xl">
                Découvrez notre plateforme repensée : authentification JWT, dashboards dynamiques par rôle,
                modules SCORM et API REST sécurisée — prête pour la production.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="/login/v2" className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-white font-semibold shadow-sm hover:bg-sky-700">
                  Accéder au Dashboard <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#features" className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-5 py-3 font-semibold hover:bg-white">
                  Voir les fonctionnalités
                </a>
              </div>
            </motion.div>
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.6, delay:0.1}} className="lg:justify-self-end">
              <div className="relative rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 p-6">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {icon: BookOpen, label: "Modules SCORM", value: "25+"},
                    {icon: Users2, label: "Utilisateurs actifs", value: "150+"},
                    {icon: CheckCircle2, label: "Sessions terminées", value: "500+"},
                    {icon: TrendingUp, label: "Taux de réussite", value: "92%"},
                  ].map((item, i) => (
                    <div key={i} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <item.icon className="h-4 w-4" /> {item.label}
                      </div>
                      <div className="mt-2 text-3xl font-bold">{item.value}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-xs text-slate-500">Données indicatives — démo</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-slate-900">Fonctionnalités avancées</h2>
            <p className="mt-2 text-slate-600">Plateforme complète avec sécurité renforcée et UX soignée.</p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard icon={LayoutDashboard} title="Dashboard par rôle" status="Amélioré" desc="Interface personnalisée selon profil: admin, formateur, apprenant." />
            <FeatureCard icon={UploadCloud} title="Upload SCORM" status="Fonctionnel" desc="Import drag & drop, validation automatique et versioning." />
            <FeatureCard icon={CalendarDays} title="Planning Sessions" status="Disponible" desc="Calendrier interactif pour gérer formations et participants." />
            <FeatureCard icon={GitBranch} title="CI/CD Pipeline" status="Actif" desc="Déploiement automatisé via GitHub Actions et revues." />
            <FeatureCard icon={ShieldCheck} title="Authentification JWT" status="Nouveau" badgeTone="sky" desc="Access/refresh tokens, rotation, RBAC et audit logs." />
            <FeatureCard icon={Server} title="API REST Complète" status="Nouveau" badgeTone="sky" desc="Endpoints sécurisés (rate‑limit, CORS, validation schémas)." />
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section id="tech" className="py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Architecture technique</h3>
              <p className="mt-2 text-slate-600">Stack moderne, robuste et maintenable pour l'échelle.</p>
              <div className="mt-6 grid sm:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h4 className="font-semibold">Frontend</h4>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc list-inside">
                    <li>Next.js 14 (App Router)</li>
                    <li>TypeScript (sécurité des types)</li>
                    <li>Tailwind CSS (design system)</li>
                    <li>Interface responsive et moderne</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h4 className="font-semibold">Backend</h4>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc list-inside">
                    <li>Express.js (TypeScript)</li>
                    <li>Prisma ORM + PostgreSQL</li>
                    <li>JWT + Refresh tokens</li>
                    <li>CI/CD avec GitHub Actions</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="lg:justify-self-end">
              <div className="relative rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 p-6">
                <h4 className="font-semibold mb-4">Sécurité & Observabilité</h4>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <Bullet text="RBAC par rôles (admin/formateur/apprenant)" />
                  <Bullet text="Rate‑limiting & protection brute force" />
                  <Bullet text="Validation schémas (Zod/Yup)" />
                  <Bullet text="Logs structurés & audit trail" />
                  <Bullet text="CORS finement configuré" />
                  <Bullet text="Migrations Prisma automatisées" />
                </div>
                <div className="mt-6 text-xs text-slate-500">Prêt pour la conformité Qualiopi & bonnes pratiques RGPD (à compléter côté DPA).</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support / Docs */}
      <section id="support" className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Prêt à commencer ?</h3>
              <p className="mt-2 text-slate-600">Accédez à la plateforme et explorez la documentation pour démarrer rapidement.</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href="/login/v2" className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-white font-semibold shadow-sm hover:bg-sky-700">
                  Accéder au Dashboard <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#docs" className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-5 py-3 font-semibold hover:bg-white">
                  Documentation API
                </a>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50">
              <div className="grid sm:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold">Fonctionnalités</h4>
                  <ul className="mt-3 space-y-2 text-slate-600 list-disc list-inside">
                    <li>Dashboard personnalisé</li>
                    <li>Modules SCORM</li>
                    <li>Planning sessions</li>
                    <li>Rapports avancés</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">Support</h4>
                  <ul className="mt-3 space-y-2 text-slate-600 list-disc list-inside">
                    <li>Guides utilisateur</li>
                    <li>Documentation API</li>
                    <li>Support technique</li>
                    <li>Formation admin</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-sm text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} <span className="font-semibold">CIPFARO E‑Learning Platform</span>. Tous droits réservés.
          </div>
          <div className="flex items-center gap-6">
            <a href="#legal" className="hover:text-slate-900">Mentions légales</a>
            <a href="#privacy" className="hover:text-slate-900">Confidentialité</a>
            <a href="#contact" className="hover:text-slate-900">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon: Icon, title, status, desc, badgeTone = "emerald" }: { icon: any; title: string; status: string; desc: string; badgeTone?: "emerald" | "sky" }) {
  const toneMap: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-800",
    sky: "bg-sky-100 text-sky-800",
  };
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
          <Icon className="h-5 w-5 text-slate-700" />
        </div>
        <span className={`text-xs font-semibold rounded-full px-2 py-1 ${toneMap[badgeTone]}`}>{status}</span>
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{desc}</p>
    </div>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-600" />
      <span>{text}</span>
    </div>
  );
}