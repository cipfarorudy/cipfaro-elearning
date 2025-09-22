'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

interface DashboardStats {
  usersCount?: number;
  modulesCount?: number;
  sessionsCount?: number;
  recentUsers?: number;
  activeUsers?: number;
  completedModules?: number;
  recentSessions?: number;
  myModules?: number;
  totalEnrollments?: number;
  completedEnrollments?: number;
  enrolledModules?: number;
  inProgressModules?: number;
  averageProgress?: number;
  financedModules?: number;
  totalLearners?: number;
  averageCompletionRate?: number;
}

interface Activity {
  id: string;
  action: string;
  details: any;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Module {
  id: string;
  title: string;
  description: string;
  duration?: number;
  createdAt: string;
  enrollmentCount: number;
  userProgress?: number;
  userCompleted?: boolean;
}

export default function EnhancedDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats>({});
  const [activities, setActivities] = useState<Activity[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Charger les données en parallèle
      const [statsResponse, activitiesResponse, modulesResponse] = await Promise.all([
        fetch('/api/dashboard/stats', { headers }),
        fetch('/api/dashboard/recent-activity?limit=5', { headers }),
        fetch('/api/dashboard/modules', { headers })
      ]);

      if (!statsResponse.ok || !activitiesResponse.ok || !modulesResponse.ok) {
        throw new Error('Erreur lors du chargement des données');
      }

      const [statsData, activitiesData, modulesData] = await Promise.all([
        statsResponse.json(),
        activitiesResponse.json(),
        modulesResponse.json()
      ]);

      setUser(statsData.user);
      setStats(statsData.stats);
      setActivities(activitiesData.activities);
      setModules(modulesData.modules);

    } catch (err) {
      console.error('Erreur dashboard:', err);
      setError('Impossible de charger les données du dashboard');
      // Si erreur d'authentification, rediriger vers login
      if (err instanceof Error && err.message.includes('401')) {
        localStorage.removeItem('accessToken');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const getRoleDisplayName = (role: string) => {
    const roles = {
      'ADMIN': 'Administrateur',
      'FORMATEUR': 'Formateur',
      'STAGIAIRE': 'Stagiaire',
      'OPCO': 'OPCO'
    };
    return roles[role as keyof typeof roles] || role;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionDisplayName = (action: string) => {
    const actions = {
      'LOGIN_SUCCESS': 'Connexion réussie',
      'USER_CREATED': 'Utilisateur créé',
      'MODULE_COMPLETED': 'Module terminé',
      'MODULE_STARTED': 'Module commencé'
    };
    return actions[action as keyof typeof actions] || action;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">CIPFARO Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {getRoleDisplayName(user?.role || '')}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques selon le rôle */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {user?.role === 'ADMIN' && (
            <>
              <StatCard 
                title="Utilisateurs actifs" 
                value={stats.activeUsers || 0} 
                icon="👥" 
                color="blue" 
              />
              <StatCard 
                title="Modules totaux" 
                value={stats.modulesCount || 0} 
                icon="📚" 
                color="green" 
              />
              <StatCard 
                title="Sessions récentes" 
                value={stats.recentSessions || 0} 
                icon="🎯" 
                color="purple" 
              />
              <StatCard 
                title="Nouveaux utilisateurs" 
                value={stats.recentUsers || 0} 
                icon="✨" 
                color="yellow" 
              />
            </>
          )}

          {user?.role === 'FORMATEUR' && (
            <>
              <StatCard 
                title="Mes modules" 
                value={stats.myModules || 0} 
                icon="📖" 
                color="blue" 
              />
              <StatCard 
                title="Inscriptions totales" 
                value={stats.totalEnrollments || 0} 
                icon="👥" 
                color="green" 
              />
              <StatCard 
                title="Modules terminés" 
                value={stats.completedEnrollments || 0} 
                icon="✅" 
                color="purple" 
              />
              <StatCard 
                title="Taux de réussite" 
                value={Math.round(((stats.completedEnrollments || 0) / (stats.totalEnrollments || 1)) * 100)} 
                icon="📊" 
                color="yellow" 
                suffix="%" 
              />
            </>
          )}

          {user?.role === 'STAGIAIRE' && (
            <>
              <StatCard 
                title="Modules inscrits" 
                value={stats.enrolledModules || 0} 
                icon="📚" 
                color="blue" 
              />
              <StatCard 
                title="Modules terminés" 
                value={stats.completedModules || 0} 
                icon="✅" 
                color="green" 
              />
              <StatCard 
                title="En cours" 
                value={stats.inProgressModules || 0} 
                icon="⏳" 
                color="purple" 
              />
              <StatCard 
                title="Progression moyenne" 
                value={stats.averageProgress || 0} 
                icon="📈" 
                color="yellow" 
                suffix="%" 
              />
            </>
          )}

          {user?.role === 'OPCO' && (
            <>
              <StatCard 
                title="Modules financés" 
                value={stats.financedModules || 0} 
                icon="💰" 
                color="blue" 
              />
              <StatCard 
                title="Apprenants totaux" 
                value={stats.totalLearners || 0} 
                icon="🎓" 
                color="green" 
              />
              <StatCard 
                title="Taux de completion" 
                value={stats.averageCompletionRate || 0} 
                icon="📊" 
                color="purple" 
                suffix="%" 
              />
              <StatCard 
                title="ROI Formation" 
                value={85} 
                icon="📈" 
                color="yellow" 
                suffix="%" 
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Activité récente */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Activité récente
            </h3>
            <div className="space-y-4">
              {activities.length > 0 ? activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">📝</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {getActionDisplayName(activity.action)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.user.firstName} {activity.user.lastName} • {formatDate(activity.createdAt)}
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-sm">Aucune activité récente</p>
              )}
            </div>
          </div>

          {/* Modules */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {user?.role === 'FORMATEUR' ? 'Mes modules' : 'Modules'}
            </h3>
            <div className="space-y-4">
              {modules.slice(0, 5).map((module) => (
                <div key={module.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                      {module.title}
                    </h4>
                    <span className="text-xs text-gray-500 ml-2">
                      {module.enrollmentCount} inscrits
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {module.description}
                  </p>
                  {user?.role === 'STAGIAIRE' && (
                    <div className="flex items-center justify-between">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${module.userProgress || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {module.userProgress || 0}%
                      </span>
                    </div>
                  )}
                </div>
              ))}
              {modules.length === 0 && (
                <p className="text-gray-500 text-sm">Aucun module disponible</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant StatCard
interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'yellow';
  suffix?: string;
}

function StatCard({ title, value, icon, color, suffix = '' }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <span className="text-xl">{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {value}{suffix}
          </p>
        </div>
      </div>
    </div>
  );
}