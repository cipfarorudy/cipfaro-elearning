'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const features = [
    {
      title: 'Dashboard par rôle',
      description: 'Interface personnalisée selon votre profil utilisateur',
      icon: '📊',
      status: '✅ Amélioré',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Upload SCORM',
      description: 'Interface drag & drop pour importer vos modules e-learning',
      icon: '📚',
      status: '✅ Fonctionnel',
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'Planning Sessions',
      description: 'Calendrier interactif pour gérer vos formations',
      icon: '📅',
      status: '✅ Disponible',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      title: 'CI/CD Pipeline',
      description: 'Déploiement automatisé avec GitHub Actions',
      icon: '🔄',
      status: '✅ Actif',
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      title: 'Authentification JWT',
      description: 'Système de sécurité avancé avec tokens',
      icon: '🔐',
      status: '🆕 Nouveau',
      color: 'bg-indigo-50 border-indigo-200'
    },
    {
      title: 'API REST Complète',
      description: 'Endpoints sécurisés pour toutes les fonctionnalités',
      icon: '🚀',
      status: '🆕 Nouveau',
      color: 'bg-pink-50 border-pink-200'
    }
  ];

  const stats = [
    { label: 'Modules SCORM', value: '25+', icon: '📖' },
    { label: 'Utilisateurs actifs', value: '150+', icon: '👥' },
    { label: 'Sessions terminées', value: '500+', icon: '✅' },
    { label: 'Taux de réussite', value: '92%', icon: '📈' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">CIPFARO E-Learning</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    Bonjour, {user?.firstName || 'Utilisateur'}
                  </span>
                  <Link
                    href="/dashboard/enhanced"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                </div>
              ) : (
                <Link
                  href="/login/v2"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Se connecter
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Plateforme E-Learning
            <span className="block text-blue-600">Nouvelle Génération</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Découvrez notre plateforme de formation professionnelle complètement repensée avec 
            authentification JWT, dashboards dynamiques et API REST sécurisée.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login/v2"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
                >
                  Accéder à la plateforme
                </Link>
                <Link
                  href="#features"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors text-lg font-medium"
                >
                  Découvrir les fonctionnalités
                </Link>
              </>
            ) : (
              <Link
                href="/dashboard/enhanced"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
              >
                Accéder au Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Plateforme en chiffres
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-blue-600 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Fonctionnalités Avancées
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Plateforme complète avec toutes les fonctionnalités demandées, 
              plus des améliorations significatives de sécurité et d'expérience utilisateur.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${feature.color} border rounded-xl p-6 transition-all hover:shadow-lg hover:scale-105`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <span className="inline-block bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                  {feature.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Architecture Technique
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stack technologique moderne avec Next.js, TypeScript, Express, Prisma et PostgreSQL
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-6">Frontend</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-blue-600">⚛️</span>
                  <span>Next.js 14 avec App Router</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-blue-600">📘</span>
                  <span>TypeScript pour la sécurité des types</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-blue-600">🎨</span>
                  <span>Tailwind CSS pour le design</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-blue-600">📱</span>
                  <span>Interface responsive et moderne</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-6">Backend</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-green-600">🚀</span>
                  <span>Express.js avec TypeScript</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-green-600">🔐</span>
                  <span>Authentification JWT + Refresh tokens</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-green-600">🗄️</span>
                  <span>Prisma ORM + PostgreSQL</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-green-600">🔄</span>
                  <span>CI/CD avec GitHub Actions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Prêt à commencer ?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Accédez dès maintenant à la plateforme de formation professionnelle 
            la plus avancée du marché.
          </p>
          {!isAuthenticated ? (
            <Link
              href="/login/v2"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium inline-block"
            >
              Se connecter maintenant
            </Link>
          ) : (
            <Link
              href="/dashboard/enhanced"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium inline-block"
            >
              Accéder au Dashboard
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">CIPFARO E-Learning</h4>
              <p className="text-gray-400">
                Plateforme de formation professionnelle nouvelle génération
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Fonctionnalités</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Dashboard personnalisé</li>
                <li>Modules SCORM</li>
                <li>Planning sessions</li>
                <li>Rapports avancés</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation API</li>
                <li>Guides utilisateur</li>
                <li>Support technique</li>
                <li>Formation admin</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CIPFARO E-Learning Platform. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}