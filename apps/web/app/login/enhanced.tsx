'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  accessToken?: string;
  refreshToken?: string;
  error?: string;
  code?: string;
}

export default function EnhancedLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/v2/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await response.json();

      if (data.success && data.accessToken && data.refreshToken) {
        // Stocker les tokens
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Rediriger vers le dashboard selon le rôle
        switch (data.user?.role) {
          case 'ADMIN':
            router.push('/dashboard/enhanced');
            break;
          case 'FORMATEUR':
            router.push('/dashboard/enhanced');
            break;
          case 'STAGIAIRE':
            router.push('/dashboard/enhanced');
            break;
          case 'OPCO':
            router.push('/dashboard/enhanced');
            break;
          default:
            router.push('/dashboard/enhanced');
        }
      } else {
        setError(data.error || 'Erreur de connexion');
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const demoUsers = [
    { email: 'admin@cipfaro.fr', role: 'Administrateur', password: 'admin123' },
    { email: 'formateur@cipfaro.fr', role: 'Formateur', password: 'formateur123' },
    { email: 'stagiaire@cipfaro.fr', role: 'Stagiaire', password: 'stagiaire123' },
    { email: 'opco@cipfaro.fr', role: 'OPCO', password: 'opco123' }
  ];

  const fillDemoCredentials = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            CIPFARO E-Learning
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Plateforme de formation professionnelle
          </p>
        </div>

        {/* Formulaire de connexion */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-red-400">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connexion...
                  </div>
                ) : (
                  'Se connecter'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Comptes de démonstration */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Comptes de démonstration
          </h3>
          <div className="space-y-2">
            {demoUsers.map((user, index) => (
              <button
                key={index}
                onClick={() => fillDemoCredentials(user.email, user.password)}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.role}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <span className="text-blue-600 text-sm">Utiliser →</span>
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Cliquez sur un compte pour remplir automatiquement les champs
          </p>
        </div>

        {/* Fonctionnalités */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Fonctionnalités disponibles
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-xs text-gray-600">Dashboard par rôle</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📚</div>
              <p className="text-xs text-gray-600">Modules SCORM</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📅</div>
              <p className="text-xs text-gray-600">Planning sessions</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🔄</div>
              <p className="text-xs text-gray-600">CI/CD Pipeline</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            CIPFARO E-Learning Platform © 2024
          </p>
        </div>
      </div>
    </div>
  );
}